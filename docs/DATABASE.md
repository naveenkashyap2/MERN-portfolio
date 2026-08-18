# Database

Models: User, RefreshToken, Trip (embedded itinerary), Expense, LocationSession, LocationPoint, Conversation, Favorite, Notification, AuditLog, AiUsage, RouteCache.

Indexes: User.email, Trip.userId + createdAt, Expense.tripId, Favorite.userId, Location sessionId, TTL-style purge on location points.
