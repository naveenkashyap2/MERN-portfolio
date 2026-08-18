import { createHash } from 'node:crypto';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { createId } from '../utils/id.js';
import { store } from '../store/index.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

export const REFRESH_COOKIE = 'yatragenie_refresh';

export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

/** Issue an access token + a rotated, persisted refresh token. */
export function issueTokens(user, family) {
  const jti = createId('jti', 12);
  const accessToken = signAccessToken({ sub: user.id, role: user.role, jti });
  const refreshToken = signRefreshToken({ sub: user.id, jti, family: family || jti });

  store.refreshTokens.insert({
    id: jti,
    userId: user.id,
    jti,
    tokenHash: hashToken(refreshToken),
    family: family || jti,
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86400000).toISOString(),
    revoked: false,
    replacedBy: null,
    createdAt: new Date().toISOString(),
  });

  return { accessToken, refreshToken, jti };
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 86400000,
  };
}

export function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
}

/**
 * Rotate a refresh token. Detects reuse: if a revoked token is presented
 * again we revoke the whole family (classic refresh-token-reuse defence).
 */
export function rotateRefresh(refreshToken) {
  const hash = hashToken(refreshToken);
  const record = store.refreshTokens.find((r) => r.tokenHash === hash);

  if (!record) throw ApiError.unauthorized('Your session has expired. Please sign in again.');

  if (record.revoked) {
    // Reuse detected — kill the family.
    store.refreshTokens
      .filter((r) => r.family === record.family)
      .forEach((r) => store.refreshTokens.update(r.id, { revoked: true }));
    store.audit({ userId: record.userId, action: 'refresh_token_reuse', resource: 'session' });
    throw ApiError.unauthorized('Suspicious session detected. Please sign in again.');
  }

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.');
  }

  const user = store.users.findById(record.userId);
  if (!user) throw ApiError.unauthorized('This account is no longer available.');

  const tokens = issueTokens(user, record.family);
  store.refreshTokens.update(record.id, { revoked: true, replacedBy: tokens.jti });
  return tokens;
}

export function revokeToken(refreshToken) {
  const hash = hashToken(refreshToken);
  const record = store.refreshTokens.find((r) => r.tokenHash === hash);
  if (record) store.refreshTokens.update(record.id, { revoked: true });
}

export function revokeAllForUser(userId) {
  store.refreshTokens.filter((r) => r.userId === userId).forEach((r) => store.refreshTokens.update(r.id, { revoked: true }));
}
