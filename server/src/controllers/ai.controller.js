import { store } from '../store/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import { newId } from '../store/memory.js';
import { generateTrip, parseNaturalLanguage, normalizeCity } from '../services/ai.service.js';
import { placesProvider } from '../providers/places/index.js';
import { assertOwnership } from '../middleware/auth.middleware.js';
import ApiError from '../utils/ApiError.js';

function persist(input, req) {
  const trip = {
    id: newId('trp'),
    userId: req.user.id,
    title: input.title,
    origin: input.origin,
    destination: input.destination,
    startDate: input.startDate || null,
    endDate: input.endDate || null,
    travelers: input.travelers,
    budget: input.budget,
    travelStyle: input.travelStyle,
    transportPreference: input.transportPreference,
    stayPreference: input.stayPreference,
    interests: input.interests,
    status: 'planned',
    overview: input.overview,
    itinerary: input.itinerary,
    budgetBreakdown: input.budgetBreakdown,
    shareEnabled: false,
    shareToken: null,
    aiGenerated: true,
    aiModel: input.ai.model,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.trips.insert(trip);
  store.audit({ userId: req.user.id, action: 'ai_trip_generated', resource: 'trip', resourceId: trip.id, req });
  return trip;
}

/** POST /api/v1/ai/trip/generate — authenticated or guest demo. */
export const generate = asyncHandler(async (req, res) => {
  const input = await generateTrip(req.body);

  if (req.user) {
    const trip = persist(input, req);
    return created(res, { trip, ai: input.ai });
  }

  // Guest demo: return an ephemeral, unsaved plan.
  return created(res, { trip: { ...input, id: 'preview', userId: null }, ai: input.ai, guest: true });
});

/** POST /api/v1/ai/trip/natural-language */
export const naturalLanguage = asyncHandler(async (req, res) => {
  const parsed = parseNaturalLanguage(req.body.text);
  const merged = {
    origin: parsed.origin || 'Delhi',
    destination: parsed.destination,
    startDate: req.body.startDate || null,
    endDate: req.body.endDate || null,
    durationDays: parsed.durationDays,
    travelers: parsed.travelers || { adults: 1, children: 0 },
    budget: parsed.budget || 5000,
    transportPreference: parsed.transportPreference,
    stayPreference: parsed.stayPreference,
    interests: parsed.interests,
    travelStyle: 'comfort',
  };
  const input = await generateTrip(merged);
  const trip = req.user ? persist(input, req) : { ...input, id: 'preview', userId: null };
  return created(res, { trip, ai: input.ai, parsed });
});

/** POST /api/v1/ai/trip/regenerate */
export const regenerate = asyncHandler(async (req, res) => {
  const input = await generateTrip(req.body);
  const trip = req.user ? persist(input, req) : { ...input, id: 'preview', userId: null };
  return created(res, { trip, ai: input.ai });
});

/** POST /api/v1/ai/trip/optimize — re-sort a day's items by time. */
export const optimize = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.body.tripId);
  assertOwnership(trip, req.user.id);
  const itinerary = trip.itinerary.map((day) => ({
    ...day,
    items: [...day.items].sort((a, b) => a.time.localeCompare(b.time)),
  }));
  store.trips.update(trip.id, { itinerary, updatedAt: new Date().toISOString() });
  return ok(res, { trip: store.trips.findById(trip.id), message: 'Route optimized — stops reordered by time.' });
});

/** POST /api/v1/ai/trip/replan — trim low-priority stops, keep the highlights. */
export const replan = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.body.tripId);
  assertOwnership(trip, req.user.id);
  const reason = req.body.reason || 'I am running late';

  const itinerary = trip.itinerary.map((day) => ({
    ...day,
    items: day.items.filter((i) => i.priority !== 'low' || i.category === 'food'),
  }));

  store.trips.update(trip.id, { itinerary, updatedAt: new Date().toISOString() });
  return ok(res, {
    trip: store.trips.findById(trip.id),
    notes: `Re-planned for: "${reason}". I removed lower-priority stops and kept your must-sees.`,
  });
});

/** POST /api/v1/ai/trip/budget-optimize */
export const budgetOptimize = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.body.tripId);
  assertOwnership(trip, req.user.id);
  const target = Number(req.body.targetBudget) || Math.round(trip.budget * 0.72);

  const current = trip.budgetBreakdown || {};
  const currentTotal = Object.values(current).reduce((a, b) => a + b, 0) || trip.budget;
  const scale = target / currentTotal;
  const breakdown = {};
  for (const [key, value] of Object.entries(current)) {
    breakdown[key] = Math.round(value * scale);
  }

  store.trips.update(trip.id, { budget: target, budgetBreakdown: breakdown, stayPreference: 'budget', updatedAt: new Date().toISOString() });
  return ok(res, {
    trip: store.trips.findById(trip.id),
    message: `Budget reduced to ₹${target.toLocaleString('en-IN')}. Consider budget stays, shared autos and free attractions.`,
  });
});

/** POST /api/v1/ai/trip/route-optimize */
export const routeOptimize = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.body.tripId);
  assertOwnership(trip, req.user.id);
  const itinerary = trip.itinerary.map((day) => ({
    ...day,
    items: [...day.items].sort((a, b) => a.time.localeCompare(b.time)),
  }));
  store.trips.update(trip.id, { itinerary, updatedAt: new Date().toISOString() });
  return ok(res, { trip: store.trips.findById(trip.id), message: 'Route optimized.' });
});

/** POST /api/v1/ai/trip/suggest — recommend places for a destination. */
export const suggest = asyncHandler(async (req, res) => {
  const destination = normalizeCity(req.body.destination || req.body.origin || 'Delhi');
  const interests = req.body.interests || [];
  const suggestions = placesProvider.recommended({ interests, city: destination, limit: 8 });
  return ok(res, { suggestions, destination });
});
