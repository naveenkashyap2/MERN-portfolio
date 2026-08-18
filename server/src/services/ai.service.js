const AiUsage = require('../models/AiUsage');
const { TRIP_STATUS } = require('../constants');
const { ApiError } = require('../utils/ApiError');
const { assert, rejectUnknown } = require('../utils/validate');
const { generateJson } = require('../providers/gemini/geminiProvider');
const { TRIP_PLANNER_V1, buildUserPrompt } = require('../prompts/tripPlanner.prompt.js');
const { REPLAN_V1 } = require('../prompts/replan.prompt.js');
const { validatePlan } = require('./aiPlanValidator');
const { buildTemplatePlan, optimizeBudget, replanLate } = require('./templatePlanner');
const { loadOwnedTrip, durationDays, placeFromName, createTrip } = require('./trip.service');
const { audit } = require('./audit.service');

async function recordUsage(req, { action, success, usage = {}, failureReason = '' }) {
  await AiUsage.create({
    userId: req.user._id,
    requestId: req.requestId,
    action,
    model: usage.model || '',
    inputTokens: usage.inputTokens || 0,
    outputTokens: usage.outputTokens || 0,
    latencyMs: usage.latencyMs || 0,
    success,
    failureReason,
  });
}

function tripInputFrom(trip, extra = {}) {
  return {
    origin: trip.origin.name,
    destination: trip.destination.name,
    startDate: trip.startDate,
    endDate: trip.endDate,
    durationDays: durationDays(trip),
    travelers: trip.travelers,
    budget: extra.budget ?? trip.budget,
    transportPreference: trip.transportPreference,
    stayPreference: trip.stayPreference,
    interests: trip.interests,
    naturalLanguage: extra.naturalLanguage,
    constraint: extra.constraint,
  };
}

function applyPlan(trip, plan, source) {
  trip.itinerary = plan.itinerary;
  trip.hotels = plan.hotels;
  trip.transport = plan.transport;
  trip.expensePlan = plan.expensePlan;
  trip.aiSummary = plan.summary;
  trip.aiSource = source;
  trip.status = TRIP_STATUS.PLANNED;
  trip.generationMeta = {
    model: source === 'gemini' ? 'gemini' : 'template',
    validated: true,
    latencyMs: trip.generationMeta?.latencyMs || null,
  };
  if (!trip.title) trip.title = `${trip.origin.name} → ${plan.destination}`;
}

async function generateFromGeminiOrTemplate(req, input) {
  const result = await generateJson({
    system: TRIP_PLANNER_V1.system,
    user: buildUserPrompt(input),
    requestId: req.requestId,
  });

  if (result.ok) {
    try {
      const plan = validatePlan(result.data, input);
      if (!plan.itinerary.length) throw new Error('empty_itinerary');
      await recordUsage(req, { action: 'trip.generate', success: true, usage: result.usage });
      return { plan, source: 'gemini', usage: result.usage };
    } catch {
      await recordUsage(req, {
        action: 'trip.generate',
        success: false,
        usage: result.usage,
        failureReason: 'validation_failed',
      });
    }
  } else {
    await recordUsage(req, {
      action: 'trip.generate',
      success: false,
      usage: result.usage || {},
      failureReason: result.reason || 'gemini_failed',
    });
  }

  const plan = buildTemplatePlan(input);
  return { plan, source: 'template', usage: result.usage || {} };
}

async function generate(req) {
  rejectUnknown(req.body, [
    'tripId',
    'origin',
    'destination',
    'startDate',
    'endDate',
    'travelers',
    'budget',
    'transportPreference',
    'stayPreference',
    'interests',
    'naturalLanguage',
    'title',
  ]);

  let trip;
  if (req.body.tripId) {
    trip = await loadOwnedTrip(req, req.body.tripId);
  } else {
    const created = await createTrip(req);
    trip = created.trip;
  }

  const input = tripInputFrom(trip, {
    naturalLanguage: req.body.naturalLanguage,
    budget: req.body.budget,
  });
  const { plan, source, usage } = await generateFromGeminiOrTemplate(req, input);
  applyPlan(trip, plan, source);
  trip.generationMeta.latencyMs = usage.latencyMs || null;
  await trip.save();
  await audit('ai.trip.generate', req, { tripId: String(trip._id), source });
  return { trip, source, labeled: source === 'gemini' ? 'AI ESTIMATE' : 'ESTIMATED' };
}

async function regenerate(req) {
  rejectUnknown(req.body, ['tripId']);
  assert(req.body.tripId, 'tripId is required.');
  const trip = await loadOwnedTrip(req, req.body.tripId);
  const { plan, source } = await generateFromGeminiOrTemplate(req, tripInputFrom(trip));
  applyPlan(trip, plan, source);
  await trip.save();
  return { trip, source };
}

async function optimize(req) {
  rejectUnknown(req.body, ['tripId']);
  const trip = await loadOwnedTrip(req, req.body.tripId);
  const { plan, source } = await generateFromGeminiOrTemplate(req, {
    ...tripInputFrom(trip),
    constraint: 'Optimize for less backtracking, less fatigue, keep high-priority places.',
  });
  applyPlan(trip, plan, source);
  await trip.save();
  return { trip, source };
}

async function replan(req) {
  rejectUnknown(req.body, ['tripId', 'reason', 'constraint']);
  const trip = await loadOwnedTrip(req, req.body.tripId);
  const reason = String(req.body.reason || req.body.constraint || "I'm late.").slice(0, 400);

  const result = await generateJson({
    system: `${REPLAN_V1.system}\n${TRIP_PLANNER_V1.system}`,
    user: JSON.stringify({
      reason,
      current: {
        destination: trip.destination.name,
        budget: trip.budget,
        itinerary: trip.itinerary,
      },
    }).slice(0, 10000),
    requestId: req.requestId,
  });

  if (result.ok) {
    try {
      const plan = validatePlan(result.data, tripInputFrom(trip));
      applyPlan(trip, plan, 'gemini');
      await trip.save();
      await recordUsage(req, { action: 'trip.replan', success: true, usage: result.usage });
      return { trip, source: 'gemini' };
    } catch {
      await recordUsage(req, {
        action: 'trip.replan',
        success: false,
        usage: result.usage,
        failureReason: 'validation_failed',
      });
    }
  }

  const fallback = /budget|cheap|3500|kam/i.test(reason)
    ? optimizeBudget(
        {
          itinerary: trip.itinerary,
          hotels: trip.hotels,
          transport: trip.transport,
          expensePlan: trip.expensePlan,
          budget: trip.budget,
          summary: trip.aiSummary,
        },
        Number(String(reason).replace(/[^\d]/g, '')) || Math.round(trip.budget * 0.7)
      )
    : replanLate({
        itinerary: trip.itinerary,
        hotels: trip.hotels,
        transport: trip.transport,
        expensePlan: trip.expensePlan,
        budget: trip.budget,
        summary: trip.aiSummary,
      });
  applyPlan(trip, { ...fallback, destination: trip.destination.name, duration: durationDays(trip) }, 'template');
  await trip.save();
  return { trip, source: 'template' };
}

async function budgetOptimize(req) {
  rejectUnknown(req.body, ['tripId', 'budget']);
  const trip = await loadOwnedTrip(req, req.body.tripId);
  const budget = Number(req.body.budget);
  assert(Number.isFinite(budget) && budget >= 0, 'Enter a valid budget.');
  const { plan, source } = await generateFromGeminiOrTemplate(req, {
    ...tripInputFrom(trip, { budget }),
    constraint: `Reduce the plan to fit INR ${budget}. Keep must-see high-priority places.`,
  });
  trip.budget = budget;
  applyPlan(trip, plan, source);
  await trip.save();
  return { trip, source };
}

async function routeOptimize(req) {
  rejectUnknown(req.body, ['tripId']);
  const trip = await loadOwnedTrip(req, req.body.tripId);
  const { plan, source } = await generateFromGeminiOrTemplate(req, {
    ...tripInputFrom(trip),
    constraint: 'Reorder same-day places to minimize walking and backtracking.',
  });
  applyPlan(trip, plan, source);
  await trip.save();
  return { trip, source };
}

async function suggest(req) {
  rejectUnknown(req.body, ['destination', 'interests', 'budget']);
  const dest = req.body.destination || 'Delhi';
  const input = {
    origin: dest,
    destination: dest,
    startDate: new Date(),
    endDate: new Date(),
    durationDays: 1,
    travelers: { adults: 1, children: 0 },
    budget: Number(req.body.budget || 2000),
    transportPreference: 'walking',
    stayPreference: 'none',
    interests: req.body.interests || [],
  };
  const plan = buildTemplatePlan(input);
  return {
    destination: dest,
    suggestions: plan.itinerary.filter((i) => i.category !== 'food').slice(0, 8),
    trust: 'CATALOG',
  };
}

const { parseNaturalLanguage } = require('../utils/nlTrip');

module.exports = {
  generate,
  regenerate,
  optimize,
  replan,
  budgetOptimize,
  routeOptimize,
  suggest,
  parseNaturalLanguage,
  placeFromName,
};
