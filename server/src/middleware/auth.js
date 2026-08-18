const { COOKIE } = require('../constants');
const { ApiError } = require('../utils/ApiError');
const { verifyAccess } = require('../utils/tokens');
const User = require('../models/User');

function readAccessToken(req) {
  const header = req.header('Authorization') || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies?.[COOKIE.access] || null;
}

async function authRequired(req, _res, next) {
  try {
    const token = readAccessToken(req);
    if (!token) throw new ApiError(401, 'Please sign in to continue.', { code: 'UNAUTHENTICATED' });
    let payload;
    try {
      payload = verifyAccess(token);
    } catch {
      throw new ApiError(401, 'Session expired. Please sign in again.', { code: 'TOKEN_EXPIRED' });
    }
    const user = await User.findById(payload.sub);
    if (!user || user.deletedAt) {
      throw new ApiError(401, 'Please sign in to continue.', { code: 'UNAUTHENTICATED' });
    }
    req.user = user;
    req.auth = { userId: String(user._id), role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

function optionalAuth(req, _res, next) {
  const token = readAccessToken(req);
  if (!token) return next();
  try {
    const payload = verifyAccess(token);
    req.auth = { userId: payload.sub, role: payload.role };
  } catch {
    // ignore invalid optional token
  }
  next();
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have access.', { code: 'FORBIDDEN' }));
    }
    next();
  };
}

module.exports = { authRequired, optionalAuth, requireRole, readAccessToken };
