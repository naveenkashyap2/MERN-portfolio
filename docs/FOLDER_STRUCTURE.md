# YatraGenie AI — Complete folder structure

Copy this repo as-is. Run order: **MongoDB → Backend → Frontend**.

```
YatraGenie-AI/
│
├── README.md
├── REMIND.md
├── COPY-AND-RUN.md
├── docker-compose.yml          ← live MongoDB (port 27017)
├── package.json
├── .gitignore
│
│
│ ╔══════════════════════════════════════╗
│ ║  1. FRONTEND  —  client/             ║
│ ╚══════════════════════════════════════╝
│
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── logo.svg
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── images/
│   │       ├── agra.jpg
│   │       ├── jaipur.jpg
│   │       ├── amritsar.jpg
│   │       ├── varanasi.jpg
│   │       ├── kerala.jpg
│   │       └── udaipur.jpg
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   ├── main.jsx
│   │   │   ├── router.jsx
│   │   │   ├── providers.jsx
│   │   │   └── queryClient.js
│   │   │
│   │   ├── assets/                    (images / icons / illustrations / fonts)
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                    Button Input Select Modal Drawer Badge
│   │   │   │                          Card Skeleton Spinner Tooltip Tabs
│   │   │   │                          Dropdown Progress EmptyState
│   │   │   ├── layout/                Navbar Sidebar MobileNavbar
│   │   │   │                          DashboardLayout AuthLayout Footer
│   │   │   ├── common/                Logo PageLoader ErrorBoundary
│   │   │   │                          ConfirmDialog ProtectedRoute ToastHost
│   │   │   └── charts/                BudgetChart ExpenseChart TravelStatsChart
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── trips/
│   │   │   ├── ai/
│   │   │   ├── planner/
│   │   │   ├── location/
│   │   │   ├── maps/
│   │   │   ├── transport/
│   │   │   ├── hotels/
│   │   │   ├── places/
│   │   │   ├── expenses/
│   │   │   └── profile/
│   │   │
│   │   ├── pages/
│   │   │   ├── landing/               Home About Features
│   │   │   ├── auth/                  Login Signup ForgotPassword ResetPassword
│   │   │   ├── dashboard/             Dashboard
│   │   │   ├── trips/                 MyTrips CreateTrip TripDetails
│   │   │   │                          EditTrip ActiveTrip TripBudget
│   │   │   ├── explore/               Explore
│   │   │   ├── nearby/                Nearby
│   │   │   ├── transport/             Transport RouteDetails
│   │   │   ├── hotels/                Hotels
│   │   │   ├── places/                Places
│   │   │   ├── ai/                    AIAssistant
│   │   │   ├── favorites/             Favorites
│   │   │   ├── profile/               Profile Settings
│   │   │   └── errors/                NotFound Unauthorized ServerError
│   │   │
│   │   ├── hooks/
│   │   ├── lib/                       axios.js queryClient.js leaflet.js
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── services/
│   │   ├── context/
│   │   ├── store/
│   │   ├── styles/
│   │   └── types/
│   │
│   ├── tests/
│   ├── .env.example                   VITE_API_BASE_URL=/api/v1
│   ├── vite.config.js                 proxies /api → :5000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
│
│ ╔══════════════════════════════════════╗
│ ║  2. BACKEND  —  server/              ║
│ ╚══════════════════════════════════════╝
│
├── server/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │   │
│   │   ├── config/                    env.js db.js cors.js logger.js
│   │   ├── controllers/
│   │   ├── models/                    User Trip Expense Conversation
│   │   │                              LocationSession LocationPoint
│   │   │                              Favorite Notification RefreshToken
│   │   │                              AuditLog AiUsage RouteCache
│   │   ├── routes/                    /api/v1/*  (see docs/API.md)
│   │   ├── services/
│   │   ├── providers/
│   │   │   ├── gemini/
│   │   │   ├── maps/
│   │   │   ├── transport/
│   │   │   ├── hotels/
│   │   │   └── places/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── repositories/
│   │   ├── prompts/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── jobs/
│   │   ├── data/indiaCatalog.js
│   │   ├── db/                        memory fallback + modelFactory
│   │   ├── docs/openapi.js
│   │   └── scripts/seed.js            MongoDB seed
│   │
│   ├── tests/
│   ├── uploads/avatars/
│   ├── .env.example
│   └── package.json
│
│
│ ╔══════════════════════════════════════╗
│ ║  3. MONGODB                          ║
│ ╚══════════════════════════════════════╝
│
│   Database name:   yatragenie
│   Local URI:       mongodb://127.0.0.1:27017/yatragenie
│   Atlas URI:       mongodb+srv://USER:PASS@CLUSTER/yatragenie
│
│   Collections (created automatically by Mongoose):
│     users
│     trips                 (itinerary embedded)
│     expenses
│     conversations
│     locationsessions
│     locationpoints
│     favorites
│     notifications
│     refreshtokens
│     auditlogs
│     aiusages
│     routecaches
│     place_catalog         (seed)
│     hotel_catalog         (seed)
│
│   Indexes: User.email  Trip.userId  Expense.tripId  Favorite.userId
│
└── docs/                              API FRONTEND DESIGN SECURITY DATABASE
```
