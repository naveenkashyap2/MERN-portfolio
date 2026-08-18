const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.accessTtl });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, env.refreshSecret, {
    expiresIn: `${env.refreshTtlDays}d`,
  });
}

function verifyAccess(token) {
  return jwt.verify(token, env.jwtSecret);
}

function verifyRefresh(token) {
  return jwt.verify(token, env.refreshSecret);
}

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function cookieOptions({ maxAgeMs, path = '/' }) {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path,
    maxAge: maxAgeMs,
  };
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccess,
  verifyRefresh,
  randomToken,
  hashToken,
  cookieOptions,
};
