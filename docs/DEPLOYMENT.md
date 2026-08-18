# Deployment

## Production checklist
1. Set `NODE_ENV=production`.
2. Provide `MONGODB_URI`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET` (startup fails closed if missing).
3. Optionally set `GEMINI_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
4. Set `CLIENT_URL` and `CORS_ORIGINS` to the exact frontend origin.
5. Serve over TLS; HttpOnly refresh cookies are `Secure` in production.

## Build & serve

```bash
# frontend
cd client && npm run build        # outputs client/dist

# backend
cd server && npm start            # node src/server.js
```

Serve `client/dist` with the Express app (add a static handler) or a CDN/static host, keeping the
API under `/api/v1`. Configure the frontend build so `/api` resolves to the API origin.

## Env example
See `server/.env.example` and `client/.env.example`.

## Health checks
`GET /api/v1/health` · `GET /api/v1/health/database` · `GET /api/v1/health/services`

## Monitoring
Watch API latency, error rate, DB latency, Gemini failures/usage, provider failures,
authentication failures and rate-limit events. Every request carries an `X-Request-ID`.
