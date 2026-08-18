const RouteCache = require('../models/RouteCache');
const maps = require('../providers/maps/geometricMapsProvider');
const transport = require('../providers/transport/unverifiedTransportProvider');
const { ApiError } = require('../utils/ApiError');
const { assert, coord, objectId, rejectUnknown } = require('../utils/validate');
const { findCity } = require('../providers/places/catalogPlacesProvider');

function resolvePoint(input) {
  if (input?.lat != null && input?.lng != null) {
    return { ...coord(input.lat, input.lng), name: input.name || '' };
  }
  if (typeof input === 'string' || input?.name) {
    const city = findCity(input.name || input);
    assert(city, 'Could not resolve that place. Try a major Indian city.');
    return { lat: city.lat, lng: city.lng, name: city.name };
  }
  throw new ApiError(400, 'Origin and destination are required.');
}

async function saveRoute(userId, result) {
  const doc = await RouteCache.create({
    userId,
    mode: result.mode || 'compare',
    origin: result.origin,
    destination: result.destination,
    distanceKm: result.distanceKm,
    durationMinutes: result.durationMinutes,
    trust: result.trust,
    provider: result.provider || 'geometric',
    geometry: result.geometry || [],
    comparison: result.options || result.comparison || null,
  });
  return { ...result, routeId: String(doc._id) };
}

async function plan(req, mode = 'driving') {
  rejectUnknown(req.body, ['origin', 'destination', 'mode']);
  const origin = resolvePoint(req.body.origin);
  const destination = resolvePoint(req.body.destination);
  const usedMode = req.body.mode || mode;
  const result = maps.plan({ origin, destination, mode: usedMode });
  return saveRoute(req.user._id, result);
}

async function compare(req) {
  rejectUnknown(req.body, ['origin', 'destination', 'from', 'to']);
  const origin = resolvePoint(req.body.origin || req.body.from);
  const destination = resolvePoint(req.body.destination || req.body.to);
  const mapCompare = maps.compare(origin, destination);
  const transit = transport.compare({ from: origin.name, to: destination.name });
  const result = {
    ...mapCompare,
    origin,
    destination,
    transportEstimates: transit,
    mode: 'compare',
  };
  return saveRoute(req.user._id, result);
}

async function getRoute(req) {
  objectId(req.params.routeId, 'routeId');
  const route = await RouteCache.findOne({ _id: req.params.routeId, userId: req.user._id });
  if (!route) throw new ApiError(404, 'Route not found.', { code: 'NOT_FOUND' });
  return { route };
}

async function walkingDistance(req) {
  const origin = resolvePoint({ lat: req.query.fromLat, lng: req.query.fromLng, name: req.query.from });
  const destination = resolvePoint({ lat: req.query.toLat, lng: req.query.toLng, name: req.query.to });
  return maps.plan({ origin, destination, mode: 'walking' });
}

module.exports = { plan, compare, getRoute, walkingDistance };
