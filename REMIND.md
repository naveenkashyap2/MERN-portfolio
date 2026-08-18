# REMIND.md — YatraGenie AI

Quick reference for anyone working on this project.

## Purpose
YatraGenie AI is an AI-powered travel operating system for India. Users describe a trip (origin,
destination, dates, budget, preferences) and the system produces a complete itinerary, budget
breakdown, transport and hotel suggestions, then supports them on the ground with live trip mode,
walking mode, arrival detection, expense tracking and an AI assistant.

## Setup
```bash
# backend
cd server && cp .env.example .env && npm install && npm run dev

# frontend
cd client && npm install && npm run dev
```
Demo account: `demo@yatragenie.ai` / `Demo@1234`

## Environment variables
See `server/.env.example`:
`MONGODB_URI`, `USE_MEMORY_STORE`, `PORT`, `CLIENT_URL`, `CORS_ORIGINS`,
`JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL_DAYS`,
`GEMINI_API_KEY`, `GEMINI_MODEL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## Folder architecture
- `client/src/` — app/, components/, features/, pages/, hooks/, services/, lib/, utils/, constants/, context/, styles/
- `server/src/` — config/, controllers/, models/, routes/, services/, providers/, middleware/, validators/, prompts/, utils/, store/

## Security rules
- Never expose `GEMINI_API_KEY` / `GOOGLE_CLIENT_SECRET` to the frontend.
- Never trust `userId`/`role` from request bodies — identity comes from the verified JWT.
- Object-level authorization: returning 404 (not 403) for resources you don't own.
- Refresh-token rotation + reuse detection; HttpOnly cookies in production.
- Rate limiting on auth, AI, and location endpoints.

## Gemini rules
- React NEVER calls Gemini directly. All AI requests go through `POST /api/v1/ai/*` / `/api/v1/assistant/chat`.
- Raw Gemini output is JSON-parsed → schema-validated (Zod) → business-validated → sanitized → saved.
- Gemini must never invent live availability, exact prices, coordinates, or opening hours.

## Location rules
- Tracking is OFF by default and requires explicit consent.
- Never collect precise location without permission; apply a retention policy (Mongo TTL index).

## Provider architecture
External data (maps, transport, hotels, places) lives behind adapter interfaces in
`server/src/providers/`. Business services call the interface, so a real provider can be swapped in
without changing business logic. Demo adapters always label their output "estimate".

## Database rules
- Mongoose schemas in `server/src/models`; in-memory store (demo) in `server/src/store`.
- Indexes: User.email, Trip.userId/createdAt, Expense.tripId, Favorite.userId, Location.userId, etc.
- Never run arbitrary Mongo queries from user input.

## Testing
`cd server && npm test` (node:test). Unit: validators, distance, budget calculations, AI parsers.
Integration: auth, trips, AI, location, expenses, favorites.

## Deployment
Build client (`npm run build`), serve `dist/` behind the Express app or a static host; set
`NODE_ENV=production`, real `MONGODB_URI` + secrets, TLS everywhere, and CORS origin allowlist.

## Known limitations
- Demo mode uses an in-memory store (data resets on restart).
- Transport/hotel/place data are editorial estimates until a verified provider is connected.
- Email delivery for verification/reset is stubbed (tokens returned in demo mode).

## Do-not-do list
- Do NOT expose secrets, store plain passwords, or commit `.env`.
- Do NOT fake live availability, coordinates, or provider data.
- Do NOT save raw AI output blindly.
- Do NOT log passwords/tokens/API keys.
- Do NOT use `Access-Control-Allow-Origin: *` for authenticated APIs.
- Do NOT leak stack traces or DB errors to clients in production.
