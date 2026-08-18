# YatraGenie API Spec — v1

Base: `http://localhost:5000/api/v1` (prod: `https://api.yatragenie.com/api/v1`)

## Auth
| Method | Endpoint | Auth | Body | Success | Errors |
|--------|----------|------|------|---------|--------|
| POST | `/auth/signup` | No | `{name,email,password}` | 201 `{user,token}` | 409 duplicate, 422 validation |
| POST | `/auth/login` | No | `{email,password}` | 200 `{user,token}` | 401 invalid |
| GET | `/auth/me` | Bearer | - | 200 `{user}` | 401 |
| POST | `/auth/logout` | Bearer | - | 200 | - |

## Trips
| Method | Endpoint | Auth | Query/Body | Success |
|--------|----------|------|------------|---------|
| POST | `/trips/generate` | Optional | Body `{source,destination,days,travelers,budget,interests[],travelStyle,budgetType}` | 200 `{trip,isMock}` |
| GET | `/trips` | Bearer | `?page&limit` | 200 `{trips,pagination}` |
| GET | `/trips/public` | No | `?search&page` | 200 `{trips,pagination}` |
| GET | `/trips/:id` | No | - | 200 `{trip}` 404 |
| POST | `/trips/chat/:id` | No | `{message}` | 200 `{reply}` |
| DELETE | `/trips/:id` | Bearer | - | 200 403 404 |
| GET | `/trips/stats` | No | - | 200 `{totalTrips,totalUsers,popular}` |

**Example Generate Request**
```json
{
  "source": "Delhi",
  "destination": "Jaipur",
  "days": 3,
  "travelers": 2,
  "budget": 15000,
  "interests": ["Culture","Food"],
  "travelStyle": "comfort",
  "budgetType": "total"
}
```

**Example Generate Response**
```json
{
  "success": true,
  "message": "Itinerary generated via Gemini",
  "data": {
    "trip": {
      "_id": "mem_...",
      "title": "3 Days in Jaipur from Delhi ✈️",
      "itinerary": [{ "day":1, "title":"...", "places": [...] }],
      "budgetBreakdown": {"stay":"₹5500","food":"₹3500","transport":"₹4000","activities":"₹2000","total":"₹15000"},
      "mapCenter": {"lat":26.91,"lng":75.78}
    },
    "isMock": false
  }
}
```

## Admin
| Method | Endpoint | Auth | Success |
|--------|----------|------|---------|
| GET | `/admin/stats` | Admin | 200 `{users,trips,recentTrips,recentUsers}` |
| GET | `/admin/users` | Admin | 200 `{users}` |

## Health
- GET `/` → 200 `{message, version, gemini}`
- GET `/api/v1/health` → 200 `{uptime, gemini}`

**Headers:** `Authorization: Bearer <token>` or `Cookie: token=<jwt>`
**Rate Limits:** Global 200/15min, AI 20/min → 429
**Errors:** `{success:false, message, error:{code}}`
