# Database

**Engine:** MongoDB (Mongoose)

**Local:** `mongodb://127.0.0.1:27017/yatragenie` via `docker compose up -d mongo`  
**Atlas:** `mongodb+srv://USER:PASS@CLUSTER/yatragenie`

Set `USE_IN_MEMORY_DB=false` and a real `MONGODB_URI` for live data.

## Collections

| Collection | Source |
|---|---|
| users | User model |
| trips | Trip + embedded itinerary |
| expenses | Expense |
| conversations | Assistant threads |
| locationsessions / locationpoints | Live GPS (consent only) |
| favorites / notifications | User scoped |
| refreshtokens | Rotating sessions |
| auditlogs / aiusages | Security + Gemini cost |
| routecaches | Geometric routes |
| place_catalog / hotel_catalog | `npm run seed` |

## Indexes

User.email · Trip.userId + createdAt · Expense.tripId · Favorite.userId · Location sessionId

Seed:

```bash
npm run seed
```

Demo user: `demo@yatragenie.ai` / `Travel@123`
