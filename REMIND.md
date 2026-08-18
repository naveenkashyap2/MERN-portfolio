# YatraGenie AI — REMIND

## Purpose

Premium AI-powered Travel Operating System for India.

Budget bolo → YatraGenie tumhare liye complete trip plan kare.

## Setup

```bash
# from repo root
cp server/.env.example server/.env
cp client/.env.example client/.env

cd server && npm install
cd ../client && npm install

# run both (from root)
npm run dev
```

MongoDB: set `MONGODB_URI` for Atlas/local Mongo. If unset or `USE_IN_MEMORY_DB=true`, the API uses an in-process store (persisted to `server/.data/` in dev). Live train/hotel providers are still unverified until connected.

## Environment

See `server/.env.example` and `client/.env.example`.

Never commit `.env`. Never put `GEMINI_API_KEY` in the client.

## Folder architecture

- Frontend tree: `docs/FRONTEND.md`
- Backend APIs: `docs/API.md`
- Design: `docs/DESIGN.md`

## Security rules

- Never expose Gemini / Google secrets
- Never store plaintext passwords
- Never trust `userId` or `role` from the client
- Never invent live train/bus/hotel availability
- Never save raw Gemini output
- Never use CORS `*` for authenticated APIs
- Never return stack traces in production
- Never log passwords, tokens, or API keys

## API conventions

Base: `/api/v1`  
Identity from auth context only.  
Pagination: `page` + `limit`.  
Every request: `X-Request-ID`.

## Gemini rules

React → Express → AI Service → Prompt Builder → Gemini → JSON parse → schema → business validation → sanitize → MongoDB.

If Gemini is unavailable, use the labeled catalog/template planner. Never pretend it is live verified data.

## Location rules

Tracking default OFF. Consent required. Retention policy. Arrival uses radius + consecutive confirms.

## Provider architecture

Business services call `providers/*` adapters, never vendor APIs from controllers.

## Database rules

Strict Mongoose schemas. Indexes. Ownership checks. No arbitrary queries from user input.

## Testing

```bash
cd server && npm test
cd ../client && npm test
```

## Deployment

See `docs/DEPLOYMENT.md`.

## Known limitations

- Live train/bus/hotel availability requires a verified provider. Until connected, APIs return an explicit unverified message.
- Email delivery requires SMTP. Dev mode returns reset/verify tokens in JSON (never in production).
- Maps use catalog coordinates + geometric routes unless a maps provider key is configured.

## Do-not-do list

See PRD §93 and `docs/SECURITY.md`.
