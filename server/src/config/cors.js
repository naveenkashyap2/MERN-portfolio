import env from './env.js';

/**
 * CORS policy for YatraGenie.
 *
 * Never use `Access-Control-Allow-Origin: *` for authenticated APIs.
 * Origins are allowlisted through the CORS_ORIGINS environment variable.
 * In development we additionally allow requests without an Origin header
 * (curl / server-to-server) plus the sandbox preview host.
 */
export default function corsOptions() {
  const allowlist = new Set(env.CORS_ORIGINS);

  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true); // non-browser clients
      if (allowlist.has('*')) return callback(null, true);
      if (allowlist.has(origin)) return callback(null, true);
      // Allow any e2b preview host in non-production environments.
      if (!env.isProd && /\.e2b\.app$/.test(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    maxAge: 86400,
  };
}
