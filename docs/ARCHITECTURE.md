# Architecture

## High-level flow

```
React (Vite)  →  Axios  →  Express API  →  Controller  →  Service  →  Provider / Store  →  (Gemini | MongoDB | external provider)
```

The frontend never talks to Gemini or any external provider directly. It talks only to
`/api/v1` on its own origin (the Vite dev server proxies `/api` to Express).

## Backend layers

| Layer | Path | Responsibility |
| --- | --- | --- |
| Config | `src/config` | env validation, CORS, DB connection, logging |
| Middleware | `src/middleware` | auth, error handling, rate limiting, validation, security headers |
| Routes | `src/routes` | URL → controller mapping |
| Controllers | `src/controllers` | HTTP concerns, ownership checks, audit |
| Services | `src/services` | business logic (auth tokens, AI planning, chat) |
| Providers | `src/providers` | external adapters (gemini, places, hotels, transport, maps) |
| Prompts | `src/prompts` | versioned Gemini system/user prompt builders |
| Validators | `src/validators` | Zod schemas for every request body |
| Models | `src/models` | Mongoose schemas (production persistence) |
| Store | `src/store` | in-memory demo store + seed data |

### Provider-adapter architecture

External services are behind interfaces so a real provider can replace the demo adapter without
touching business logic:

- `providers/places` → `search()`, `getById()`, `byCategory()`, `nearby()`, `recommended()`
- `providers/hotels` → `search()`, `getById()`, `byCategory()`, `recommended()`
- `providers/transport` → `searchTrains()`, `searchBuses()`, `compare()`
- `providers/maps` → `planRoute()`, `compare()`
- `providers/gemini` → `generateJSON()`, `chat()`

Every demo adapter labels its output `source: 'estimate'`; the UI renders a corresponding
"Estimate" badge. No fake live data.

## AI pipeline (trip generation)

```
Gemini API → JSON parse → Zod schema validation → business validation → sanitize → MongoDB
```

If any step fails (or no Gemini key), a deterministic demo planner builds the trip from the seed
catalog so the product always works.

## Frontend layers

- `app/` — router, providers, query client
- `components/` — reusable UI (`ui/`), layout, maps, travel cards, AI, charts, feedback
- `features/` — per-domain components and APIs
- `pages/` — route-level screens (lazy-loaded)
- `hooks/` — `useAuth`, `useDebounce`, `useMediaQuery`, `useFavorite`
- `services/api.js` — typed endpoint helpers over the Axios client
- `context/` — Auth, Toast
- `constants/`, `utils/`, `styles/`

## Auth & sessions

Access token (short-lived, in memory) + refresh token (HttpOnly cookie, rotated on every use with
reuse detection). See `SECURITY.md`.

## Persistence strategy

- **Production:** MongoDB via Mongoose models (`src/models`).
- **Demo/tests:** in-memory store (`src/store`) with the same interface surface, seeded on boot.
