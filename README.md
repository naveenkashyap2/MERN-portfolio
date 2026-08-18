# YatraGenie AI 🧭

**India's AI Travel & Trip Planning Assistant** — a premium, production-style MERN application that turns
"budget bolo" into a complete, day-wise, budget-aware trip plan.

> *Plan smarter. Travel better.*

---

## ✨ What it does

Tell YatraGenie where you want to go, your budget and your preferences — and let AI plan the journey:

- **AI Trip Planning** — a structured wizard *or* a single natural-language sentence ("Delhi se Agra 2 din, budget 5000…")
- **Day-wise itinerary** with times, durations, distances, transport modes and estimated costs
- **Budget intelligence** — planned breakdown + real expense tracking with charts
- **Places / Temples / Gurudwaras / Historical / Nature / Food** discovery
- **Transport** — train & bus search + cross-modal comparison (clearly labelled as *estimates*)
- **Hotels** — budget / medium / premium categories
- **Live Trip Mode** — map-first tracking, walking mode, arrival detection (consent-first)
- **AI Assistant** — quick actions (Reduce Cost, Find Nearby, I'm Late, Replan…)
- **Favorites, sharing, notifications, profile, privacy & security controls**

## 🧱 Tech stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18, Vite, JavaScript, Tailwind CSS, Framer Motion, React Router, TanStack Query, Axios, Recharts, Lucide |
| Backend | Node.js, Express, JavaScript, Mongoose, Zod |
| AI | Google Gemini (server-side only) with a deterministic demo planner fallback |
| Auth | Email/password (bcrypt + JWT access/refresh rotation) + Google OAuth |

## 🚀 Quick start

```bash
# 1. Backend
cd server
cp .env.example .env        # leave MONGODB_URI empty for demo mode
npm install
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173  (proxies /api → :5000)
```

### Demo account

```
Email:    demo@yatragenie.ai
Password: Demo@1234
```

A fully-planned **Delhi → Agra** trip is seeded so the dashboard, itinerary, map, budget and AI
assistant are instantly explorable.

### Demo mode vs. production

- **Demo mode (default):** no `MONGODB_URI` — the API runs on an in-memory store seeded with demo data.
  AI uses a deterministic planner. Perfect for evaluation and tests.
- **Production:** set `MONGODB_URI` (Mongoose models in `server/src/models`), `JWT_SECRET`,
  `REFRESH_TOKEN_SECRET`, and optionally `GEMINI_API_KEY` + Google OAuth credentials.

> The Gemini API key lives **only** on the backend. It is never exposed to the frontend, and all AI
> traffic flows React → Express → AI service → Gemini.

## 📁 Structure

```
client/   React + Vite frontend (src/app, components, features, pages, hooks, services, …)
server/   Express API (src/config, controllers, models, routes, services, providers, prompts, …)
docs/     PRD, ARCHITECTURE, API, SECURITY, DATABASE, AI, DEPLOYMENT
```

## 🛡️ Data trust

YatraGenie never fakes live data. Every card is labelled:

- `VERIFIED` — data from a trustworthy source
- `AI RECOMMENDED` / `ESTIMATE` — AI/editorial content (prices & schedules are estimates)
- Live train/bus/hotel availability is shown only when a verified external provider is connected
  (see the provider-adapter architecture in `server/src/providers`).

See [`REMIND.md`](REMIND.md) for setup commands, rules and the do-not-do list, and [`docs/`](docs) for the
full architecture, API surface, security model, database schema, AI pipeline and deployment guide.
