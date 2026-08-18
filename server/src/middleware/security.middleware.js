import { randomUUID } from 'node:crypto';

/**
 * Lightweight hardening applied before routing:
 *  - attaches a request id for tracing / audit
 *  - explicitly disables the X-Powered-By header
 */
export function securityHeaders(req, res, next) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-ID', req.id);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  res.removeHeader('X-Powered-By');
  next();
}

/** Simple guard: strip prototype-pollution keys from request bodies. */
export function sanitizeBody(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    for (const key of Object.keys(req.body)) {
      if (dangerous.includes(key)) delete req.body[key];
    }
  }
  next();
}
