import { store } from '../store/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import { newId } from '../store/memory.js';
import { createToken } from '../utils/id.js';
import { assertOwnership } from '../middleware/auth.middleware.js';
import { normalizeCity } from '../services/ai.service.js';

function publicTrip(trip) {
  const { userId, ...rest } = trip;
  return rest;
}

/** POST /api/v1/trips */
export const createTrip = asyncHandler(async (req, res) => {
  const now = new Date().toISOString();
  const trip = {
    id: newId('trp'),
    userId: req.user.id,
    title: req.body.title || `${req.body.origin} → ${req.body.destination}`,
    origin: normalizeCity(req.body.origin),
    destination: normalizeCity(req.body.destination),
    startDate: req.body.startDate || null,
    endDate: req.body.endDate || null,
    travelers: req.body.travelers || { adults: 1, children: 0 },
    budget: req.body.budget ?? 5000,
    travelStyle: req.body.travelStyle || 'comfort',
    transportPreference: req.body.transportPreference || 'any',
    stayPreference: req.body.stayPreference || 'medium',
    interests: req.body.interests || [],
    status: 'planned',
    overview: req.body.overview || '',
    itinerary: req.body.itinerary || [],
    budgetBreakdown: req.body.budgetBreakdown || {},
    shareEnabled: false,
    shareToken: null,
    aiGenerated: Boolean(req.body.aiGenerated),
    aiModel: req.body.aiModel || null,
    createdAt: now,
    updatedAt: now,
  };
  store.trips.insert(trip);
  store.audit({ userId: req.user.id, action: 'trip_created', resource: 'trip', resourceId: trip.id, req });
  return created(res, { trip: publicTrip(trip) });
});

/** GET /api/v1/trips */
export const listTrips = asyncHandler(async (req, res) => {
  const status = req.query.status;
  let trips = store.trips.listByUser(req.user.id);
  if (status) trips = trips.filter((t) => t.status === status);
  return ok(res, { trips: trips.map(publicTrip), total: trips.length });
});

/** GET /api/v1/trips/:tripId */
export const getTrip = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);
  return ok(res, { trip: publicTrip(trip) });
});

/** PATCH /api/v1/trips/:tripId */
export const updateTrip = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);

  const editable = ['title', 'origin', 'destination', 'startDate', 'endDate', 'travelers', 'budget', 'travelStyle', 'transportPreference', 'stayPreference', 'interests', 'status', 'overview'];
  const patch = { updatedAt: new Date().toISOString() };
  for (const key of editable) {
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  }
  const updated = store.trips.update(trip.id, patch);
  store.audit({ userId: req.user.id, action: 'trip_updated', resource: 'trip', resourceId: trip.id, req });
  return ok(res, { trip: publicTrip(updated) });
});

/** DELETE /api/v1/trips/:tripId */
export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);
  store.expenses.removeWhere((e) => e.tripId === trip.id);
  store.trips.remove(trip.id);
  store.audit({ userId: req.user.id, action: 'trip_deleted', resource: 'trip', resourceId: trip.id, req });
  return ok(res, { message: 'Trip deleted.' });
});

/** POST /api/v1/trips/:tripId/duplicate */
export const duplicateTrip = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);
  const copy = {
    ...trip,
    id: newId('trp'),
    title: `${trip.title} (copy)`,
    status: 'planned',
    shareToken: null,
    shareEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.trips.insert(copy);
  return created(res, { trip: publicTrip(copy) });
});

/** POST /api/v1/trips/:tripId/share */
export const shareTrip = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);
  const token = trip.shareToken || createToken(16);
  const updated = store.trips.update(trip.id, { shareEnabled: true, shareToken: token, updatedAt: new Date().toISOString() });
  const link = `${req.protocol}://${req.get('host')}/api/v1/trips/${trip.id}/share/${token}`;
  store.audit({ userId: req.user.id, action: 'trip_shared', resource: 'trip', resourceId: trip.id, req });
  return ok(res, { trip: publicTrip(updated), shareToken: token, shareLink: link });
});

/** GET /api/v1/trips/:tripId/share/:shareToken — view-only public link. */
export const getSharedTrip = asyncHandler(async (req, res) => {
  const trip = store.trips.findById(req.params.tripId);
  if (!trip || !trip.shareEnabled || trip.shareToken !== req.params.shareToken) {
    throw ApiError.notFound('This shared trip is not available.');
  }
  // Never expose ownership or private fields on a shared link.
  const view = {
    title: trip.title,
    origin: trip.origin,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    travelers: trip.travelers,
    budget: trip.budget,
    interests: trip.interests,
    overview: trip.overview,
    itinerary: trip.itinerary,
    budgetBreakdown: trip.budgetBreakdown,
    aiGenerated: trip.aiGenerated,
  };
  return ok(res, { trip: view });
});
