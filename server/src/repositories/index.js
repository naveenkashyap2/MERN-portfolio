const User = require('../models/User');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Conversation = require('../models/Conversation');
const Favorite = require('../models/Favorite');
const Notification = require('../models/Notification');
const LocationSession = require('../models/LocationSession');
const LocationPoint = require('../models/LocationPoint');

module.exports = {
  users: User,
  trips: Trip,
  expenses: Expense,
  conversations: Conversation,
  favorites: Favorite,
  notifications: Notification,
  locationSessions: LocationSession,
  locationPoints: LocationPoint,
};
