const { asyncHandler } = require('../utils/asyncHandler');
const { ok } = require('../utils/ApiResponse');
const users = require('../services/user.service');

module.exports = {
  me: asyncHandler(async (req, res) => ok(res, await users.getMe(req))),
  update: asyncHandler(async (req, res) => ok(res, await users.updateMe(req), 'Profile updated.')),
  remove: asyncHandler(async (req, res) => ok(res, await users.deleteAccount(req, res), 'Account deleted.')),
  prefs: asyncHandler(async (req, res) => ok(res, await users.getPreferences(req))),
  updatePrefs: asyncHandler(async (req, res) => ok(res, await users.updatePreferences(req), 'Preferences saved.')),
  avatar: asyncHandler(async (req, res) => ok(res, await users.updateAvatar(req), 'Avatar updated.')),
};
