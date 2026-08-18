import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

function parseBool(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  isProd,
  PORT: Number(process.env.PORT) || 5000,

  MONGODB_URI: process.env.MONGODB_URI || '',
  useMemoryStore: parseBool(process.env.USE_MEMORY_STORE, !process.env.MONGODB_URI),

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  JWT_SECRET: process.env.JWT_SECRET || (isProd ? '' : 'yatragenie-dev-access-secret'),
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || (isProd ? '' : 'yatragenie-dev-refresh-secret'),
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
  REFRESH_TOKEN_TTL_DAYS: Number(process.env.REFRESH_TOKEN_TTL_DAYS) || 7,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

  // Hard safety switches for production (validated below).
  valid: true,
};

if (isProd) {
  const missing = [];
  if (!env.JWT_SECRET) missing.push('JWT_SECRET');
  if (!env.REFRESH_TOKEN_SECRET) missing.push('REFRESH_TOKEN_SECRET');
  if (missing.length) {
    // In production we must fail closed.
    throw new Error(`[env] Missing required secrets in production: ${missing.join(', ')}`);
  }
  if (!env.MONGODB_URI) {
    throw new Error('[env] MONGODB_URI is required in production');
  }
}

export default env;
