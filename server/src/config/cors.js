const { env } = require('./env');

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const allow = new Set([env.clientUrl, ...env.corsExtraOrigins]);
  if (allow.has(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname.endsWith('.e2b.app') || hostname.endsWith('.e2b.dev')) return true;
  } catch {
    return false;
  }
  return false;
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Consent-Location'],
  exposedHeaders: ['X-Request-ID'],
  maxAge: 600,
};

module.exports = { corsOptions, isAllowedOrigin };
