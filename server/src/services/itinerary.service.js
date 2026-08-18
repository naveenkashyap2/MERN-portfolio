const { ApiError } = require('../utils/ApiError');
const { assert, objectId, rejectUnknown } = require('../utils/validate');
const { loadOwnedTrip } = require('./trip.service');

async function listItinerary(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  return { items: trip.itinerary, tripId: trip._id };
}

async function addItem(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  rejectUnknown(req.body, [
    'day',
    'startTime',
    'endTime',
    'durationMinutes',
    'title',
    'location',
    'transportMode',
    'estimatedCost',
    'priority',
    'category',
    'notes',
  ]);
  assert(req.body.title, 'Title is required.');
  trip.itinerary.push({
    day: Number(req.body.day || 1),
    startTime: req.body.startTime || '09:00',
    endTime: req.body.endTime || '10:00',
    durationMinutes: Number(req.body.durationMinutes || 60),
    title: String(req.body.title).slice(0, 160),
    location: String(req.body.location || req.body.title).slice(0, 160),
    transportMode: String(req.body.transportMode || 'walk').slice(0, 40),
    estimatedCost: Number(req.body.estimatedCost || 0),
    priority: req.body.priority || 'medium',
    category: req.body.category || 'other',
    notes: String(req.body.notes || '').slice(0, 500),
    trust: 'ESTIMATED',
    coordinatesVerified: false,
    order: trip.itinerary.length,
  });
  await trip.save();
  return { item: trip.itinerary[trip.itinerary.length - 1], items: trip.itinerary };
}

async function updateItem(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  objectId(req.params.itemId, 'itemId');
  const item = trip.itinerary.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Itinerary item not found.', { code: 'NOT_FOUND' });
  const fields = [
    'day',
    'startTime',
    'endTime',
    'durationMinutes',
    'title',
    'location',
    'transportMode',
    'estimatedCost',
    'priority',
    'category',
    'notes',
  ];
  rejectUnknown(req.body, fields);
  fields.forEach((f) => {
    if (req.body[f] !== undefined) item[f] = req.body[f];
  });
  await trip.save();
  return { item, items: trip.itinerary };
}

async function deleteItem(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  const item = trip.itinerary.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Itinerary item not found.', { code: 'NOT_FOUND' });
  item.deleteOne();
  await trip.save();
  return { items: trip.itinerary };
}

async function reorder(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  rejectUnknown(req.body, ['order']);
  const order = req.body.order;
  assert(Array.isArray(order), 'order must be an array of item ids.');
  const map = new Map(trip.itinerary.map((i) => [String(i._id), i]));
  order.forEach((id, idx) => {
    const item = map.get(String(id));
    if (item) item.order = idx;
  });
  trip.itinerary.sort((a, b) => a.order - b.order);
  await trip.save();
  return { items: trip.itinerary, message: 'Your route has been updated.' };
}

async function byDay(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  const day = Number(req.params.day);
  assert(day >= 1, 'Invalid day.');
  return { day, items: trip.itinerary.filter((i) => i.day === day) };
}

module.exports = { listItinerary, addItem, updateItem, deleteItem, reorder, byDay };
