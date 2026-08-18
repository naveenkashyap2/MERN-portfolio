# YatraGenie AI — Backend API Contract

**Status:** LOCKED  
**Base path:** `/api/v1`  
**Rule:** Backend APIs must be implemented exactly according to this catalog. Do not rename, drop, or invent alternate public paths without updating this file first.

This is the single source of truth for all backend HTTP endpoints.

---

## Global conventions

- JSON request/response only (except avatar upload).
- Authenticated routes derive identity from the secure session/token context. Never trust `userId` or `role` from the request body.
- Object-level authorization on every resource (trips, expenses, location, conversations, favorites, notifications).
- Pagination: `page` + `limit` (or cursor where noted). Never return unbounded collections.
- Every response includes request correlation via `X-Request-ID`.
- Production errors never leak stack traces, Mongo errors, or secrets.
- Gemini is backend-only. Never expose `GEMINI_API_KEY`.
- Transport/hotel live availability is shown only when a verified provider returns it. Otherwise: `"Live availability could not be verified."`

---

## 🔐 AUTH APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/auth/register` | Public (rate-limited) | Email/password signup |
| POST | `/api/v1/auth/login` | Public (rate-limited) | Email/password login |
| POST | `/api/v1/auth/google` | Public (rate-limited) | Verify Google credential on backend, find-or-create user |
| POST | `/api/v1/auth/refresh` | Refresh cookie | Rotate refresh token, issue new access token |
| POST | `/api/v1/auth/logout` | Auth | Invalidate current session |
| POST | `/api/v1/auth/forgot-password` | Public (rate-limited) | Start password reset |
| POST | `/api/v1/auth/reset-password` | Public (rate-limited) | Complete password reset |
| GET | `/api/v1/auth/me` | Auth | Current authenticated principal |
| POST | `/api/v1/auth/verify-email` | Public / token | Confirm email verification |

### Auth notes

- Register fields: `name`, `email`, `password`
- Password: min 8 chars, uppercase, lowercase, number, special character
- Store `passwordHash` only. Never store or log plaintext passwords or tokens.
- Google OAuth: verify credential server-side. Never trust frontend identity payload. Never expose Google client secret.
- Sessions: short-lived access token + HttpOnly refresh cookie, rotation, reuse detection, logout invalidation.

---

## 👤 USER APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/users/me` | Auth | Profile |
| PATCH | `/api/v1/users/me` | Auth | Update profile |
| DELETE | `/api/v1/users/me` | Auth | Controlled account deletion (user → trips → expenses → favorites → conversations → location → sessions → account) |
| PATCH | `/api/v1/users/me/preferences` | Auth | Travel / budget / transport / hotel / interests |
| GET | `/api/v1/users/me/preferences` | Auth | Read preferences |
| PATCH | `/api/v1/users/me/avatar` | Auth | Avatar upload (MIME, size, extension, random filename) |

Identity always comes from the authenticated user. Never accept `:userId` from the client for authorization.

---

## ✈️ TRIP APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/trips` | Auth | Create trip |
| GET | `/api/v1/trips` | Auth | List own trips (paginated) |
| GET | `/api/v1/trips/:tripId` | Auth + ownership | Trip detail |
| PATCH | `/api/v1/trips/:tripId` | Auth + ownership | Update trip |
| DELETE | `/api/v1/trips/:tripId` | Auth + ownership | Delete trip |
| POST | `/api/v1/trips/:tripId/duplicate` | Auth + ownership | Duplicate trip |
| POST | `/api/v1/trips/:tripId/share` | Auth + ownership | Create random share token (private / view-only / collaborative) |
| GET | `/api/v1/trips/:tripId/share/:shareToken` | Token | Access shared trip; never use predictable IDs alone |

Default trip visibility: **private**.

Trip fields include: `origin`, `destination`, `startDate`, `endDate`, `travelers`, `budget`, `transportPreference`, `stayPreference`, `interests`, `status`.

---

## 🤖 AI TRIP PLANNER APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/ai/trip/generate` | Auth (strict AI rate limit) | Generate itinerary via Gemini pipeline |
| POST | `/api/v1/ai/trip/regenerate` | Auth (strict AI rate limit) | Regenerate plan |
| POST | `/api/v1/ai/trip/optimize` | Auth (strict AI rate limit) | Optimize itinerary |
| POST | `/api/v1/ai/trip/replan` | Auth (strict AI rate limit) | Replan (e.g. “I'm late”) |
| POST | `/api/v1/ai/trip/budget-optimize` | Auth (strict AI rate limit) | Shrink plan to a new budget |
| POST | `/api/v1/ai/trip/route-optimize` | Auth (strict AI rate limit) | Optimize routes |
| POST | `/api/v1/ai/trip/suggest` | Auth (strict AI rate limit) | Suggestions |

### AI pipeline (mandatory)

```
React → Express → AI Controller → AI Service → Prompt Builder → Gemini
  → Structured JSON → Schema validation → Business validation → Sanitize → MongoDB → Frontend
```

- Never call Gemini from the frontend.
- Never persist raw Gemini output.
- Never invent live train/bus/hotel availability, exact ticket prices, coordinates, or opening hours.
- Track tokens, latency, success/failure per user/request.
- Prompt-injection: user input is untrusted. System instructions stay isolated.

---

## 🗓️ ITINERARY APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/trips/:tripId/itinerary` | Auth + ownership | Full itinerary |
| POST | `/api/v1/trips/:tripId/itinerary` | Auth + ownership | Add item |
| PATCH | `/api/v1/trips/:tripId/itinerary/:itemId` | Auth + ownership | Update item |
| DELETE | `/api/v1/trips/:tripId/itinerary/:itemId` | Auth + ownership | Remove item |
| POST | `/api/v1/trips/:tripId/itinerary/reorder` | Auth + ownership | Reorder items |
| GET | `/api/v1/trips/:tripId/itinerary/day/:day` | Auth + ownership | Day-wise itinerary |

Itinerary item: start/end time, duration, location, verified coordinates only, distance, transport mode, estimated cost, priority, category, notes.

---

## 📍 LOCATION APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/location/start` | Auth + consent | Start tracking session (default OFF) |
| POST | `/api/v1/location/update` | Auth + active session | Update point (throttled) |
| POST | `/api/v1/location/stop` | Auth + ownership | Stop session |
| GET | `/api/v1/location/current` | Auth + ownership | Current point |
| GET | `/api/v1/location/history` | Auth + ownership | History (retention policy) |
| GET | `/api/v1/location/distance` | Auth + ownership | Distance travelled / remaining |
| GET | `/api/v1/location/arrival-status` | Auth + ownership | Arrival detection (50m / 100m / 250m + consecutive confirms) |

Never enable tracking silently. Never collect precise location without permission. Do not store every GPS point forever.

---

## 🗺️ ROUTE / MAP APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/routes/plan` | Auth | Plan route |
| POST | `/api/v1/routes/walking` | Auth | Walking route |
| POST | `/api/v1/routes/driving` | Auth | Driving route |
| POST | `/api/v1/routes/transit` | Auth | Transit route |
| POST | `/api/v1/routes/compare` | Auth | Compare fastest / cheapest / shortest / comfort / walking-friendly |
| GET | `/api/v1/routes/:routeId` | Auth + ownership | Saved/cached route |

Provider adapter: `providers/maps`. Business logic must not call map vendor APIs directly.

---

## 🚆 TRAIN APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/transport/trains/search` | Auth / public search policy | Search trains |
| GET | `/api/v1/transport/trains/:trainId` | Auth / public search policy | Train details |
| GET | `/api/v1/transport/trains/:trainId/schedule` | Auth / public search policy | Schedule |
| GET | `/api/v1/transport/trains/availability` | Auth / public search policy | Verified availability only |

If provider is down or not connected: do **not** invent availability.

---

## 🚌 BUS APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/transport/buses/search` | Auth / public search policy | Search buses |
| GET | `/api/v1/transport/buses/:busId` | Auth / public search policy | Bus details |
| GET | `/api/v1/transport/buses/:busId/schedule` | Auth / public search policy | Schedule |
| GET | `/api/v1/transport/buses/availability` | Auth / public search policy | Verified availability only |

---

## 🚶 WALKING APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/walking/route` | Auth | Walking route (1 km to 10+ km) |
| GET | `/api/v1/walking/distance` | Auth | Distance |
| GET | `/api/v1/walking/eta` | Auth | Walking ETA |

---

## 🏨 HOTEL APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/hotels/search` | Auth / public search policy | Search + filters |
| GET | `/api/v1/hotels/:hotelId` | Auth / public search policy | Hotel details |
| GET | `/api/v1/hotels/recommended` | Auth | Ranked recommendations |
| GET | `/api/v1/hotels/budget` | Auth / public search policy | Budget category |
| GET | `/api/v1/hotels/medium` | Auth / public search policy | Medium category |
| GET | `/api/v1/hotels/premium` | Auth / public search policy | Premium category |

Never invent hotel availability or exact live prices. Label AI recommendations separately from verified provider data.

---

## 🛕 PLACES APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/places/search` | Public / Auth | Search places |
| GET | `/api/v1/places/nearby` | Auth + location permission | Nearby (temples, gurudwaras, mosques, churches, historical, parks, food, hotels, markets) |
| GET | `/api/v1/places/:placeId` | Public / Auth | Place details |
| GET | `/api/v1/places/temples` | Public / Auth | Temples |
| GET | `/api/v1/places/gurudwaras` | Public / Auth | Gurudwaras |
| GET | `/api/v1/places/historical` | Public / Auth | Historical |
| GET | `/api/v1/places/nature` | Public / Auth | Nature |
| GET | `/api/v1/places/recommended` | Auth | Personalized recommendations |

Only verified fields are marked factual. AI-generated copy must be labeled.

---

## 💰 EXPENSE APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/trips/:tripId/expenses` | Auth + trip ownership | Add expense |
| GET | `/api/v1/trips/:tripId/expenses` | Auth + trip ownership | List (paginated) |
| GET | `/api/v1/trips/:tripId/expenses/:expenseId` | Auth + trip ownership | Detail |
| PATCH | `/api/v1/trips/:tripId/expenses/:expenseId` | Auth + trip ownership | Update |
| DELETE | `/api/v1/trips/:tripId/expenses/:expenseId` | Auth + trip ownership | Delete |
| GET | `/api/v1/trips/:tripId/expenses/summary` | Auth + trip ownership | Budget / spent / remaining / category breakdown |

Categories: Transport, Hotel, Food, Shopping, Entry Fees, Other.

---

## 💬 AI ASSISTANT APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/assistant/chat` | Auth (strict AI rate limit) | Chat with YatraGenie AI |
| GET | `/api/v1/assistant/conversations` | Auth | List own conversations (paginated) |
| GET | `/api/v1/assistant/conversations/:conversationId` | Auth + ownership | Conversation detail |
| POST | `/api/v1/assistant/conversations` | Auth | Create conversation |
| DELETE | `/api/v1/assistant/conversations/:conversationId` | Auth + ownership | Delete conversation |
| POST | `/api/v1/assistant/replan` | Auth (strict AI rate limit) | Assistant-driven replan |

Conversations are user-scoped. Never leak another user's messages.

---

## 🔔 NOTIFICATION APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/notifications` | Auth | List (paginated) |
| PATCH | `/api/v1/notifications/:notificationId/read` | Auth + ownership | Mark one read |
| PATCH | `/api/v1/notifications/read-all` | Auth | Mark all read |
| DELETE | `/api/v1/notifications/:notificationId` | Auth + ownership | Delete |

Types: trip reminder, departure, arrival, budget warning, AI recommendation, transport update, hotel reminder.

---

## ❤️ FAVORITES APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/v1/favorites` | Auth | Save hotel / place / restaurant / temple / gurudwara / trip |
| GET | `/api/v1/favorites` | Auth | List (paginated) |
| DELETE | `/api/v1/favorites/:favoriteId` | Auth + ownership | Remove |
| GET | `/api/v1/favorites/check/:placeId` | Auth | Check if favorited |

---

## 🩺 SYSTEM APIs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/health` | Public | API liveness |
| GET | `/api/v1/health/database` | Internal / admin policy | DB ping (no secrets) |
| GET | `/api/v1/health/services` | Internal / admin policy | Gemini / maps / transport / hotels status (no secrets) |

---

## Implementation checklist (backend)

When building `server/`, every route above must exist under `/api/v1` with:

- validators (body / params / query)
- auth + ownership middleware where required
- service + repository layers
- provider adapters for maps / transport / hotels / places / gemini
- rate limits (stricter on auth + AI + location)
- audit logging (no passwords, tokens, API keys, or unnecessary precise GPS)
- Swagger/OpenAPI generated from this contract

**Do not implement a different URL scheme.** This file is the contract.
