import { store } from '../store/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import { newId } from '../store/memory.js';
import { assertOwnership } from '../middleware/auth.middleware.js';

function getTrip(req) {
  const trip = store.trips.findById(req.params.tripId);
  assertOwnership(trip, req.user.id);
  return trip;
}

function findDay(trip, day) {
  return trip.itinerary.find((d) => Number(d.day) === Number(day));
}

/** GET /api/v1/trips/:tripId/itinerary */
export const getItinerary = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  return ok(res, { itinerary: trip.itinerary || [] });
});

/** GET /api/v1/trips/:tripId/itinerary/day/:day */
export const getDay = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const day = findDay(trip, req.params.day);
  if (!day) throw ApiError.notFound('That day was not found.');
  return ok(res, { day });
});

/** POST /api/v1/trips/:tripId/itinerary */
export const addItem = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const dayNumber = req.body.day || 1;
  const item = { id: newId('itm'), ...req.body.item };

  let day = findDay(trip, dayNumber);
  if (!day) {
    day = { id: newId('day'), day: dayNumber, title: `Day ${dayNumber}`, summary: '', items: [] };
    trip.itinerary.push(day);
  }
  day.items.push(item);

  const updated = store.trips.update(trip.id, { itinerary: trip.itinerary, updatedAt: new Date().toISOString() });
  store.audit({ userId: req.user.id, action: 'itinerary_add', resource: 'trip', resourceId: trip.id, req });
  return created(res, { item });
});

/** PATCH /api/v1/trips/:tripId/itinerary/:itemId */
export const updateItem = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  let updatedItem = null;
  for (const day of trip.itinerary) {
    const idx = day.items.findIndex((i) => i.id === req.params.itemId);
    if (idx !== -1) {
      day.items[idx] = { ...day.items[idx], ...req.body, id: day.items[idx].id };
      updatedItem = day.items[idx];
      break;
    }
  }
  if (!updatedItem) throw ApiError.notFound('That itinerary item was not found.');
  store.trips.update(trip.id, { itinerary: trip.itinerary, updatedAt: new Date().toISOString() });
  return ok(res, { item: updatedItem });
});

/** DELETE /api/v1/trips/:tripId/itinerary/:itemId */
export const deleteItem = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  let removed = false;
  for (const day of trip.itinerary) {
    const before = day.items.length;
    day.items = day.items.filter((i) => i.id !== req.params.itemId);
    if (day.items.length !== before) removed = true;
  }
  if (!removed) throw ApiError.notFound('That itinerary item was not found.');
  store.trips.update(trip.id, { itinerary: trip.itinerary, updatedAt: new Date().toISOString() });
  return ok(res, { message: 'Item removed.' });
});

/** POST /api/v1/trips/:tripId/itinerary/reorder */
export const reorder = asyncHandler(async (req, res) => {
  const trip = getTrip(req);
  const { day: dayNumber, itemIds } = req.body;

  const day = dayNumber ? findDay(trip, dayNumber) : trip.itinerary[0];
  if (!day) throw ApiError.notFound('That day was not found.');

  const orderMap = new Map(itemIds.map((id, i) => [id, i]));
  day.items.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));

  store.trips.update(trip.id, { itinerary: trip.itinerary, updatedAt: new Date().toISOString() });
  store.audit({ userId: req.user.id, action: 'itinerary_reorder', resource: 'trip', resourceId: trip.id, req });
  return ok(res, { message: 'Your route has been updated.', itinerary: trip.itinerary });
});
