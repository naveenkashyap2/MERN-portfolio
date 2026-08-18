const LocationSession = require('../models/LocationSession');
const LocationPoint = require('../models/LocationPoint');
const { randomToken } = require('../utils/tokens');
const { ApiError } = require('../utils/ApiError');
const { assert, coord, rejectUnknown } = require('../utils/validate');
const { haversineKm, walkingEtaMinutes, inRadius } = require('../utils/distance');
const { LOCATION_RADII, ARRIVAL_CONFIRMATIONS } = require('../constants');
const { audit } = require('./audit.service');
const { env } = require('../config/env');

function requireConsent(req) {
  const header = req.header('X-Consent-Location');
  const body = req.body?.consent === true;
  assert(header === 'granted' || body, 'Location permission is required.', 403, 'NO_CONSENT');
}

async function start(req) {
  requireConsent(req);
  rejectUnknown(req.body, [
    'consent',
    'tripId',
    'destination',
    'destinationRadius',
    'latitude',
    'longitude',
    'accuracy',
  ]);
  const radius = Number(req.body.destinationRadius || 100);
  assert(LOCATION_RADII.includes(radius), 'Radius must be 50, 100, or 250 metres.');
  const dest = req.body.destination || {};
  if (dest.lat != null) coord(dest.lat, dest.lng);

  await LocationSession.updateMany(
    { userId: req.user._id, status: 'active' },
    { $set: { status: 'stopped', endedAt: new Date() } }
  );

  const sessionId = randomToken(16);
  const startPoint =
    req.body.latitude != null ? coord(req.body.latitude, req.body.longitude) : null;

  const session = await LocationSession.create({
    sessionId,
    userId: req.user._id,
    tripId: req.body.tripId || null,
    destination: {
      name: dest.name || '',
      lat: dest.lat ?? null,
      lng: dest.lng ?? null,
    },
    destinationRadius: radius,
    consentAt: new Date(),
    lastLat: startPoint?.lat ?? null,
    lastLng: startPoint?.lng ?? null,
  });

  if (startPoint) {
    await LocationPoint.create({
      userId: req.user._id,
      tripId: session.tripId,
      sessionId,
      latitude: startPoint.lat,
      longitude: startPoint.lng,
      accuracy: req.body.accuracy ?? null,
    });
  }

  await audit('location.start', req, { sessionId });
  return { session };
}

async function loadOwnedSession(req, sessionId) {
  const id = sessionId || req.body.sessionId || req.query.sessionId;
  assert(id, 'sessionId is required.');
  const session = await LocationSession.findOne({ sessionId: id, userId: req.user._id });
  if (!session) throw new ApiError(404, 'Location session not found.', { code: 'NOT_FOUND' });
  return session;
}

async function update(req) {
  requireConsent(req);
  rejectUnknown(req.body, ['consent', 'sessionId', 'latitude', 'longitude', 'accuracy', 'timestamp']);
  const session = await loadOwnedSession(req, req.body.sessionId);
  assert(session.status === 'active', 'Tracking is not active.');
  const point = coord(req.body.latitude, req.body.longitude);

  if (session.lastLat != null) {
    const step = haversineKm(
      { lat: session.lastLat, lng: session.lastLng },
      point
    );
    if (step < 0.005) {
      return { session, skipped: true };
    }
    session.distanceTravelled += step;
  }

  session.lastLat = point.lat;
  session.lastLng = point.lng;

  if (session.destination?.lat != null) {
    const arrived = inRadius(point, session.destination, session.destinationRadius);
    session.arrivalConfirms = arrived ? session.arrivalConfirms + 1 : 0;
    if (session.arrivalConfirms >= ARRIVAL_CONFIRMATIONS && !session.arrivedAt) {
      session.arrivedAt = new Date();
    }
  }

  await session.save();
  await LocationPoint.create({
    userId: req.user._id,
    tripId: session.tripId,
    sessionId: session.sessionId,
    latitude: point.lat,
    longitude: point.lng,
    accuracy: req.body.accuracy ?? null,
    timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
  });

  return { session };
}

async function stop(req) {
  rejectUnknown(req.body, ['sessionId']);
  const session = await loadOwnedSession(req, req.body.sessionId);
  session.status = 'stopped';
  session.endedAt = new Date();
  await session.save();
  await audit('location.stop', req, { sessionId: session.sessionId });
  return { session };
}

async function current(req) {
  const session = req.query.sessionId
    ? await loadOwnedSession(req, req.query.sessionId)
    : await LocationSession.findOne({ userId: req.user._id, status: 'active' }).sort({
        startedAt: -1,
      });
  if (!session) return { session: null, point: null };
  return {
    session,
    point:
      session.lastLat != null
        ? { lat: session.lastLat, lng: session.lastLng, accuracy: null }
        : null,
  };
}

async function history(req) {
  const session = await loadOwnedSession(req, req.query.sessionId);
  const points = await LocationPoint.find({
    userId: req.user._id,
    sessionId: session.sessionId,
  })
    .sort({ timestamp: 1 })
    .limit(500)
    .lean();
  return {
    sessionId: session.sessionId,
    points: points.map((p) => ({
      lat: p.latitude,
      lng: p.longitude,
      accuracy: p.accuracy,
      timestamp: p.timestamp,
    })),
    retentionDays: env.locationRetentionDays,
  };
}

async function distance(req) {
  const session = await loadOwnedSession(req, req.query.sessionId);
  let remainingKm = null;
  let etaMinutes = null;
  if (session.lastLat != null && session.destination?.lat != null) {
    remainingKm = Number(
      haversineKm(
        { lat: session.lastLat, lng: session.lastLng },
        { lat: session.destination.lat, lng: session.destination.lng }
      ).toFixed(2)
    );
    etaMinutes = walkingEtaMinutes(remainingKm);
  }
  return {
    travelledKm: Number(session.distanceTravelled.toFixed(2)),
    remainingKm,
    etaMinutes,
  };
}

async function arrivalStatus(req) {
  const session = await loadOwnedSession(req, req.query.sessionId);
  const arrived = Boolean(session.arrivedAt);
  return {
    arrived,
    confirms: session.arrivalConfirms,
    needed: ARRIVAL_CONFIRMATIONS,
    radius: session.destinationRadius,
    arrivedAt: session.arrivedAt,
    message: arrived ? "You've arrived!" : 'Still on the way.',
  };
}

async function deleteHistory(req) {
  await LocationPoint.deleteMany({ userId: req.user._id });
  await LocationSession.deleteMany({ userId: req.user._id });
  await audit('location.history_deleted', req, {});
  return { ok: true };
}

module.exports = {
  start,
  update,
  stop,
  current,
  history,
  distance,
  arrivalStatus,
  deleteHistory,
};
