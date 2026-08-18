const path = require('path');
const fs = require('fs/promises');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Favorite = require('../models/Favorite');
const Conversation = require('../models/Conversation');
const LocationSession = require('../models/LocationSession');
const LocationPoint = require('../models/LocationPoint');
const Notification = require('../models/Notification');
const RefreshToken = require('../models/RefreshToken');
const { INTERESTS, TRANSPORT, STAY } = require('../constants');
const { ApiError } = require('../utils/ApiError');
const { rejectUnknown, pick, assert } = require('../utils/validate');
const { publicUser } = require('../utils/sanitize');
const { audit } = require('./audit.service');
const { listSessions } = require('./auth.service');

async function getMe(req) {
  const sessions = await listSessions(req.user._id);
  return { user: publicUser(req.user), sessions };
}

async function updateMe(req) {
  rejectUnknown(req.body, ['name', 'onboardingCompleted']);
  if (req.body.name !== undefined) {
    const name = String(req.body.name).trim();
    assert(name.length >= 2 && name.length <= 80, 'Please enter a valid name.');
    req.user.name = name;
  }
  if (req.body.onboardingCompleted !== undefined) {
    req.user.onboardingCompleted = Boolean(req.body.onboardingCompleted);
  }
  await req.user.save();
  return { user: publicUser(req.user) };
}

function sanitizePreferences(input) {
  const next = {};
  if (input.travelStyle !== undefined) next.travelStyle = String(input.travelStyle).slice(0, 80);
  if (input.budgetPreference !== undefined) {
    assert(['', 'budget', 'comfort', 'premium'].includes(input.budgetPreference), 'Invalid budget preference.');
    next.budgetPreference = input.budgetPreference;
  }
  if (input.preferredTransport !== undefined) {
    assert(['', ...TRANSPORT].includes(input.preferredTransport), 'Invalid transport preference.');
    next.preferredTransport = input.preferredTransport;
  }
  if (input.preferredHotel !== undefined) {
    assert(['', ...STAY].includes(input.preferredHotel), 'Invalid hotel preference.');
    next.preferredHotel = input.preferredHotel;
  }
  if (input.favoriteCategories !== undefined) {
    next.favoriteCategories = (input.favoriteCategories || []).map(String).slice(0, 20);
  }
  if (input.travelFrequency !== undefined) next.travelFrequency = String(input.travelFrequency).slice(0, 40);
  if (input.interests !== undefined) {
    const interests = input.interests || [];
    assert(interests.every((i) => INTERESTS.includes(i)), 'Invalid interest.');
    next.interests = interests;
  }
  if (input.language !== undefined) next.language = String(input.language).slice(0, 8);
  if (input.theme !== undefined) {
    assert(['dark', 'system'].includes(input.theme), 'Invalid theme.');
    next.theme = input.theme;
  }
  if (input.notifications) next.notifications = input.notifications;
  if (input.location) {
    next.location = {
      trackingEnabled: Boolean(input.location.trackingEnabled),
      historyEnabled: Boolean(input.location.historyEnabled),
    };
  }
  if (input.ai) next.ai = input.ai;
  return next;
}

async function updatePreferences(req) {
  const allowed = [
    'travelStyle',
    'budgetPreference',
    'preferredTransport',
    'preferredHotel',
    'favoriteCategories',
    'travelFrequency',
    'interests',
    'language',
    'theme',
    'notifications',
    'location',
    'ai',
  ];
  rejectUnknown(req.body, allowed);
  const next = sanitizePreferences(req.body);
  req.user.preferences = { ...req.user.preferences.toObject(), ...next };
  if (next.interests || next.preferredTransport) req.user.onboardingCompleted = true;
  await req.user.save();
  return { preferences: req.user.preferences };
}

async function getPreferences(req) {
  return { preferences: req.user.preferences };
}

async function updateAvatar(req) {
  if (!req.file) throw new ApiError(400, 'Please choose an image.');
  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp']);
  if (!allowed.has(req.file.mimetype)) {
    await fs.unlink(req.file.path).catch(() => {});
    throw new ApiError(400, 'Only JPG, PNG, or WebP images are allowed.');
  }
  const rel = `/uploads/avatars/${path.basename(req.file.path)}`;
  req.user.avatar = rel;
  await req.user.save();
  return { user: publicUser(req.user) };
}

async function deleteAccount(req, res) {
  const userId = req.user._id;
  const trips = await Trip.find({ userId }).select('_id');
  const tripIds = trips.map((t) => t._id);
  await Promise.all([
    Expense.deleteMany({ userId }),
    Favorite.deleteMany({ userId }),
    Conversation.deleteMany({ userId }),
    LocationPoint.deleteMany({ userId }),
    LocationSession.deleteMany({ userId }),
    Notification.deleteMany({ userId }),
    RefreshToken.deleteMany({ userId }),
    Trip.deleteMany({ userId }),
  ]);
  await User.deleteOne({ _id: userId });
  await audit('user.delete_account', req, { tripCount: tripIds.length });
  const { clearAuthCookies } = require('./auth.service');
  clearAuthCookies(res);
  return { ok: true };
}

module.exports = {
  getMe,
  updateMe,
  updatePreferences,
  getPreferences,
  updateAvatar,
  deleteAccount,
  pick,
};
