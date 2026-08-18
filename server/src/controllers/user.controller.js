import { store } from '../store/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { revokeAllForUser } from '../services/auth.service.js';

/** GET /api/v1/users/me */
export const getMe = asyncHandler(async (req, res) => {
  return ok(res, { user: store.users.toSafe(req.user) });
});

/** PATCH /api/v1/users/me */
export const updateMe = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar'];
  const patch = {};
  for (const key of allowed) if (req.body[key] !== undefined) patch[key] = req.body[key];
  if (patch.name !== undefined && !String(patch.name).trim()) {
    throw ApiError.badRequest('Name cannot be empty.');
  }
  const user = store.users.update(req.user.id, { ...patch, updatedAt: new Date().toISOString() });
  return ok(res, { user: store.users.toSafe(user) });
});

/** PATCH /api/v1/users/me/avatar */
export const updateAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body || {};
  if (!avatar || typeof avatar !== 'string' || avatar.length > 500) {
    throw ApiError.badRequest('Invalid avatar.');
  }
  const user = store.users.update(req.user.id, { avatar, updatedAt: new Date().toISOString() });
  return ok(res, { user: store.users.toSafe(user) });
});

/** GET /api/v1/users/me/preferences */
export const getPreferences = asyncHandler(async (req, res) => {
  return ok(res, { preferences: req.user.preferences || {} });
});

/** PATCH /api/v1/users/me/preferences */
export const updatePreferences = asyncHandler(async (req, res) => {
  const current = req.user.preferences || {};
  const next = { ...current, ...req.body };
  const user = store.users.update(req.user.id, { preferences: next, updatedAt: new Date().toISOString() });
  return ok(res, { preferences: user.preferences });
});

/** DELETE /api/v1/users/me — controlled account deletion. */
export const deleteMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const tripIds = store.trips.filter((t) => t.userId === userId).map((t) => t.id);
  store.expenses.removeWhere((e) => e.userId === userId);
  store.trips.removeWhere((t) => t.userId === userId);
  store.favorites.removeWhere((f) => f.userId === userId);
  store.conversations.removeWhere((c) => c.userId === userId);
  store.notifications.removeWhere((n) => n.userId === userId);
  store.locationPoints.removeWhere((p) => p.userId === userId);
  store.locationSessions.removeWhere((s) => s.userId === userId);
  store.refreshTokens.removeWhere((r) => r.userId === userId);
  revokeAllForUser(userId);

  store.audit({ userId, action: 'account_deleted', resource: 'user', req, meta: { trips: tripIds.length } });
  store.users.remove(userId);

  return ok(res, { message: 'Your account and all associated data have been deleted.' });
});
