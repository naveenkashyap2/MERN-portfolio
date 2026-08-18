const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function requiredInProd(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (process.env.NODE_ENV === 'production' && !process.env[name]) {
    throw new Error(`${name} is required in production`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 5000),
  host: process.env.HOST || '0.0.0.0',
  mongoUri: process.env.MONGODB_URI || '',
  useInMemoryDb:
    process.env.USE_IN_MEMORY_DB === 'true' || !process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  corsExtraOrigins: (process.env.CORS_EXTRA_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  jwtSecret: requiredInProd(
    'JWT_SECRET',
    'dev-only-access-secret-change-me-32ch'
  ),
  refreshSecret: requiredInProd(
    'REFRESH_TOKEN_SECRET',
    'dev-only-refresh-secret-change-me-32'
  ),
  accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7),
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'YatraGenie <noreply@yatragenie.local>',
  },
  locationRetentionDays: Number(process.env.LOCATION_RETENTION_DAYS || 14),
  maxAvatarBytes: Number(process.env.MAX_AVATAR_BYTES || 2 * 1024 * 1024),
  mapsProvider: process.env.MAPS_PROVIDER || 'geometric',
};

module.exports = { env };
