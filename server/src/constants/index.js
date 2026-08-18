const ROLES = Object.freeze({ USER: 'user', ADMIN: 'admin' });

const TRIP_STATUS = Object.freeze({
  DRAFT: 'draft',
  PLANNED: 'planned',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

const TRANSPORT = Object.freeze(['train', 'bus', 'car', 'walking', 'any']);
const STAY = Object.freeze(['budget', 'medium', 'premium', 'none']);
const INTERESTS = Object.freeze([
  'temple',
  'gurudwara',
  'historical',
  'nature',
  'adventure',
  'food',
  'shopping',
  'photography',
  'family',
  'spiritual',
  'mosque',
  'church',
]);

const EXPENSE_CATEGORIES = Object.freeze([
  'transport',
  'hotel',
  'food',
  'shopping',
  'entry_fees',
  'activities',
  'other',
]);

const TRUST = Object.freeze({
  LIVE_VERIFIED: 'LIVE VERIFIED',
  AI_RECOMMENDED: 'AI RECOMMENDED',
  AI_ESTIMATE: 'AI ESTIMATE',
  ESTIMATED: 'ESTIMATED',
  CACHED: 'CACHED',
  CATALOG: 'CATALOG',
});

const UNVERIFIED_LIVE = 'Live availability could not be verified.';

const LOCATION_RADII = Object.freeze([50, 100, 250]);
const ARRIVAL_CONFIRMATIONS = 2;

const AI_LIMITS = Object.freeze({
  maxPromptChars: 12000,
  maxResponseChars: 24000,
  perMinute: 6,
  perHour: 30,
  perDay: 80,
});

const COOKIE = Object.freeze({
  access: 'yg_access',
  refresh: 'yg_refresh',
});

module.exports = {
  ROLES,
  TRIP_STATUS,
  TRANSPORT,
  STAY,
  INTERESTS,
  EXPENSE_CATEGORIES,
  TRUST,
  UNVERIFIED_LIVE,
  LOCATION_RADII,
  ARRIVAL_CONFIRMATIONS,
  AI_LIMITS,
  COOKIE,
};
