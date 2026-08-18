const DANGEROUS_KEYS = new Set(['$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$or', '$and', '$nor', '$not', '$regex', '$where', '$expr', '$jsonSchema', '$mod', '$text', '$elemMatch', 'constructor', '__proto__', 'prototype']);

function stripMongo(value) {
  if (Array.isArray(value)) return value.map(stripMongo);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('$') || DANGEROUS_KEYS.has(k)) continue;
      out[k] = stripMongo(v);
    }
    return out;
  }
  return value;
}

function clipString(value, max = 2000) {
  if (typeof value !== 'string') return value;
  return value.trim().slice(0, max);
}

function publicUser(user) {
  if (!user) return null;
  const doc = user.toObject ? user.toObject() : user;
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    avatar: doc.avatar || '',
    role: doc.role,
    isEmailVerified: Boolean(doc.isEmailVerified),
    hasGoogle: Boolean(doc.googleId),
    hasPassword: Boolean(doc.passwordHash),
    preferences: doc.preferences || {},
    onboardingCompleted: Boolean(doc.onboardingCompleted),
    createdAt: doc.createdAt,
    lastLoginAt: doc.lastLoginAt,
  };
}

module.exports = { stripMongo, clipString, publicUser };
