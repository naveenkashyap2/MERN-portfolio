import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const skipInTest = () => env.NODE_ENV === 'test';

function make({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: skipInTest,
    message: { success: false, message },
  });
}

// Tight limits on credential endpoints.
export const authLimiter = make({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many sign-in attempts. Please try again in a few minutes.',
});

// AI endpoints are expensive — strict per-user limits.
export const aiLimiter = make({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'You have reached the AI request limit for this hour. Try again later.',
});

// Location updates are frequent but must stay bounded.
export const locationLimiter = make({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Location updates are too frequent. Please slow down.',
});

export const generalLimiter = make({
  windowMs: 60 * 1000,
  max: 120,
  message: 'Too many requests. Please slow down.',
});
