import asyncHandler from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import env from '../config/env.js';
import { isDbConnected } from '../config/db.js';
import { geminiProvider } from '../providers/gemini/index.js';

/** GET /api/v1/health */
export const health = asyncHandler(async (_req, res) => {
  return ok(res, {
    status: 'ok',
    uptime: Math.round(process.uptime()),
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
});

/** GET /api/v1/health/database */
export const database = asyncHandler(async (_req, res) => {
  const connected = isDbConnected();
  return ok(res, {
    status: connected ? 'connected' : 'memory',
    provider: connected ? 'mongodb' : 'in-memory',
    message: connected ? 'MongoDB connected.' : 'Running with in-memory store (demo mode).',
  });
});

/** GET /api/v1/health/services */
export const services = asyncHandler(async (_req, res) => {
  return ok(res, {
    gemini: { configured: geminiProvider.available(), model: geminiProvider.modelName() },
    maps: { status: 'estimate', message: 'Demo routing provider active.' },
    transport: { status: 'estimate', message: 'Demo transport provider active.' },
    hotels: { status: 'estimate', message: 'Demo hotels provider active.' },
  });
});
