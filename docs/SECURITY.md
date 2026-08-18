# Security

Security is non-negotiable. Key measures implemented:

## Authentication & sessions
- bcrypt password hashing (never store plain text).
- Short-lived access token (memory) + rotated refresh token (HttpOnly cookie).
- Refresh-token **reuse detection** — reusing a revoked token revokes the whole family.
- Logout revokes the current token; "logout all devices" revokes every session.

## Authorization
- Identity always comes from the verified JWT — never from `:userId` or `role` in the body.
- Object-level authorization: a trip/expense/conversation/favorite you don't own returns **404**,
  so existence is never leaked (no IDOR).

## Input & output
- Zod validation on every request body — unknown fields, invalid IDs/dates/coords/budgets rejected.
- AI output is parsed → schema-validated → business-validated → sanitized before saving.
- Central error handler: no stack traces, Mongo errors, file paths or Gemini raw errors in production.

## Transport & headers
- Helmet + `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Request-ID`.
- CORS origin allowlist (never `*` for authenticated APIs).
- Rate limiting: auth, AI, and location endpoints have tight limits.

## Secrets
- `.env` is git-ignored; `GEMINI_API_KEY` / `GOOGLE_CLIENT_SECRET` never reach the frontend.
- Prompt-injection posture: system instructions are separate from untrusted user input; the AI is
  instructed to never reveal secrets/system prompts.

## Privacy
- Location tracking is consent-first and off by default; `DELETE /location/history` wipes points.
- Mongo location points carry a 30-day TTL (retention policy).
- Account deletion cascades: trips → expenses → favorites → conversations → locations → sessions → user.

## Audit logging
Login/logout, Google login, password reset/change, trip create/delete, share, location start/stop,
location-history delete, AI requests, refresh-token reuse, account deletion — without ever logging
passwords, tokens, keys, or unnecessary precise location data.
