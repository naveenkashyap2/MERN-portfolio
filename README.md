# YatraGenie AI

India's AI Travel & Trip Planning Assistant.

**Budget bolo → YatraGenie tumhare liye complete trip plan kare.**

## Stack

- Client: React, Vite, Tailwind, Framer Motion, React Router, Axios, TanStack Query, Recharts, Lucide
- Server: Node, Express, MongoDB, Mongoose, Gemini (server-side only)

## Quick start

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run install:all
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:5000/api/v1/health
- Swagger: http://localhost:5000/api/v1/docs

Without Atlas, the API starts an in-memory MongoDB (`USE_IN_MEMORY_DB=true`).

## Contracts

- [docs/API.md](docs/API.md)
- [docs/FRONTEND.md](docs/FRONTEND.md)
- [docs/DESIGN.md](docs/DESIGN.md)
- [REMIND.md](REMIND.md)

## Demo

1. Register with a strong password (`Travel@123` works).
2. Open **Plan Trip**, keep Delhi → Agra, generate.
3. Open the trip dashboard, itinerary, map, budget.
4. Transport/hotels show **CATALOG / ESTIMATED** until a live provider is connected — never fake “Live” seats.
