const rateLimit = require('express-rate-limit');

function limiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message, code: 'RATE_LIMIT' },
  });
}

const authLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many authentication attempts. Please wait and try again.',
});

const aiLimiter = limiter({
  windowMs: 60 * 1000,
  max: 6,
  message: 'AI is getting a lot of requests. Please wait a moment.',
});

const locationLimiter = limiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Location updates are limited. Slow down a little.',
});

const searchLimiter = limiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Search rate limit reached.',
});

const publicLimiter = limiter({
  windowMs: 60 * 1000,
  max: 120,
  message: 'Too many requests.',
});

module.exports = { authLimiter, aiLimiter, locationLimiter, searchLimiter, publicLimiter };
