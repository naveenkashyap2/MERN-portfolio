const { asyncHandler } = require('../utils/asyncHandler');
const { ok, created } = require('../utils/ApiResponse');
const auth = require('../services/auth.service');
const { publicUser } = require('../utils/sanitize');

const register = asyncHandler(async (req, res) => {
  const data = await auth.register(req, res);
  created(res, data, 'Account created. Welcome to YatraGenie.');
});

const login = asyncHandler(async (req, res) => {
  const data = await auth.login(req, res);
  ok(res, data, 'Signed in.');
});

const google = asyncHandler(async (req, res) => {
  const data = await auth.googleLogin(req, res);
  ok(res, data, 'Signed in with Google.');
});

const refresh = asyncHandler(async (req, res) => {
  const data = await auth.refresh(req, res);
  ok(res, data, 'Session refreshed.');
});

const logout = asyncHandler(async (req, res) => {
  const data = await auth.logout(req, res);
  ok(res, data, 'Signed out.');
});

const forgot = asyncHandler(async (req, res) => {
  const data = await auth.forgotPassword(req);
  ok(res, data, 'If that email exists, we sent reset instructions.');
});

const reset = asyncHandler(async (req, res) => {
  const data = await auth.resetPassword(req, res);
  ok(res, data, 'Password updated. Please sign in.');
});

const verify = asyncHandler(async (req, res) => {
  const data = await auth.verifyEmail(req);
  ok(res, data, 'Email verified.');
});

const me = asyncHandler(async (req, res) => {
  ok(res, { user: publicUser(req.user) });
});

module.exports = { register, login, google, refresh, logout, forgot, reset, verify, me };
