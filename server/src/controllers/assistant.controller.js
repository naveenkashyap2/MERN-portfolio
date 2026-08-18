import { store } from '../store/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { newId } from '../store/memory.js';
import { chat } from '../services/ai.service.js';
import { assertOwnership } from '../middleware/auth.middleware.js';

/** POST /api/v1/assistant/chat */
export const chatMessage = asyncHandler(async (req, res) => {
  const { message, conversationId, tripId } = req.body;

  let conversation = null;
  if (conversationId) {
    conversation = store.conversations.findById(conversationId);
    assertOwnership(conversation, req.user.id);
  }

  let trip = null;
  const resolvedTripId = tripId || conversation?.tripId;
  if (resolvedTripId) {
    trip = store.trips.findById(resolvedTripId);
    if (trip && trip.userId === req.user.id) trip = trip;
    else trip = null;
  }

  const history = (conversation?.messages || []).slice(-10).map((m) => ({ role: m.role, content: m.content }));

  // Persist the user's message.
  const userMessage = { id: newId('msg'), role: 'user', content: message, kind: 'text', data: null, createdAt: new Date().toISOString() };

  if (!conversation) {
    conversation = {
      id: newId('cnv'),
      userId: req.user.id,
      tripId: resolvedTripId || null,
      title: message.slice(0, 60),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.conversations.insert(conversation);
  }

  conversation.messages.push(userMessage);

  const reply = await chat({
    message,
    trip: trip ? { title: trip.title, destination: trip.destination, budget: trip.budget, budgetBreakdown: trip.budgetBreakdown, itinerary: trip.itinerary, stayPreference: trip.stayPreference } : null,
    preferences: req.user.preferences || {},
    history,
  });

  const assistantMessage = {
    id: newId('msg'),
    role: 'assistant',
    content: reply.content,
    kind: reply.kind,
    data: reply.data || null,
    createdAt: new Date().toISOString(),
  };
  conversation.messages.push(assistantMessage);
  store.conversations.update(conversation.id, { messages: conversation.messages, updatedAt: new Date().toISOString() });

  return ok(res, { conversationId: conversation.id, message: assistantMessage });
});

/** GET /api/v1/assistant/conversations */
export const listConversations = asyncHandler(async (req, res) => {
  const conversations = store.conversations.listByUser(req.user.id).map((c) => ({
    id: c.id,
    title: c.title,
    tripId: c.tripId,
    updatedAt: c.updatedAt,
    messageCount: c.messages.length,
  }));
  return ok(res, { conversations });
});

/** POST /api/v1/assistant/conversations */
export const createConversation = asyncHandler(async (req, res) => {
  const conversation = {
    id: newId('cnv'),
    userId: req.user.id,
    tripId: req.body.tripId || null,
    title: req.body.title || 'New conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.conversations.insert(conversation);
  return created(res, { conversation });
});

/** GET /api/v1/assistant/conversations/:conversationId */
export const getConversation = asyncHandler(async (req, res) => {
  const conversation = store.conversations.findById(req.params.conversationId);
  assertOwnership(conversation, req.user.id);
  return ok(res, { conversation });
});

/** DELETE /api/v1/assistant/conversations/:conversationId */
export const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = store.conversations.findById(req.params.conversationId);
  assertOwnership(conversation, req.user.id);
  store.conversations.remove(conversation.id);
  return ok(res, { message: 'Conversation deleted.' });
});

/** POST /api/v1/assistant/replan */
export const replan = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.body.tripId);
  if (!trip || trip.userId !== req.user.id) throw ApiError.notFound('We could not find that trip.');
  const itinerary = trip.itinerary.map((day) => ({
    ...day,
    items: day.items.filter((i) => i.priority !== 'low' || i.category === 'food'),
  }));
  store.trips.update(trip.id, { itinerary, updatedAt: new Date().toISOString() });
  return ok(res, { trip: store.trips.findById(trip.id), notes: 'I trimmed low-priority stops to catch you up.' });
});
