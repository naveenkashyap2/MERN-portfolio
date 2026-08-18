# Database

Production persistence uses MongoDB via Mongoose (`server/src/models`). Demo mode uses an
in-memory store (`server/src/store`) with the same entity shapes.

## Models
- **User** — name, email (unique, indexed), passwordHash (select:false), googleId, avatar, role,
  isEmailVerified, preferences, lastLoginAt
- **Trip** — userId, title, origin, destination, dates, travelers, budget, travelStyle,
  transportPreference, stayPreference, interests, status, overview, itinerary[], budgetBreakdown,
  shareToken, aiGenerated, aiModel
- **Expense** — userId, tripId, amount, category, description, date
- **LocationPoint / LocationSession** — user/trip/session scoped, accuracy, timestamp (TTL index)
- **Conversation / Message** — user-scoped, embedded messages
- **Favorite** — userId + type + refId (unique index)
- **Notification** — userId, type, title, body, read
- **AuditLog** — userId, action, resource, requestId, ip, userAgent, meta
- **RefreshToken** — userId, jti, tokenHash, family, expiresAt, revoked, replacedBy

## Indexes
`User.email`, `Trip.userId + createdAt`, `Expense.tripId`, `Favorite.userId + type + refId`,
`LocationPoint.userId` (+ timestamp TTL), `RefreshToken.jti` / `expiresAt`, `AuditLog.createdAt`.

## Rules
- Strict schemas; unknown fields rejected.
- No arbitrary Mongo queries from user input (queries are built from validated params only).
- Pagination (`page`/`limit`) on lists; never return unlimited records.
