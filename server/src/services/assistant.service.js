const Conversation = require('../models/Conversation');
const { ApiError } = require('../utils/ApiError');
const { assert, objectId, rejectUnknown } = require('../utils/validate');
const { paginate, pageResult } = require('../utils/pagination');
const { generateJson } = require('../providers/gemini/geminiProvider');
const { ASSISTANT_V1, buildAssistantUser } = require('../prompts/assistant.prompt.js');
const { loadOwnedTrip } = require('./trip.service');
const { replan, budgetOptimize } = require('./ai.service');
const { nearby } = require('../providers/places/catalogPlacesProvider');

function localReply(message, trip) {
  const q = message.toLowerCase();
  if (/budget|kharcha|kam kar/i.test(q)) {
    return {
      reply: trip
        ? `Is trip ka budget ₹${trip.budget} hai. Main cheaper stay aur free attractions suggest kar sakta hoon — “Optimize Budget” daba do.`
        : 'Budget kam karne ke liye pehle ek trip kholo, phir Optimize Budget use karo.',
      actions: ['reduce_cost'],
      cards: [],
    };
  }
  if (/late|late ho/i.test(q)) {
    return {
      reply: 'Chalo replan karte hain. High-priority stops rakhenge, baaki drop. “I\'m Late” action use karo.',
      actions: ['replan'],
      cards: [],
    };
  }
  if (/gurudwara/i.test(q)) {
    return {
      reply: 'Spiritual stops ke liye Explore → Gurudwaras dekho. Delhi mein Bangla Sahib aur Sis Ganj catalog-verified hain.',
      actions: ['add_spiritual', 'find_nearby'],
      cards: [],
    };
  }
  if (/kharcha|total/i.test(q) && trip) {
    return {
      reply: `Planned budget ₹${trip.budget}. Ye estimate hai, live booking nahi.`,
      actions: [],
      cards: [{ type: 'budget', budget: trip.budget }],
    };
  }
  if (/walk|10 km/i.test(q)) {
    return {
      reply: 'Walking mode 1 km se 10+ km tak support karta hai. Live trip mein Start Walking use karo — GPS consent ke baad.',
      actions: ['walking_mode'],
      cards: [],
    };
  }
  return {
    reply:
      'Main YatraGenie hoon. Trip optimize, budget kam, nearby mandir/gurudwara, ya “I\'m late” replan — bolo kya chahiye.',
    actions: ['optimize', 'find_nearby'],
    cards: [],
  };
}

async function createConversation(req) {
  rejectUnknown(req.body, ['title', 'tripId']);
  const convo = await Conversation.create({
    userId: req.user._id,
    tripId: req.body.tripId || null,
    title: String(req.body.title || 'New conversation').slice(0, 120),
  });
  return { conversation: convo };
}

async function listConversations(req) {
  const { page, limit, skip } = paginate(req.query);
  const filter = { userId: req.user._id };
  const [items, total] = await Promise.all([
    Conversation.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).select('-messages'),
    Conversation.countDocuments(filter),
  ]);
  return pageResult(items, total, page, limit);
}

async function getConversation(req) {
  objectId(req.params.conversationId, 'conversationId');
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    userId: req.user._id,
  });
  if (!conversation) throw new ApiError(404, 'Conversation not found.', { code: 'NOT_FOUND' });
  return { conversation };
}

async function deleteConversation(req) {
  const { conversation } = await getConversation(req);
  await conversation.deleteOne();
  return { ok: true };
}

async function chat(req) {
  rejectUnknown(req.body, ['message', 'conversationId', 'tripId']);
  const message = String(req.body.message || '').trim();
  assert(message.length > 0 && message.length <= 2000, 'Please type a message.');

  let conversation;
  if (req.body.conversationId) {
    conversation = (await getConversation({ ...req, params: { conversationId: req.body.conversationId } })).conversation;
  } else {
    conversation = await Conversation.create({
      userId: req.user._id,
      tripId: req.body.tripId || null,
      title: message.slice(0, 48),
    });
  }

  let trip = null;
  const tripId = req.body.tripId || conversation.tripId;
  if (tripId) {
    try {
      trip = await loadOwnedTrip(req, String(tripId));
    } catch {
      trip = null;
    }
  }

  conversation.messages.push({ role: 'user', content: message });

  const result = await generateJson({
    system: ASSISTANT_V1.system,
    user: buildAssistantUser({
      message,
      tripContext: trip
        ? {
            title: trip.title,
            origin: trip.origin.name,
            destination: trip.destination.name,
            budget: trip.budget,
            status: trip.status,
          }
        : null,
      preferences: req.user.preferences,
    }),
    requestId: req.requestId,
  });

  let payload;
  if (result.ok && result.data?.reply) {
    payload = {
      reply: String(result.data.reply).slice(0, 4000),
      actions: Array.isArray(result.data.actions) ? result.data.actions.slice(0, 8) : [],
      cards: Array.isArray(result.data.cards) ? result.data.cards.slice(0, 6) : [],
    };
  } else {
    payload = localReply(message, trip);
  }

  conversation.messages.push({
    role: 'assistant',
    content: payload.reply,
    cards: payload.cards,
  });
  await conversation.save();
  return { conversationId: conversation._id, ...payload };
}

async function assistantReplan(req) {
  rejectUnknown(req.body, ['tripId', 'reason']);
  assert(req.body.tripId, 'tripId is required.');
  return replan(req);
}

module.exports = {
  createConversation,
  listConversations,
  getConversation,
  deleteConversation,
  chat,
  assistantReplan,
  budgetOptimize,
  nearby,
};
