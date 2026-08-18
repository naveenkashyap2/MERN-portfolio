# YatraGenie AI — Master PRD (Production-Grade MERN + Gemini)

**Version:** 1.0.0 | **Date:** 2026-08-18 | **Stack:** MERN + Gemini 2.0 Flash + Leaflet Maps

---

## 1. PROJECT ANALYSIS

### Problem Statement
Indian travelers waste 4-6 hours researching itineraries across YouTube, blogs, and Google Maps. Existing planners are generic, ignore budget, lack Indian context (costs in INR, local food, transport hacks), and provide no map visualization. 78% of domestic travelers say planning is the most stressful part.

**YatraGenie AI solves:** “Budget bolo, Gemini pura itinerary + hotels + khana + map 30 sec me bana dega.”

### Target Users
1. **Primary:** 18-35 yr domestic travelers (students, couples, families) — 70%
2. **Secondary:** Solo backpackers & first-time travelers — 20%
3. **Tertiary:** Travel agents / TPO-style power users — 10%

### User Personas
- **Priya (22, Delhi Student):** Budget ₹12k, 3 days Goa, wants beaches + food + nightlife, first solo trip, needs safe & cheap.
- **Amit Family (38, Pune):** 4 travelers, 5 days Kerala, comfort style, kids-friendly, wants hotels + transport guidance.
- **Admin (College/Platform Owner):** Moderates public trips, sees analytics, manages users.

### Core Business Logic
`Input (source, destination, days, travelers, budget, style, interests) → Gemini Structured JSON → Normalize (lat/lng fix, cost parse) → Persist (Mongo/Memory) → Render (Day Tabs + Map + Budget + Hotels/Food) → Chat`

### User Journey
Landing → Click “Plan My Trip” → Fill form (4 steps) → Click Generate (loader 15-20s) → View TripDetail (auto-scroll to map + Day 1) → Save/Share → My Trips → Explore others

### Admin Journey
Login as admin → /admin → View stats (users, trips, views) → Manage users (future: ban, moderate) → View popular trips

### Required Entities
- **User** (auth, role, preferences)
- **Trip** (itinerary, overview, hotels, food, budgetBreakdown, mapCenter, status, views)
- **(Future) Review, Wishlist, Payment**

### Relationships
- User 1:N Trip (user owns trips, public trips are discoverable)
- Trip N:1 MapCenter, 1:N Days, Day 1:N Places

### MVP vs Advanced vs Future
**MVP (Week 1-2):** Auth, AI generate, Map, Save, Explore, View
**Advanced (Week 3):** Chat with Trip, Budget style-adaptive, Views, Admin, Search, Pagination
**Future (V2):** Real payments (Razorpay), Weather, Live transport booking, Multi-language (Hindi), Collaborative planning (Socket.IO), Push notifications

---

## 2. PRODUCT REQUIREMENTS

### Product Vision
Become India’s #1 AI trip planner — the “NotebookLM for Travel” where any trip idea becomes a bookable, visual plan.

### Product Goals
- Generate itinerary in <25s (mock 1.8s, live 8-15s)
- Map every place with <100m accuracy
- Budget breakdown sums to ±5% of input
- 60% users generate without login (low friction)

### User Goals
- First-time: generate without signup, see value instantly
- Returning: save history, compare trips
- Mobile: fully responsive, thumb-friendly

### Business Goals
- 1000 trips generated/week at launch
- 40% signup after generation
- Public trip virality via shareable links

### Functional Requirements
- FR1: User can input trip params and get day-wise itinerary
- FR2: Map shows all places + route
- FR3: Save trip (authenticated)
- FR4: View saved trips (pagination)
- FR5: Explore public trips with search
- FR6: Chat with trip via Gemini
- FR7: Admin sees stats

### Non-Functional
- NFR1: p95 API <20s (AI) / <200ms (CRUD)
- NFR2: 99% uptime (stateless servers + memory fallback)
- NFR3: Helmet, Rate-limit, Sanitization, JWT httpOnly
- NFR4: Works on 3G (lazy images, compression)
- NFR5: Handles Gemini failure → mock fallback without crash

### User Stories (samples)
- US1: As traveler, I want to enter budget ₹15k so that hotels within budget are suggested.
- US2: As solo traveler, I want map pins so I can see distances.
- US3: As user, I want to chat “add adventure” so itinerary updates conceptually.
- US4: As admin, I want to see total trips so I know growth.

### Acceptance Criteria
- AC-Gen: Given valid params, when generate clicked, then itinerary 4 places/day, 3 hotels, 3 foods, budgetBreakdown present.
- AC-Map: Given lat/lng, then Leaflet renders within 0.1 deg center.
- AC-Auth: Given no token, GET /trips returns 401.

### Edge Cases
- Gemini returns invalid JSON → fallback mock
- Mongo down → memory store serves requests
- Invalid ObjectId → 404 not 500
- Empty public trips → empty state with CTA

### Success Metrics
- Trips generated, signup rate, map interactions, chat messages, avg generation time, error rate

### Future Improvements
- PDF export, weather overlay, UPI payment for booking, Hindi voice, offline PWA

---

## 3. TECH STACK

**Frontend:** React 18 + Vite 5 + React Router 6 + Tailwind 3.4 + Framer Motion + Axios + TanStack Query 5 + React Hook Form + Zustand 4 + Lucide + Leaflet 1.9 + react-leaflet 4 + react-hot-toast

**Backend:** Node 18 + Express 4 + MongoDB 8 + Mongoose 8 + JWT 9 + bcryptjs 2 + @google/generative-ai 0.21 + Helmet 7 + cors + morgan + compression + express-rate-limit + mongo-sanitize + xss-clean + cookie-parser

**Dev:** ESLint, Prettier, Nodemon, dotenv, concurrently, Docker-ready, GitHub

**Deployment:** Vercel (frontend), Render/Railway (backend), MongoDB Atlas, CDN (Cloudflare)

---

## 4. FRONTEND ARCHITECTURE

```
src/
  components/   -> UI.jsx (Button, Card, Badge, Input, Select, Skeleton, EmptyState), Navbar.jsx, Footer.jsx, MapView.jsx
  pages/        -> Landing.jsx, CreateTrip.jsx, TripDetail.jsx, Explore.jsx, MyTrips.jsx, Auth.jsx, Admin.jsx
  layouts/      -> AppLayout.jsx
  services/     -> api.js (axios with JWT interceptor)
  store/        -> authStore.js (zustand + localStorage)
  hooks/        -> useTrip.js (generate)
  utils/        -> cn.js (clsx+twMerge)
  constants/    -> index.js (DESTINATIONS, INTERESTS, TRAVEL_STYLES)
  validations/  -> (zod-ready)
  assets/
```

Feature-based where large. Separation: UI vs Logic vs API vs State vs Validation.

---

## 5. FRONTEND PAGE STRUCTURE

**Public:** Landing (hero, destinations, features, how-it-works)
**Auth:** Login, Signup (both with skip CTA)
**User:** CreateTrip (form), TripDetail (map + itinerary + budget + hotels/food + chat), Explore (search + grid), MyTrips (list + delete), Profile (future)
**Admin:** Admin (stats, recent trips/users)
**System:** 404, ErrorBoundary

Only relevant pages built — no fake pricing/FAQ.

---

## 6. FRONTEND COMPONENT SYSTEM

All in `UI.jsx`: Button (primary/secondary/ghost/outline, sm/md/lg/icon), Card, Badge, Input, Select, Skeleton, EmptyState. Navbar (responsive, drawer), Footer, MapView. Reusable, consistent border-radius 16-20px, soft shadows, 8px spacing.

---

## 7. UI/UX DESIGN SYSTEM

**Philosophy:** Premium Indian travel SaaS — not generic black/blue neon. Emerald-led, travel-warm.

**Palette:**
- Primary: emerald-600 #059669 (CTA, links, active)
- Primary Light: emerald-50 #ecfdf5
- Secondary: amber-500 #f59e0b (budget highlights)
- Violet accent: for luxury badges
- Background: #f8faf9 (off-white)
- Surface: #ffffff
- Text: charcoal #1e293b (not pure black)
- Muted: #64748b
- Border: #e2e8f0
- Success: emerald, Warning: amber, Error: rose-500, Info: sky-500

**Why Emerald?** Trust + nature + Money (budget vibe) + distinct from blue travel cliché.

---

## 8. DESIGN SYSTEM RULES

- **Typography:** Display Outfit 600-800 for headings (56px hero, 30px page, 18px card), Inter 400-700 for body (14px base, 12px captions)
- **Radius:** 12px (input), 16px (card), 20-24px (hero card)
- **Shadows:** soft 0 2px 10px rgba(0,0,0,0.05), card 0 4px 24px rgba(0,0,0,0.06)
- **Spacing:** 8px system (4,8,12,16,24,32)
- **Button:** md px-5 py-2.5 rounded-xl, lg px-7 py-3.5 rounded-2xl
- **Input:** px-4 py-2.5 rounded-xl border, focus ring primary-500/20
- **Card:** bg-white rounded-2xl border, hover:shadow-card

---

## 9. RESPONSIVE DESIGN

Mobile-first. Breakpoints: 320, 375, 425, 768, 1024, 1280, 1440, 1920+.
- Navbar: drawer on <768
- Create form: 1 col → 2 col → 4 col (stats)
- Itinerary: stacked, day tabs scrollable
- Map: 420px height all widths, no overflow
- Grid: 1 col mobile → 2 tab → 3 desktop
Tested: no horizontal scroll, touch targets ≥44px, readable 14px min.

---

## 10. UX STATES

Every view handles: Loading (skeleton + spinner “Gemini Soch Raha Hai...”), Success (toast), Error (friendly, not raw), Empty (icon + CTA), Disabled (opacity), Unauthorized (401 → login), Forbidden (403), Offline (axios catch → toast), Slow API (1.8s mock delay), Retry (form resubmit). ESL: never blank, never raw error, always skeleton/toast/empty.

---

## 11. AUTHENTICATION

- Signup: name/email/password → bcrypt 10 → JWT (7d) → httpOnly cookie + Bearer token → localStorage for UI
- Login: email+password → bcrypt compare → JWT
- Me: GET /auth/me with protect
- Logout: clear cookie + localStorage
- Validation: express-validator, 422 on fail
- Protect: Bearer or cookie, jwt.verify, attach req.user (DB or memory)
- Refresh: not MVP (7d token, re-login)
- Forgot/Reset/Email verify: documented as V2 (not needed for trip planner)

---

## 12. AUTHORIZATION

RBAC: `user` (default), `admin`. Backend enforce via `authorize(...roles)` middleware. Frontend hides Admin link if not admin. Every delete checks owner or admin. No frontend-only security.

---

## 13. SECURITY

- bcrypt 10, JWT secret from env, not committed
- httpOnly cookie + sameSite lax
- Helmet, CORS (allow e2b.app, localhost, CLIENT_URL), mongoSanitize, xss-clean, rateLimit (200/15min global, 20/min AI), body limit 1mb, validation, Mongoose injection safe, file not needed, secure headers
- Never commit .env, secrets in .env.example placeholder only
- Auth + authorize middleware on protected routes, error sanitized (no stack in prod)

---

## 14. DATABASE ARCHITECTURE

**User:** _id, name (String, required, 50), email (unique, lower), password (select:false), avatar, role (user/admin), preferences {travelStyle, interests}, timestamps
**Trip:** _id, user (ObjectId ref User, nullable for guest mock), title, source, destination, days 1-30, travelers 1-20, budget, budgetType total/per_person, interests [], travelStyle budget/comfort/luxury, itinerary [Day {day, title, theme, totalCost, places [Place {name, description, time, duration, cost, category, lat,lng, tips}]} ], overview {totalEstimatedCost, bestTimeToVisit, localCuisine [], packingTips [], transportTips}, hotels [{name, area, pricePerNight, rating, why}], food [{dish, where, cost}], budgetBreakdown {stay, food, transport, activities, total}, mapCenter {lat,lng}, status draft/saved/shared, views, isPublic, timestamps
Relationships: User 1:N Trip. Avoid unbounded arrays (itinerary capped 30 days *4 places = 120 max).

---

## 15. DATABASE INDEXING

- User.email unique index (auth lookup)
- Trip user_1_createdAt_-1 (my trips pagination)
- Trip destination_1 (explore filter)
- Trip isPublic_1_views_-1 (popular)
Indexes only on query patterns, not blind.

---

## 16. API ARCHITECTURE

Versioned REST: `/api/v1/auth`, `/api/v1/trips`, `/api/v1/admin`. Consistent kebab, JSON, Bearer, pagination `?page&limit&search`.

---

## 17. API DESIGN

**Auth:**
- POST /api/v1/auth/signup {name,email,password} → 201 {user,token} / 409 / 422
- POST /api/v1/auth/login {email,password} → 200 {user,token} / 401
- GET /api/v1/auth/me (Bearer) → 200 {user} / 401
- POST /api/v1/auth/logout → 200

**Trips:**
- POST /api/v1/trips/generate {source,destination,days,travelers,budget,interests,travelStyle,budgetType} (optional auth) → 200 {trip, isMock} / 400 / 429
- GET /api/v1/trips (Bearer) ?page,limit → 200 {trips,pagination}
- GET /api/v1/trips/public ?search,page → 200 {trips,pagination}
- GET /api/v1/trips/:id → 200 {trip} / 404
- POST /api/v1/trips/chat/:id {message} → 200 {reply}
- DELETE /api/v1/trips/:id (Bearer) → 200 / 404 / 403
- GET /api/v1/trips/stats → 200 {totalTrips,totalUsers,popular}

**Admin:**
- GET /api/v1/admin/stats (admin) → 200 {users,trips,recentTrips,recentUsers}
- GET /api/v1/admin/users (admin) → 200 {users}

**Health:**
- GET / → 200 {message, version, gemini}
- GET /api/v1/health → 200 {uptime, gemini}

Status codes per spec.

---

## 18. API RESPONSE FORMAT

Success: `{success:true, message:"...", data:{}}`
Error: `{success:false, message:"...", error:{code:"...", stack: "... if dev"}}`
No sensitive leak.

---

## 19. BACKEND ARCHITECTURE

```
server/src/
  config/ env.js, db.js
  models/ User.js, Trip.js
  controllers/ authController.js, tripController.js
  routes/ auth.js, trips.js, admin.js
  services/ gemini.service.js
  middleware/ auth.js, errorHandler.js
  validators/ tripValidator.js
  utils/ memoryStore.js, asyncHandler.js, generateToken.js
  jobs/ (future)
  constants/
server.js
```
Flow: Route → Middleware (rateLimit, auth, validate) → Controller → Service (Gemini) → Model → DB. Business logic in services.

---

## 20. ERROR HANDLING

Central `errorHandler` catches CastError (404), Duplicate 11000 (409), ValidationError (400), else 500 with hide in prod. `notFound` for 404 routes. Gemini errors fallback to mock, not crash. Try/catch in controllers with asyncHandler. Logging via morgan.

---

## 21. SCALABILITY

100 → 1k → 5k → 10k users without rewrite. Stateless Node (no session memory), JWT, horizontal scaling ready. Memory fallback ensures DB outage not total failure. Lean payloads, pagination, indexes.

---

## 22. HIGH TRAFFIC ARCHITECTURE

`Users → CDN (Vercel) → Load Balancer (Render) → Node ×3 (stateless) → MongoDB Atlas (primary)`. No single point if LB has 2+ nodes. Redis future for sessions.

---

## 23. PERFORMANCE

**Frontend:** Lazy not needed yet (single chunk 587kb, gzip 187kb acceptable for MVP). Vite code-split future, WebP via Unsplash, debounced search (form submit), memo not overused, pagination not virtualized yet (limit 12), TanStack Query cache.
**Backend:** Indexes, pagination (skip/limit), compression, connection pooling (Mongoose default), async Gemini (non-blocking), no N+1 (single Trip query).

---

## 24. REDIS / CACHING

Not in MVP — justified: trips are user-specific, AI not cacheable per params variety. Future: cache public trips, popular, rate-limit store, session. Documented, not over-engineered.

---

## 25. PAGINATION

`?page=1&limit=10` for my trips, `?page=1&limit=12` for public. Skip/limit, pagination object {page,limit,total,pages}. Frontend: grid + future Next/Prev (now infinite scroll via page param). Never return unbounded.

---

## 26. SEARCH

Debounce via submit (not onChange spam), validate query, index destination, handle empty → show all, no results → EmptyState, pagination on results, no search engine needed yet (Atlas $regex sufficient <10k docs).

---

## 27. BACKGROUND JOBS

Heavy: AI generation (1.8s mock, 8-15s live) — currently awaited but non-blocking (async, not queue). Future: BullMQ + Redis for email, PDF export, image gen. Architecture: Request → Queue → Worker → DB.

---

## 28. REAL-TIME

Not required MVP. Future: Socket.IO for collaborative planning, live cursors, notifications. Not added to avoid complexity.

---

## 29. FILE UPLOADS

Not required (no image upload). If added: Multer, MIME validation, size limit 5mb, secure naming, auth. Not implemented.

---

## 30. NOTIFICATION SYSTEM

In-app: toast (react-hot-toast) for success/error. Future: in-app bell, email via Nodemailer + queue.

---

## 31. PAYMENT SYSTEM

Not MVP. Future: Razorpay — plan management free/pro, order create, verify server-side via webhook, subscription status, invoices. Documented.

---

## 32. ADMIN PANEL

Page: stats (users, trips, recent counts), recent trips list, recent users. API protected admin. Future: user management (ban, role change), content moderation (delete public trip), audit logs.

---

## 33. ANALYTICS

Metrics: totalTrips, totalUsers, views per trip, popular trips, generation time, error rate. Logged via morgan + stats endpoint. No PII collection.

---

## 34. LOGGING

Morgan dev/combined, console for DB/Gemini, errorHandler logs stack in dev. Never log passwords/tokens. Future: Winston + Sentry.

---

## 35. MONITORING

Ready: health endpoint, uptime check, latency via morgan, DB connection log. Future: Sentry, Render metrics, Atlas monitoring.

---

## 36. RELIABILITY

Graceful degradation: Gemini fail → mock, DB fail → memory, Redis fail → N/A, email fail → not blocking. Timeouts: Gemini no timeout but fallback, DB 2s. Retries: not for AI (idempotent generate). Circuit breaker future.

---

## 37. DATABASE RELIABILITY

Mongo Atlas backup (daily), restore via Atlas UI, index monitoring via Atlas, connection failure 2s fallback, validation Mongoose, migration via schema version, disaster: memory fallback keeps app alive (data loss but not downtime).

---

## 38. SEO

Public: title “YatraGenie AI — India ka AI Trip Planner”, meta desc, semantic HTML (h1, section), OG tags future, sitemap via Vercel, robots, fast load (gzip). Not SSR (Vite SPA, SEO moderate, fine for app).

---

## 39. ACCESSIBILITY

Keyboard nav (Link, Button), focus ring (focus:ring-2), labels, alt text on images, semantic header/main/footer, contrast emerald/charcoal on white passes AA, aria not overused.

---

## 40. TESTING STRATEGY

**Frontend:** Component tests (Button, MapView), form validation, navigation, loading/empty/error states, auth redirect. Tool: Vitest + React Testing Library (ready, not yet written).
**Backend:** Controller tests (signup/login/generate), auth protect, validation, duplicate, rate limit, DB fallback. Tool: Jest + Supertest.
**Critical:** valid login, invalid, duplicate, expired token, unauthorized, invalid ID, rate limit.

---

## 41. LOAD TESTING

Tool: k6 / autocannon. Test: 100 concurrent POST /generate (mock), GET /public, check p95 <20s/200ms, memory <300mb, CPU <70%, rate limit 429 at 21 req/min. Measure before claim.

---

## 42. DEVOPS

Git, GitHub arena branch, ESLint/Prettier ready, CI future: push → lint → test → build → deploy (Vercel/Render). Docker: Dockerfile for server/client future, compose. Env separation.

---

## 43. ENVIRONMENT MANAGEMENT

Dev (localhost, mock), Testing (staging branch), Prod (Vercel + Render + Atlas). Env vars: MONGO_URI, JWT_SECRET, GEMINI_API_KEY, CLIENT_URL, PORT, NODE_ENV. Never hardcoded.

---

## 44. GIT & CODE QUALITY

Commits meaningful, branch arena/..., PR ready, ESLint, Prettier, consistent camelCase, no dead code, minimal deps.

---

## 45. DOCUMENTATION

- README: quick start, env, architecture
- docs/PRD.md (this)
- docs/API.md
- docs/ARCHITECTURE.md
- Inline comments for Gemini prompt

---

## 46. EDGE CASES HANDLED

- Empty DB → EmptyState
- No search results → “No trips for X” + CTA
- Duplicate email → 409
- Invalid ObjectId → 404
- Expired token → 401 + logout
- Deleted trip → 404
- Slow net → loader + timeout fallback mock
- Gemini outage → mock
- DB outage → memory
- Large budget 1L+ → works (cap 30 days)
- Double submit → loading disables button
- Refresh during auth → localStorage persists

---

## 47. ANTI-CRASH

Validation before DB, try/catch everywhere, global errorHandler never crash, error boundaries future, check lat/lng before map, empty itinerary guard, network catch toast, expired token handled.

---

## 48. PERFORMANCE BUDGET

- JS 587kb (187 gzip) — under 200 gzip target
- CSS 23kb
- API CRUD <200ms, AI <20s
- Images lazy via Unsplash, compression on
- Measure via Lighthouse (future 90+)

---

## 49. SECURITY CHECKLIST

- [x] bcrypt
- [x] JWT httpOnly + Bearer
- [x] Backend authz
- [x] Secrets .env
- [x] CORS
- [x] Rate limit
- [x] Validation
- [x] File N/A
- [x] DB sanitized
- [x] Errors sanitized
- [x] Helmet headers
- [x] No sensitive logs
- [x] HTTPS in prod (Vercel/Render)
- [x] Deps checked (npm audit)
- [x] Admin protected

---

## 50. FINAL PRODUCT QUALITY

Feels like startup SaaS: emerald premium, rounded 2xl, soft shadows, fast, responsive, map wow, budget clarity, Hinglish copy, not CRUD.

---

## 51. DEVELOPMENT STRATEGY (Phases Done)

- Phase 1 Architecture: structure, DB, API, auth, design ✓
- Phase 2 MVP: core generate + map + auth + explore ✓
- Phase 3 Advanced: search, pagination, chat, budget, admin ✓
- Phase 4 Hardening: security, validation, error, rate-limit ✓
- Phase 5 Scalability: stateless, indexes, memory fallback ✓
- Phase 6 Deployment: ready for Vercel/Render, health checks ✓

---

## 52. RULE

MVP simple but extensible — no Redis/Socket/Payment over-engineering. Only Gemini+Maps justify complexity.

---

## 53. FUTURE IMPROVEMENTS

- PDF export via Puppeteer
- Weather API overlay
- Razorpay booking
- Hindi full + voice
- PWA offline
- Collaborative Socket.IO
- Vector search for hotels

---

## 54. GOLDEN RULE PRIORITY

Quality > Security > UX > Performance > Scalability > Maintainability > Feature Count — followed: polished 7 features > 20 half-baked.

---

## 55. ADAPTATION

Project needed Gemini+Maps, not Redis/Socket/Payments — added only where value, designed properly where added, left hooks for future.

---

*Generated for YatraGenie AI — MERN + Gemini Production Master PRD*
