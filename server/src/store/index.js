import { createCollection, newId, clone } from './memory.js';
import { buildSeed } from './seed.js';
import logger from '../utils/logger.js';

/**
 * Data access layer.
 *
 * In demo mode this is an in-memory store; in production a Mongo-backed
 * repository (see src/models/*) replaces it behind the same interface.
 */
export const store = {
  users: createCollection(),
  refreshTokens: createCollection(),
  trips: createCollection(),
  expenses: createCollection(),
  locationPoints: createCollection(),
  locationSessions: createCollection(),
  conversations: createCollection(),
  favorites: createCollection(),
  notifications: createCollection(),
  auditLogs: createCollection(),
  _seeded: false,
};

/* ---------------------------------- users --------------------------------- */
store.users.findByEmail = function findByEmail(email) {
  return this.find((u) => u.email === String(email).toLowerCase().trim());
};

store.users.toSafe = function toSafe(user) {
  if (!user) return null;
  const { passwordHash: _pw, ...rest } = user;
  return clone(rest);
};

store.users.create = function createUser(data) {
  const user = {
    id: data.id || newId('usr'),
    name: data.name,
    email: String(data.email).toLowerCase().trim(),
    passwordHash: data.passwordHash || null,
    googleId: data.googleId || null,
    avatar: data.avatar || '',
    role: data.role || 'user',
    isEmailVerified: Boolean(data.isEmailVerified),
    preferences: data.preferences || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: data.lastLoginAt || null,
  };
  this.insert(user);
  return user;
};

/* ---------------------------------- trips --------------------------------- */
store.trips.listByUser = function listByUser(userId) {
  return this.filter((t) => t.userId === userId).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
};

/* --------------------------------- favorites ------------------------------ */
store.favorites.findByUserAndRef = function findByUserAndRef(userId, type, refId) {
  return this.find((f) => f.userId === userId && f.type === type && f.refId === refId);
};

/* ------------------------------- conversations ---------------------------- */
store.conversations.listByUser = function listByUser(userId) {
  return this.filter((c) => c.userId === userId).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
};

/* ---------------------------------- audit --------------------------------- */
store.audit = function audit({ userId, action, resource, resourceId, req, meta }) {
  this.auditLogs.insert({
    id: newId('aud'),
    userId: userId || null,
    action,
    resource: resource || null,
    resourceId: resourceId || null,
    requestId: req?.id || null,
    ip: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null,
    meta: meta || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

/* --------------------------------- seeding -------------------------------- */
export async function seedStore(force = false) {
  if (store._seeded && !force) return store;
  const seed = await buildSeed();

  store.users.insert(seed.user);
  store.trips.insert(seed.trip);
  for (const e of seed.expenses) store.expenses.insert(e);
  for (const n of seed.notifications) store.notifications.insert(n);

  store._seeded = true;
  logger.success('[store] Seeded demo data (demo@yatragenie.ai / Demo@1234)');
  return store;
}
