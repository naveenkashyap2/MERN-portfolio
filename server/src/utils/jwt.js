import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from './ApiError.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d`,
  });
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.');
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
  } catch {
    throw ApiError.unauthorized('Your session has expired. Please sign in again.');
  }
}

/** Milliseconds until a JWT expires (for client-side expiry UX). */
export function tokenExpiryMs(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded?.exp) return 0;
    return decoded.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
}
