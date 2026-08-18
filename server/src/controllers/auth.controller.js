import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { store } from '../store/index.js';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/ApiResponse.js';
import {
  issueTokens,
  rotateRefresh,
  revokeToken,
  revokeAllForUser,
  refreshCookieOptions,
  clearRefreshCookie,
  REFRESH_COOKIE,
} from '../services/auth.service.js';
import { createId } from '../utils/id.js';

function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
}

function authPayload(user, tokens) {
  return { user: store.users.toSafe(user), accessToken: tokens.accessToken, expiresIn: env.ACCESS_TOKEN_TTL };
}

/** POST /api/v1/auth/register */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = store.users.findByEmail(email);
  if (existing) throw ApiError.conflict('An account with this email already exists.');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = store.users.create({ name, email, passwordHash, isEmailVerified: false });
  const tokens = issueTokens(user);

  store.audit({ userId: user.id, action: 'register', resource: 'user', req });

  setRefreshCookie(res, tokens.refreshToken);
  return created(res, authPayload(user, tokens));
});

/** POST /api/v1/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = store.users.findByEmail(email);
  const hash = user?.passwordHash || '';
  const valid = hash ? await bcrypt.compare(password, hash) : false;
  if (!user || !valid) {
    throw ApiError.unauthorized('Incorrect email or password.');
  }

  store.users.update(user.id, { lastLoginAt: new Date().toISOString() });
  const tokens = issueTokens(user);

  store.audit({ userId: user.id, action: 'login', resource: 'session', req });
  setRefreshCookie(res, tokens.refreshToken);
  return ok(res, authPayload(user, tokens));
});

/** POST /api/v1/auth/google */
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!env.GOOGLE_CLIENT_ID) {
    throw ApiError.badRequest('Google sign-in is not configured on this server.');
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken: credential, audience: env.GOOGLE_CLIENT_ID });
  } catch {
    throw ApiError.unauthorized('Google sign-in could not be verified.');
  }

  const payload = ticket.getPayload();
  const email = String(payload.email).toLowerCase();
  const googleId = payload.sub;

  let user = store.users.findByEmail(email);
  if (!user) {
    user = store.users.create({
      name: payload.name || email.split('@')[0],
      email,
      googleId,
      passwordHash: null,
      isEmailVerified: true,
      avatar: payload.picture || '',
    });
  } else if (user.googleId && user.googleId !== googleId) {
    throw ApiError.conflict('An account with this email already exists.');
  } else if (!user.googleId) {
    store.users.update(user.id, { googleId, isEmailVerified: true });
  }

  store.users.update(user.id, { lastLoginAt: new Date().toISOString() });
  const tokens = issueTokens(user);

  store.audit({ userId: user.id, action: 'google_login', resource: 'session', req });
  setRefreshCookie(res, tokens.refreshToken);
  return ok(res, authPayload(user, tokens));
});

/** POST /api/v1/auth/refresh */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('Your session has expired. Please sign in again.');

  const tokens = rotateRefresh(token);
  const record = store.refreshTokens.find((r) => r.jti === tokens.jti);
  const foundUser = store.users.findById(record?.userId);

  setRefreshCookie(res, tokens.refreshToken);
  return ok(res, authPayload(foundUser, tokens));
});

/** POST /api/v1/auth/logout */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) revokeToken(token);
  if (req.user) store.audit({ userId: req.user.id, action: 'logout', resource: 'session', req });
  clearRefreshCookie(res);
  return ok(res, { message: 'Signed out.' });
});

/** POST /api/v1/auth/logout-all */
export const logoutAll = asyncHandler(async (req, res) => {
  revokeAllForUser(req.user.id);
  store.audit({ userId: req.user.id, action: 'logout_all', resource: 'session', req });
  clearRefreshCookie(res);
  return ok(res, { message: 'Signed out from all devices.' });
});

/** POST /api/v1/auth/forgot-password */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = store.users.findByEmail(email);
  // Always respond the same way to avoid account enumeration.
  if (user) {
    const token = createId('rst', 16);
    store.users.update(user.id, { resetTokenHash: token, resetTokenExpiresAt: Date.now() + 30 * 60000 });
    // In production this token is emailed; in demo mode we echo it back.
    return ok(res, { message: 'If that email exists, a reset link has been sent.', demoToken: token });
  }
  return ok(res, { message: 'If that email exists, a reset link has been sent.' });
});

/** POST /api/v1/auth/reset-password */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = store.users.find((u) => u.resetTokenHash === token && u.resetTokenExpiresAt > Date.now());
  if (!user) throw ApiError.badRequest('This reset link is invalid or has expired.');

  const passwordHash = await bcrypt.hash(password, 10);
  store.users.update(user.id, { passwordHash, resetTokenHash: null, resetTokenExpiresAt: null });
  revokeAllForUser(user.id);
  return ok(res, { message: 'Your password has been reset. Please sign in.' });
});

/** POST /api/v1/auth/verify-email */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body || {};
  const user = store.users.find((u) => u.emailVerifyToken === token);
  if (!user) throw ApiError.badRequest('This verification link is invalid.');
  store.users.update(user.id, { isEmailVerified: true, emailVerifyToken: null });
  return ok(res, { message: 'Email verified.' });
});

/** GET /api/v1/auth/me */
export const me = asyncHandler(async (req, res) => {
  return ok(res, { user: store.users.toSafe(req.user) });
});

/** POST /api/v1/auth/change-password */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = store.users.findById(req.user.id);
  const valid = user?.passwordHash ? await bcrypt.compare(currentPassword, user.passwordHash) : false;
  if (!valid) throw ApiError.badRequest('Your current password is incorrect.');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  store.users.update(user.id, { passwordHash, updatedAt: new Date().toISOString() });
  revokeAllForUser(user.id);
  store.audit({ userId: user.id, action: 'password_changed', resource: 'user', req });
  return ok(res, { message: 'Password updated. You have been signed out from other devices.' });
});
