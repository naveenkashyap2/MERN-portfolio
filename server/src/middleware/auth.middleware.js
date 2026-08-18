import { verifyAccessToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { store } from '../store/index.js';

/**
 * Resolve the authenticated user from the Authorization header.
 * Identity always comes from the verified token — never from the request body.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw ApiError.unauthorized('You need to be signed in to do that.');

  const payload = verifyAccessToken(token);
  const user = await store.users.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('This account is no longer available.');

  req.user = user;
  req.auth = { userId: user.id, role: user.role, tokenId: payload.jti };
  next();
});

/** Optionally attach the user when a valid token is present (never errors). */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      const user = await store.users.findById(payload.sub);
      if (user) {
        req.user = user;
        req.auth = { userId: user.id, role: user.role };
      }
    } catch {
      /* anonymous */
    }
  }
  next();
});

export const requireUser = (req, _res, next) => {
  if (!req.user) throw ApiError.unauthorized('You need to be signed in to do that.');
  next();
};

export const requireAdmin = (req, _res, next) => {
  if (!req.user) throw ApiError.unauthorized();
  if (req.user.role !== 'admin') throw ApiError.forbidden('Admin access required.');
  next();
};

/**
 * Object-level authorization helper: ensure the resolved resource belongs to
 * the authenticated user. Returns 404 (not 403) so existence is never leaked.
 */
export function assertOwnership(resource, userId) {
  if (!resource || String(resource.userId) !== String(userId)) {
    throw ApiError.notFound('We could not find that.');
  }
  return resource;
}
