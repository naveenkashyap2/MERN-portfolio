# Security

- bcrypt password hashes, never plaintext
- Short-lived JWT access + rotating HttpOnly refresh cookies
- Refresh reuse detection revokes the token family
- Helmet, CORS allowlist (no `*`), request size limits
- Mongo operator stripping
- Rate limits on auth, AI, location, search
- Gemini key only in server env
- No stack traces in production
- Audit log without secrets
- Avatar: MIME + extension + size + random filename
- Location requires explicit consent header/body
