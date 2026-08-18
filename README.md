# YatraGenie AI — India ka AI Trip Planner 🇮🇳✈️

**MERN + Gemini 2.0 Flash + Leaflet Maps**

> Budget bolo, Gemini pura itinerary bana dega — Hotels, khana, map, cost breakdown sab 30 sec me.

![MERN](https://img.shields.io/badge/MERN-Stack-10b981) ![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-8b5cf6) ![Maps](https://img.shields.io/badge/Maps-Leaflet-059669)

### 🌟 Live Features
- **AI Itinerary** — Gemini `gemini-2.0-flash` with structured JSON, 4 places/day, realistic lat/lng
- **Interactive Map** — Leaflet + OpenStreetMap, pins + polyline route, click popups
- **Smart Budget** — Stay/Food/Transport split, total verification, style-adaptive (budget/comfort/luxury)
- **Hotels & Food** — 3 stays + 3 dishes per trip
- **Chat with Trip** — RAG-style chat via Gemini on saved itinerary
- **Save & Explore** — JWT auth, save trips, public feed, views count
- **Production Hardening** — Helmet, CORS, Rate-limit, Mongo sanitize, Pagination, Error boundaries

### 🏗️ Architecture
```
client (Vite + React + Tailwind + Zustand + React Query)
  → axios → server (Express + Mongoose + JWT + Gemini)
              → MongoDB Atlas (or in-memory fallback) + Gemini API
```

### 🚀 Quick Start

**1. Clone & Install**
```bash
npm install
npm --prefix server install
npm --prefix client install
```

**2. Env**
```bash
cp server/.env.example server/.env
# add GEMINI_API_KEY from https://aistudio.google.com/app/apikey
cp client/.env.example client/.env
```

**3. Run (2 terminals)**
```bash
npm --prefix server run dev   # 0.0.0.0:5000
npm --prefix client run dev   # 0.0.0.0:5173
```
App: http://localhost:5173
API: http://localhost:5000/api/v1/health

**No Mongo?** No problem — app auto falls back to in-memory store (data resets on restart). Add `MONGO_URI` for persistence.

**No Gemini Key?** App shows Mock Mode with realistic Indian itineraries — add key to go LIVE.

### 🔑 Env Vars
```
# server/.env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=change_me
GEMINI_API_KEY=AIza...
CLIENT_URL=http://localhost:5173
```

### 📚 Docs
- `docs/PRD.md` — Full 47-point Master PRD
- `docs/API.md` — API spec
- `docs/ARCHITECTURE.md` — System design

Built as Production-Grade MERN SaaS, not a college CRUD demo.

