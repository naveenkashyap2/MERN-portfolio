# API Reference

Base URL: `/api/v1`. All responses use the envelope `{ success, data }` (or
`{ success: false, message, requestId }` on error).

Auth: `Authorization: Bearer <accessToken>` for protected routes; refresh token via HttpOnly cookie.

## Auth
| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Email/password login |
| POST | `/auth/google` | — | Google OAuth (verify credential server-side) |
| POST | `/auth/refresh` | cookie | Rotate refresh token |
| POST | `/auth/logout` | optional | Revoke current session |
| POST | `/auth/logout-all` | ✔ | Revoke all sessions |
| POST | `/auth/change-password` | ✔ | Change password |
| POST | `/auth/forgot-password` | — | Request reset |
| POST | `/auth/reset-password` | — | Reset password |
| POST | `/auth/verify-email` | — | Verify email token |
| GET | `/auth/me` | ✔ | Current user |

## Users
`GET/PATCH/DELETE /users/me` · `PATCH /users/me/avatar` · `GET/PATCH /users/me/preferences`

## Trips
`POST/GET /trips` · `GET/PATCH/DELETE /trips/:tripId` · `POST /trips/:tripId/duplicate` ·
`POST /trips/:tripId/share` · `GET /trips/:tripId/share/:shareToken` (view-only)

## Itinerary
`GET /trips/:tripId/itinerary` · `POST /trips/:tripId/itinerary` ·
`PATCH/DELETE /trips/:tripId/itinerary/:itemId` · `POST /trips/:tripId/itinerary/reorder` ·
`GET /trips/:tripId/itinerary/day/:day`

## AI
`POST /ai/trip/generate` · `POST /ai/trip/natural-language` · `POST /ai/trip/regenerate` ·
`POST /ai/trip/optimize` · `POST /ai/trip/replan` · `POST /ai/trip/budget-optimize` ·
`POST /ai/trip/route-optimize` · `POST /ai/trip/suggest`

## Assistant
`POST /assistant/chat` · `POST /assistant/replan` ·
`GET/POST /assistant/conversations` · `GET/DELETE /assistant/conversations/:conversationId`

## Location
`POST /location/start` · `POST /location/update` · `POST /location/stop` ·
`GET /location/current` · `GET/DELETE /location/history` · `GET /location/distance` ·
`GET /location/arrival-status`

## Routes & walking
`POST /routes/{plan|walking|driving|transit}` · `POST /routes/compare` · `GET /routes/:routeId` ·
`POST /walking/route` · `GET /walking/distance` · `GET /walking/eta`

## Transport
`GET /transport/trains/search` · `GET /transport/trains/:trainId` · `GET /transport/trains/:trainId/schedule` ·
`GET /transport/trains/availability` · (same for `/buses`) · `GET /transport/compare` · `GET /transport/local`

## Hotels
`GET /hotels/search` · `GET /hotels/:hotelId` · `GET /hotels/recommended` ·
`GET /hotels/{budget|medium|premium}`

## Places
`GET /places/search` · `GET /places/nearby` · `GET /places/:placeId` ·
`GET /places/{temples|gurudwaras|historical|nature|recommended}`

## Expenses
`POST/GET /trips/:tripId/expenses` · `GET/PATCH/DELETE /trips/:tripId/expenses/:expenseId` ·
`GET /trips/:tripId/expenses/summary`

## Favorites
`POST/GET /favorites` · `DELETE /favorites/:favoriteId` · `GET /favorites/check/:placeId`

## Notifications
`GET /notifications` · `PATCH /notifications/:notificationId/read` · `PATCH /notifications/read-all` ·
`DELETE /notifications/:notificationId`

## Health
`GET /health` · `GET /health/database` · `GET /health/services`
