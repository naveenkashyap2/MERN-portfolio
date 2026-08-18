# YatraGenie AI — Frontend Structure Contract

**Status:** LOCKED  
**Root:** `client/`  
**Rule:** Frontend must be implemented using this folder and file layout. Do not rename, flatten, or invent a parallel structure without updating this file first.

This is the single source of truth for the React **file tree**. Visual system, screen purpose, UX routes, and microcopy are locked in [`DESIGN.md`](./DESIGN.md) + [`DESIGN_TOKENS.json`](./DESIGN_TOKENS.json). Do not invent a second folder tree from DESIGN.md §84 — map those screens onto this tree.

**Stack (locked):** React.js · Vite · JavaScript (no TypeScript) · Tailwind CSS · Framer Motion · React Router · Axios · TanStack React Query · Recharts · Lucide React

**API calls:** all backend traffic goes through Axios + feature `*.api.js` files to `/api/v1` as defined in [`API.md`](./API.md). Gemini is never called from the client.

---

## Tree

```
YatraGenie/
│
├── client/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── logo.svg
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   │
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   ├── router.jsx
│   │   │   ├── providers.jsx
│   │   │   └── queryClient.js
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── illustrations/
│   │   │   └── fonts/
│   │   │
│   │   ├── components/
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Drawer.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Progress.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── MobileNavbar.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   └── Footer.jsx
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Logo.jsx
│   │   │   │   ├── PageLoader.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   │
│   │   │   └── charts/
│   │   │       ├── BudgetChart.jsx
│   │   │       ├── ExpenseChart.jsx
│   │   │       └── TravelStatsChart.jsx
│   │   │
│   │   ├── features/
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm.jsx
│   │   │   │   │   ├── SignupForm.jsx
│   │   │   │   │   ├── GoogleAuth.jsx
│   │   │   │   │   └── ForgotPasswordForm.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAuth.js
│   │   │   │   ├── auth.api.js
│   │   │   │   └── auth.validation.js
│   │   │   │
│   │   │   ├── trips/
│   │   │   │   ├── components/
│   │   │   │   │   ├── TripCard.jsx
│   │   │   │   │   ├── TripHeader.jsx
│   │   │   │   │   ├── TripStats.jsx
│   │   │   │   │   ├── TripTimeline.jsx
│   │   │   │   │   └── DayItinerary.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useTrips.js
│   │   │   │   │   └── useTrip.js
│   │   │   │   ├── trips.api.js
│   │   │   │   └── trip.utils.js
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AIChatBox.jsx
│   │   │   │   │   ├── AIMessage.jsx
│   │   │   │   │   ├── AIThinking.jsx
│   │   │   │   │   ├── AIQuickActions.jsx
│   │   │   │   │   └── AITripGenerator.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useAIChat.js
│   │   │   │   └── ai.api.js
│   │   │   │
│   │   │   ├── planner/
│   │   │   │   ├── components/
│   │   │   │   │   ├── TripPlannerForm.jsx
│   │   │   │   │   ├── DestinationInput.jsx
│   │   │   │   │   ├── BudgetSelector.jsx
│   │   │   │   │   ├── TravelStyle.jsx
│   │   │   │   │   ├── StaySelector.jsx
│   │   │   │   │   ├── PlacePreferences.jsx
│   │   │   │   │   └── TravelerSelector.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useTripPlanner.js
│   │   │   │   └── planner.validation.js
│   │   │   │
│   │   │   ├── location/
│   │   │   │   ├── components/
│   │   │   │   │   ├── LiveLocation.jsx
│   │   │   │   │   ├── LocationPermission.jsx
│   │   │   │   │   ├── ArrivalStatus.jsx
│   │   │   │   │   ├── DistanceProgress.jsx
│   │   │   │   │   └── WalkingTracker.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useGeolocation.js
│   │   │   │   │   └── useLocationTracking.js
│   │   │   │   ├── location.api.js
│   │   │   │   └── location.utils.js
│   │   │   │
│   │   │   ├── maps/
│   │   │   │   ├── components/
│   │   │   │   │   ├── TripMap.jsx
│   │   │   │   │   ├── RouteMap.jsx
│   │   │   │   │   ├── UserMarker.jsx
│   │   │   │   │   ├── DestinationMarker.jsx
│   │   │   │   │   └── RoutePolyline.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useMapRoute.js
│   │   │   │   └── map.utils.js
│   │   │   │
│   │   │   ├── transport/
│   │   │   │   ├── components/
│   │   │   │   │   ├── TransportSelector.jsx
│   │   │   │   │   ├── TrainResults.jsx
│   │   │   │   │   ├── BusResults.jsx
│   │   │   │   │   ├── WalkingRoute.jsx
│   │   │   │   │   ├── TransportCard.jsx
│   │   │   │   │   └── RouteComparison.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useTransport.js
│   │   │   │   └── transport.api.js
│   │   │   │
│   │   │   ├── hotels/
│   │   │   │   ├── components/
│   │   │   │   │   ├── HotelCard.jsx
│   │   │   │   │   ├── HotelFilters.jsx
│   │   │   │   │   ├── HotelCategories.jsx
│   │   │   │   │   └── HotelComparison.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useHotels.js
│   │   │   │   └── hotels.api.js
│   │   │   │
│   │   │   ├── places/
│   │   │   │   ├── components/
│   │   │   │   │   ├── PlaceCard.jsx
│   │   │   │   │   ├── PlaceFilters.jsx
│   │   │   │   │   ├── TempleCard.jsx
│   │   │   │   │   ├── GurudwaraCard.jsx
│   │   │   │   │   ├── HistoricalPlaceCard.jsx
│   │   │   │   │   └── PlaceDetails.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── usePlaces.js
│   │   │   │   └── places.api.js
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── components/
│   │   │   │   │   ├── ExpenseForm.jsx
│   │   │   │   │   ├── ExpenseList.jsx
│   │   │   │   │   ├── ExpenseCard.jsx
│   │   │   │   │   └── BudgetOverview.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useExpenses.js
│   │   │   │   └── expenses.api.js
│   │   │   │
│   │   │   └── profile/
│   │   │       ├── components/
│   │   │       │   ├── ProfileForm.jsx
│   │   │       │   ├── TravelPreferences.jsx
│   │   │       │   └── SecuritySettings.jsx
│   │   │       ├── profile.api.js
│   │   │       └── profile.validation.js
│   │   │
│   │   ├── pages/
│   │   │   ├── landing/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── About.jsx
│   │   │   │   └── Features.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   ├── trips/
│   │   │   │   ├── MyTrips.jsx
│   │   │   │   ├── CreateTrip.jsx
│   │   │   │   ├── TripDetails.jsx
│   │   │   │   ├── EditTrip.jsx
│   │   │   │   └── ActiveTrip.jsx
│   │   │   │
│   │   │   ├── explore/
│   │   │   │   └── Explore.jsx
│   │   │   │
│   │   │   ├── transport/
│   │   │   │   ├── Transport.jsx
│   │   │   │   └── RouteDetails.jsx
│   │   │   │
│   │   │   ├── hotels/
│   │   │   │   └── Hotels.jsx
│   │   │   │
│   │   │   ├── places/
│   │   │   │   └── Places.jsx
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   └── AIAssistant.jsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── Settings.jsx
│   │   │   │
│   │   │   └── errors/
│   │   │       ├── NotFound.jsx
│   │   │       ├── Unauthorized.jsx
│   │   │       └── ServerError.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useMediaQuery.js
│   │   │   └── useLocalStorage.js
│   │   │
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   ├── queryClient.js
│   │   │   └── leaflet.js
│   │   │
│   │   ├── utils/
│   │   │   ├── distance.js
│   │   │   ├── currency.js
│   │   │   ├── date.js
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.js
│   │   │   ├── trip.js
│   │   │   ├── transport.js
│   │   │   ├── places.js
│   │   │   └── app.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── location.service.js
│   │   │   ├── notification.service.js
│   │   │   └── storage.service.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── TripContext.jsx
│   │   │   └── LocationContext.jsx
│   │   │
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   ├── auth.store.js
│   │   │   ├── trip.store.js
│   │   │   └── ui.store.js
│   │   │
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── globals.css
│   │   │   └── animations.css
│   │   │
│   │   └── types/
│   │       ├── auth.js
│   │       ├── trip.js
│   │       ├── location.js
│   │       └── transport.js
│   │
│   ├── tests/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   └── utils/
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
│
├── server/
│   └── ...
│
├── docs/
│   ├── PRD.md
│   ├── API.md
│   ├── FRONTEND.md
│   ├── DESIGN.md
│   ├── DESIGN_TOKENS.json
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── DATABASE.md
│
├── .gitignore
├── README.md
└── REMIND.md
```

---

## Layer rules

| Layer | Responsibility |
|-------|----------------|
| `pages/` | Route-level screens only. Compose features + layout. No raw Axios. |
| `features/*` | Domain UI, hooks, `*.api.js`, feature validation. One feature talks to its own API module. |
| `components/ui` | Reusable primitives. No business logic. No API calls. |
| `components/layout` | Shell: navbar, sidebar, mobile nav, auth/dashboard frames, footer. |
| `components/common` | Cross-cutting: logo, loader, error boundary, confirm, protected route. |
| `components/charts` | Recharts wrappers for budget / expenses / travel stats. |
| `hooks/` | Shared hooks. Feature-specific hooks stay inside `features/*/hooks`. |
| `lib/` | Third-party clients: Axios instance, React Query client, Leaflet. |
| `services/` | Browser-side services (auth session helpers, geolocation wrapper, notifications, storage). |
| `context/` | Auth, trip, location providers. |
| `store/` | Client UI/session stores: `auth.store.js`, `trip.store.js`, `ui.store.js`. |
| `types/` | JSDoc / shape constants only. **No TypeScript files.** |
| `constants/` | Routes, trip enums, transport modes, place categories, app config. |
| `utils/` | Pure helpers: distance, currency, dates, formatters, validators, error mapping. |
| `app/` | Bootstrap: `main.jsx`, `App.jsx`, router, providers, query client. |

---

## Feature → API mapping

Feature API modules must call the locked backend contract in [`API.md`](./API.md):

| Feature | Client module | Backend |
|---------|---------------|---------|
| auth | `features/auth/auth.api.js` | `/api/v1/auth/*` |
| profile | `features/profile/profile.api.js` | `/api/v1/users/me*` |
| trips | `features/trips/trips.api.js` | `/api/v1/trips*` + itinerary |
| planner / AI generate | `features/ai/ai.api.js` | `/api/v1/ai/trip/*` |
| assistant | `features/ai/ai.api.js` | `/api/v1/assistant/*` |
| location | `features/location/location.api.js` | `/api/v1/location/*` |
| maps / routes | `features/maps` + transport | `/api/v1/routes/*`, `/api/v1/walking/*` |
| transport | `features/transport/transport.api.js` | `/api/v1/transport/trains/*`, `/buses/*` |
| hotels | `features/hotels/hotels.api.js` | `/api/v1/hotels/*` |
| places | `features/places/places.api.js` | `/api/v1/places/*` |
| expenses | `features/expenses/expenses.api.js` | `/api/v1/trips/:tripId/expenses*` |

---

## Client env (never secrets)

`client/.env.example` may contain only public values, e.g.:

```
VITE_API_BASE_URL=
VITE_GOOGLE_CLIENT_ID=
```

Never put `GEMINI_API_KEY`, `GOOGLE_CLIENT_SECRET`, JWT secrets, or Mongo URI in the client.

**Do not commit `client/.env`.** `.env.example` only.

---

## UX / design constraints

Follow [`DESIGN.md`](./DESIGN.md). Tokens live in [`DESIGN_TOKENS.json`](./DESIGN_TOKENS.json).

- Backgrounds: `#0B1120` / `#111827` / `#172033` / `#1E293B`
- Accents: `#3B82F6` / `#06B6D4`
- Text: `#F8FAFC` / `#94A3B8`
- Font: Poppins (fallback Inter)
- Glass only where specified. Gradients only on hero / CTA / AI / active / premium highlights
- Trust badges required: LIVE VERIFIED · AI RECOMMENDED / AI ESTIMATE · ESTIMATED · CACHED
- Mobile bottom nav: Home · Explore · Trips · AI · Profile
- Offline: show “You're offline.” Never treat stale live transport as current.
- Location tracking default OFF. Consent required. Never use `alert()`.

**Do not implement a different frontend tree.** This file is the contract.
