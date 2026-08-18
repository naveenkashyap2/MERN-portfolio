# YatraGenie Architecture

## System Diagram
```
Browser (React Vite :5173) --/api/proxy--> Express :5000 --Mongoose--> MongoDB Atlas
        | Leaflet OSM Tiles                           |--@google/generative-ai--> Gemini 2.0 Flash
        | Zustand + localStorage (JWT)
        | TanStack Query cache
```

## High-Level
- **Client:** SPA, React Router, Tailwind, Zustand for auth, Axios interceptor adds Bearer, React Query for cache, Leaflet for maps.
- **Server:** Stateless Express, helmet+rateLimit, JWT auth, Mongoose, Gemini service with fallback mock, memoryStore fallback if Mongo down.
- **DB:** Atlas Vector-ready (future), indexes on email, user+createdAt, destination, isPublic+views.
- **AI:** `gemini-2.0-flash` with `responseMimeType: application/json`, prompt enforces schema, post-process fixes lat/lng, on error → `getMockItinerary()`.

## Data Flow — Generate
1. User submits form → POST /trips/generate
2. Controller calls `generateItinerary(params)`
3. If GEMINI_API_KEY missing → mock + 1.8s delay
4. Else prompt → Gemini → JSON.parse → fix lat/lng → return
5. Controller saves (if user else guest) → return trip + isMock flag
6. Client navigates to /trip/:id, renders Map + Day tabs + Budget + Hotels

## Deployment
- **Frontend:** Vercel (vite build), env VITE_API_URL=/api/v1 (proxy) or https://api...
- **Backend:** Render/Railway Docker, env MONGO_URI, JWT_SECRET, GEMINI_API_KEY
- **DB:** MongoDB Atlas (backup daily)
- **CDN:** Cloudflare for assets

## Scalability
- Stateless servers ×3 behind LB, JWT, pagination, indexes, compression, no session affinity.

## Security
- Helmet, CORS allowlist (+ e2b.app), rateLimit, sanitize, xss-clean, bcrypt, httpOnly cookie, validation, RBAC.

## Folder Structure
See PRD §4 & §19.

## Env
- PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, GEMINI_API_KEY, CLIENT_URL, NODE_ENV
