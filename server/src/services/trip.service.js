const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const { TRIP_STATUS, TRANSPORT, STAY, INTERESTS } = require('../constants');
const { ApiError } = require('../utils/ApiError');
const { assert, objectId, rejectUnknown, pick } = require('../utils/validate');
const { paginate, pageResult } = require('../utils/pagination');
const { findCity } = require('../providers/places/catalogPlacesProvider');
const { randomToken } = require('../utils/tokens');
const { audit } = require('./audit.service');

function placeFromName(name) {
  const city = findCity(name);
  return {
    name: city?.name || String(name).trim(),
    city: city?.name || String(name).trim(),
    state: city?.state || '',
    lat: city?.lat ?? null,
    lng: city?.lng ?? null,
    coordinatesVerified: Boolean(city),
  };
}

function travelerCount(travelers = {}) {
  return {
    adults: Math.min(20, Math.max(1, Number(travelers.adults || travelers) || 1)),
    children: Math.min(20, Math.max(0, Number(travelers.children || 0))),
  };
}

async function loadOwnedTrip(req, tripId) {
  objectId(tripId, 'tripId');
  const trip = await Trip.findById(tripId);
  if (!trip) throw new ApiError(404, 'Trip not found.', { code: 'NOT_FOUND' });
  if (String(trip.userId) !== String(req.user._id)) {
    throw new ApiError(404, 'Trip not found.', { code: 'NOT_FOUND' });
  }
  return trip;
}

async function createTrip(req) {
  rejectUnknown(req.body, [
    'title',
    'origin',
    'destination',
    'startDate',
    'endDate',
    'travelers',
    'budget',
    'travelStyle',
    'transportPreference',
    'stayPreference',
    'interests',
    'naturalLanguage',
  ]);
  const originName = req.body.origin?.name || req.body.origin;
  const destName = req.body.destination?.name || req.body.destination;
  assert(originName && destName, 'Origin and destination are required.');
  assert(req.body.startDate && req.body.endDate, 'Start and end dates are required.');
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  assert(!Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime()), 'Invalid dates.');
  assert(endDate >= startDate, 'End date must be on or after start date.');
  const budget = Number(req.body.budget);
  assert(Number.isFinite(budget) && budget >= 0 && budget <= 10000000, 'Enter a valid budget.');
  const transportPreference = req.body.transportPreference || 'any';
  const stayPreference = req.body.stayPreference || 'medium';
  assert(TRANSPORT.includes(transportPreference), 'Invalid transport preference.');
  assert(STAY.includes(stayPreference), 'Invalid stay preference.');
  const interests = req.body.interests || [];
  assert(interests.every((i) => INTERESTS.includes(i)), 'Invalid interest.');

  const origin = typeof req.body.origin === 'object' && req.body.origin.name
    ? { ...placeFromName(req.body.origin.name), ...pick(req.body.origin, ['lat', 'lng', 'city', 'state']) }
    : placeFromName(originName);
  const destination = typeof req.body.destination === 'object' && req.body.destination.name
    ? { ...placeFromName(req.body.destination.name), ...pick(req.body.destination, ['lat', 'lng', 'city', 'state']) }
    : placeFromName(destName);

  const trip = await Trip.create({
    userId: req.user._id,
    title: req.body.title || `${origin.name} → ${destination.name}`,
    origin,
    destination,
    startDate,
    endDate,
    travelers: travelerCount(req.body.travelers),
    budget,
    travelStyle: String(req.body.travelStyle || '').slice(0, 80),
    transportPreference,
    stayPreference,
    interests,
    status: TRIP_STATUS.DRAFT,
  });
  await audit('trip.create', req, { tripId: String(trip._id) });
  return { trip };
}

async function listTrips(req) {
  const { page, limit, skip } = paginate(req.query);
  const status = req.query.status;
  const filter = { userId: req.user._id };
  if (status && Object.values(TRIP_STATUS).includes(status)) filter.status = status;
  const [items, total] = await Promise.all([
    Trip.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Trip.countDocuments(filter),
  ]);
  return pageResult(items, total, page, limit);
}

async function getTrip(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  return { trip };
}

async function updateTrip(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  rejectUnknown(req.body, [
    'title',
    'origin',
    'destination',
    'startDate',
    'endDate',
    'travelers',
    'budget',
    'travelStyle',
    'transportPreference',
    'stayPreference',
    'interests',
    'status',
  ]);
  if (req.body.title !== undefined) trip.title = String(req.body.title).slice(0, 160);
  if (req.body.origin) trip.origin = placeFromName(req.body.origin.name || req.body.origin);
  if (req.body.destination) trip.destination = placeFromName(req.body.destination.name || req.body.destination);
  if (req.body.startDate) trip.startDate = new Date(req.body.startDate);
  if (req.body.endDate) trip.endDate = new Date(req.body.endDate);
  if (req.body.travelers) trip.travelers = travelerCount(req.body.travelers);
  if (req.body.budget !== undefined) {
    const budget = Number(req.body.budget);
    assert(Number.isFinite(budget) && budget >= 0, 'Enter a valid budget.');
    trip.budget = budget;
  }
  if (req.body.transportPreference) {
    assert(TRANSPORT.includes(req.body.transportPreference), 'Invalid transport.');
    trip.transportPreference = req.body.transportPreference;
  }
  if (req.body.stayPreference) {
    assert(STAY.includes(req.body.stayPreference), 'Invalid stay.');
    trip.stayPreference = req.body.stayPreference;
  }
  if (req.body.interests) {
    assert(req.body.interests.every((i) => INTERESTS.includes(i)), 'Invalid interest.');
    trip.interests = req.body.interests;
  }
  if (req.body.status) {
    assert(Object.values(TRIP_STATUS).includes(req.body.status), 'Invalid status.');
    trip.status = req.body.status;
  }
  await trip.save();
  return { trip };
}

async function deleteTrip(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  await Expense.deleteMany({ tripId: trip._id, userId: req.user._id });
  await trip.deleteOne();
  await audit('trip.delete', req, { tripId: String(trip._id) });
  return { ok: true };
}

async function duplicateTrip(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  const copy = trip.toObject();
  delete copy._id;
  delete copy.createdAt;
  delete copy.updatedAt;
  copy.title = `${trip.title} (copy)`;
  copy.share = { token: '', mode: 'private' };
  copy.status = TRIP_STATUS.DRAFT;
  copy.userId = req.user._id;
  const created = await Trip.create(copy);
  return { trip: created };
}

async function shareTrip(req) {
  const trip = await loadOwnedTrip(req, req.params.tripId);
  rejectUnknown(req.body, ['mode']);
  const mode = req.body.mode || 'view';
  assert(['view', 'collaborative', 'private'].includes(mode), 'Invalid share mode.');
  if (mode === 'private') {
    trip.share = { token: '', mode: 'private' };
  } else {
    trip.share = { token: randomToken(24), mode };
  }
  await trip.save();
  return { share: trip.share };
}

async function getSharedTrip(req) {
  objectId(req.params.tripId, 'tripId');
  const token = String(req.params.shareToken || '');
  assert(token.length >= 16, 'Invalid share link.');
  const trip = await Trip.findOne({ _id: req.params.tripId, 'share.token': token });
  if (!trip || trip.share.mode === 'private') {
    throw new ApiError(404, 'Shared trip not found.', { code: 'NOT_FOUND' });
  }
  return { trip, access: trip.share.mode };
}

function durationDays(trip) {
  const ms = new Date(trip.endDate) - new Date(trip.startDate);
  return Math.max(1, Math.round(ms / (24 * 60 * 60 * 1000)) + 1);
}

module.exports = {
  loadOwnedTrip,
  createTrip,
  listTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  shareTrip,
  getSharedTrip,
  placeFromName,
  durationDays,
};
