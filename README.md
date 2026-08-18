# YatraGenie AI — India ka AI Trip Planner 🇮🇳✈️

**MERN + Gemini 2.0 Flash + Leaflet Maps + Voice AI**

> Har Yatra, AI Ke Saath Free — Kanpur se Delhi ya Kashmir se Kanyakumari, Train time, Highway, Flight sab ek plan me. Live tracking har kadam.

![Live](https://img.shields.io/badge/Live-Tracker-emerald) ![Voice](https://img.shields.io/badge/Voice-4_Languages-violet) ![Free](https://img.shields.io/badge/Free-Forever-success)

### 🔴 Live
- **App:** https://5173-...e2b.app
- **API:** /api/v1/health

### ✨ Features — 100% Free Forever
- **Best Route:** Kanpur → Delhi special — Shram Shakti 12451 (23:55), Shatabdi 06:00 timings + NH19 Highway 440km + Flight 1h10m + Local 10km/20km. All states & all country map me live location, zoom out to see India.
- **Live Tracker:** `navigator.geolocation.watchPosition` + Leaflet, 20km/10km radius, har 10m update, steps = distance*1300, speed, accuracy. Background tracking. All states.
- **Voice Assistant:** Floating Mic, 4 languages — Hindi, English, मराठी, ಕನ್ನಡ (Web Speech API, speak + listen), “Kanpur to Delhi” bolo to action.
- **Profile:** Avatar upload (base64 2MB), history timeline, stats (trips/distance/steps).
- **Security:** Login mandatory (no skip), JWT httpOnly, Google Auth mock, logout, protected routes.
- **History:** Auto save to User.history + MyTrips, Profile me timeline, steps/distance total.
- **Premium Home (Now Free):** Emerald+Violet gradient, animations via Framer Motion, floating cards, trust bar, 3-step how-it-works. Fully responsive (320→1920). No payment needed.
- **Tagline:** “Har Yatra, AI Ke Saath Free” — impressive, no payment.
- **Footer:** `Developer by Naveen` + Made with ❤️ in Kanpur.

### 🛠️ Tech
- **Client:** Vite + React + Tailwind + Framer Motion + Leaflet + Zustand + React Query + Axios + lucide
- **Server:** Express + Mongoose + JWT + Gemini + Helmet + RateLimit + memory fallback
- **Models:** User (avatar, history, stats), Trip (transportOptions {highway,train,flight,local}, srcCenter)

### 🚀 Quick Start
```bash
npm install
npm --prefix server install
npm --prefix client install
cp server/.env.example server/.env # add GEMINI_API_KEY
npm --prefix server run dev # :5000
npm --prefix client run dev # :5173
```
Without MONGO_URI → memory fallback. Without GEMINI_KEY → mock Kanpur-Delhi specials.

### 🔐 Env
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=change_me
GEMINI_API_KEY=AIza...
CLIENT_URL=http://localhost:5173
```

### 📚 Docs
- docs/PRD.md, docs/API.md, docs/ARCHITECTURE.md

Built production-grade, not CRUD. 100% Free forever — no payment system.
