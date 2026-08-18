import { store } from '../store/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { newId } from '../store/memory.js';
import { haversineMeters, walkingMinutes } from '../utils/distance.js';

/** POST /api/v1/location/start */
export const start = asyncHandler(async (req, res) => {
  const session = {
    sessionId: newId('ses'),
    userId: req.user.id,
    tripId: req.body.tripId || null,
    startedAt: new Date().toISOString(),
    endedAt: null,
    status: 'active',
    destination: req.body.destination || null,
    destinationRadius: req.body.destinationRadius || 100,
    distanceTravelled: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.locationSessions.insert(session);
  store.audit({ userId: req.user.id, action: 'location_tracking_started', resource: 'session', resourceId: session.sessionId, req });
  return created(res, { session });
});

/** POST /api/v1/location/update */
export const update = asyncHandler(async (req, res) => {
  const { latitude, longitude, accuracy, sessionId, tripId } = req.body;

  // Update distance travelled for the session.
  let session = null;
  if (sessionId) session = store.locationSessions.find((s) => s.sessionId === sessionId);
  if (session && session.userId !== req.user.id) session = null;

  let delta = 0;
  const last = store.locationPoints
    .filter((p) => p.userId === req.user.id && (!sessionId || p.sessionId === sessionId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  if (last) delta = haversineMeters(last.latitude, last.longitude, latitude, longitude);
  if (session) {
    store.locationSessions.update(session.sessionId, {
      distanceTravelled: (session.distanceTravelled || 0) + delta,
      updatedAt: new Date().toISOString(),
    });
  }

  const point = {
    id: newId('loc'),
    userId: req.user.id,
    tripId: tripId || session?.tripId || null,
    sessionId: sessionId || session?.sessionId || null,
    latitude,
    longitude,
    accuracy: accuracy ?? null,
    timestamp: new Date().toISOString(),
  };
  store.locationPoints.insert(point);
  return created(res, { point });
});

/** POST /api/v1/location/stop */
export const stop = asyncHandler(async (req, res) => {
  const session = store.locationSessions.find((s) => s.sessionId === req.body.sessionId);
  if (!session || session.userId !== req.user.id) throw ApiError.notFound('Session not found.');
  store.locationSessions.update(session.sessionId, { status: 'ended', endedAt: new Date().toISOString() });
  store.audit({ userId: req.user.id, action: 'location_tracking_stopped', resource: 'session', resourceId: session.sessionId, req });
  return ok(res, { message: 'Tracking stopped.' });
});

/** GET /api/v1/location/current */
export const current = asyncHandler(async (req, res) => {
  const point = store.locationPoints
    .filter((p) => p.userId === req.user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  const session = store.locationSessions.find((s) => s.userId === req.user.id && s.status === 'active');
  return ok(res, { point: point || null, session: session || null });
});

/** DELETE /api/v1/location/history — privacy control: wipe location points. */
export const deleteHistory = asyncHandler(async (req, res) => {
  const removed = store.locationPoints.removeWhere((p) => p.userId === req.user.id);
  store.locationSessions.removeWhere((s) => s.userId === req.user.id);
  store.audit({ userId: req.user.id, action: 'location_history_deleted', resource: 'location', req, meta: { points: removed } });
  return ok(res, { message: 'Location history deleted.', removed });
});

/** GET /api/v1/location/history */
export const history = asyncHandler(async (req, res) => {
  const points = store.locationPoints
    .filter((p) => p.userId === req.user.id && (!req.query.tripId || p.tripId === req.query.tripId))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .slice(-500);
  return ok(res, { points, count: points.length });
});

/** GET /api/v1/location/distance */
export const distance = asyncHandler(async (req, res) => {
  const session = req.query.sessionId
    ? store.locationSessions.find((s) => s.sessionId === req.query.sessionId)
    : store.locationSessions.find((s) => s.userId === req.user.id && s.status === 'active');
  if (!session) return ok(res, { distanceTravelled: 0, session: null });

  let remaining = null;
  if (session.destination) {
    const current = store.locationPoints
      .filter((p) => p.sessionId === session.sessionId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    if (current) {
      remaining = haversineMeters(current.latitude, current.longitude, session.destination.latitude, session.destination.longitude);
    }
  }

  return ok(res, {
    sessionId: session.sessionId,
    distanceTravelled: Math.round(session.distanceTravelled || 0),
    remainingMeters: remaining ? Math.round(remaining) : null,
    etaMinutes: remaining ? walkingMinutes(remaining) : null,
  });
});

/** GET /api/v1/location/arrival-status */
export const arrivalStatus = asyncHandler(async (req, res) => {
  const session = store.locationSessions.find((s) => s.userId === req.user.id && s.status === 'active');
  if (!session) return ok(res, { arrived: false, reason: 'no-active-session' });

  const current = store.locationPoints
    .filter((p) => p.sessionId === session.sessionId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  if (!current) return ok(res, { arrived: false, reason: 'no-fix' });

  if (session.destination) {
    const d = haversineMeters(current.latitude, current.longitude, session.destination.latitude, session.destination.longitude);
    const radius = session.destinationRadius || 100;
    return ok(res, { arrived: d <= radius, distanceMeters: Math.round(d), radius, accuracy: current.accuracy ?? null });
  }
  return ok(res, { arrived: false, reason: 'no-destination' });
});
