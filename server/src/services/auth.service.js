const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { env } = require('../config/env');
const { COOKIE } = require('../constants');
const { ApiError } = require('../utils/ApiError');
const { assert, isEmail, rejectUnknown } = require('../utils/validate');
const { validatePassword, hashPassword, verifyPassword } = require('../utils/password');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefresh,
  randomToken,
  hashToken,
  cookieOptions,
} = require('../utils/tokens');
const { publicUser } = require('../utils/sanitize');
const { audit } = require('./audit.service');

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

function setAuthCookies(res, { access, refresh }) {
  res.cookie(
    COOKIE.access,
    access,
    cookieOptions({ maxAgeMs: 15 * 60 * 1000, path: '/' })
  );
  res.cookie(
    COOKIE.refresh,
    refresh,
    cookieOptions({ maxAgeMs: env.refreshTtlDays * 24 * 60 * 60 * 1000, path: '/' })
  );
}

function clearAuthCookies(res) {
  res.clearCookie(COOKIE.access, { path: '/' });
  res.clearCookie(COOKIE.refresh, { path: '/' });
}

async function issueSession(user, req, res, { familyId } = {}) {
  const fid = familyId || randomToken(16);
  const access = signAccessToken({ sub: String(user._id), role: user.role });
  const refresh = signRefreshToken({ sub: String(user._id), fam: fid });
  const expiresAt = new Date(Date.now() + env.refreshTtlDays * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refresh),
    familyId: fid,
    userAgent: String(req.get('user-agent') || '').slice(0, 300),
    ip: req.ip,
    expiresAt,
  });
  setAuthCookies(res, { access, refresh });
  return { accessExpiresIn: env.accessTtl };
}

async function register(req, res) {
  rejectUnknown(req.body, ['name', 'email', 'password']);
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  assert(name.length >= 2 && name.length <= 80, 'Please enter your name.');
  assert(isEmail(email), 'Please enter a valid email.');
  const pwd = validatePassword(password);
  assert(pwd.ok, pwd.message);

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.', { code: 'EMAIL_TAKEN' });
  }

  const passwordHash = await hashPassword(password);
  const verifyRaw = randomToken();
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'user',
    isEmailVerified: !env.isProd,
    emailVerifyTokenHash: hashToken(verifyRaw),
    emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    preferences: {},
    deletedAt: null,
  });

  await issueSession(user, req, res);
  await audit('auth.register', req, { userId: String(user._id) });

  const payload = { user: publicUser(user) };
  if (!env.isProd) payload.verifyToken = verifyRaw;
  return payload;
}

async function login(req, res) {
  rejectUnknown(req.body, ['email', 'password']);
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = req.body.password;
  assert(isEmail(email), 'Please enter a valid email.');
  assert(typeof password === 'string', 'Password is required.');

  const user = await User.findOne({ email, deletedAt: null }).select('+passwordHash');
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !valid) {
    throw new ApiError(401, 'Invalid email or password.', { code: 'INVALID_CREDENTIALS' });
  }

  user.lastLoginAt = new Date();
  await user.save();
  await issueSession(user, req, res);
  await audit('auth.login', req, { userId: String(user._id) });
  return { user: publicUser(user) };
}

async function googleLogin(req, res) {
  rejectUnknown(req.body, ['credential', 'idToken']);
  const credential = req.body.credential || req.body.idToken;
  assert(credential, 'Google credential is required.');
  if (!googleClient || !env.googleClientId) {
    throw new ApiError(503, 'Google sign-in is not configured yet.', { code: 'GOOGLE_UNCONFIGURED' });
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId,
    });
  } catch {
    throw new ApiError(401, 'Google sign-in could not be verified.', { code: 'GOOGLE_INVALID' });
  }
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) {
    throw new ApiError(401, 'Google sign-in could not be verified.', { code: 'GOOGLE_INVALID' });
  }

  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
    deletedAt: null,
  });
  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      avatar: payload.picture || '',
      isEmailVerified: Boolean(payload.email_verified),
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    if (!user.avatar && payload.picture) user.avatar = payload.picture;
    user.isEmailVerified = user.isEmailVerified || Boolean(payload.email_verified);
    await user.save();
  }

  user.lastLoginAt = new Date();
  await user.save();
  await issueSession(user, req, res);
  await audit('auth.google', req, { userId: String(user._id) });
  return { user: publicUser(user) };
}

async function refresh(req, res) {
  const token = req.cookies?.[COOKIE.refresh];
  if (!token) throw new ApiError(401, 'Session expired. Please sign in again.', { code: 'NO_REFRESH' });

  let payload;
  try {
    payload = verifyRefresh(token);
  } catch {
    clearAuthCookies(res);
    throw new ApiError(401, 'Session expired. Please sign in again.', { code: 'REFRESH_INVALID' });
  }

  const tokenHash = hashToken(token);
  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored || stored.revokedAt) {
    await RefreshToken.updateMany(
      { userId: payload.sub, familyId: payload.fam, revokedAt: null },
      { $set: { revokedAt: new Date(), reuseDetected: true } }
    );
    clearAuthCookies(res);
    await audit('auth.refresh_reuse', req, { userId: payload.sub });
    throw new ApiError(401, 'Session expired. Please sign in again.', { code: 'REFRESH_REUSE' });
  }

  stored.revokedAt = new Date();
  const user = await User.findById(payload.sub);
  if (!user || user.deletedAt) {
    await stored.save();
    clearAuthCookies(res);
    throw new ApiError(401, 'Please sign in to continue.', { code: 'UNAUTHENTICATED' });
  }

  const next = await issueSession(user, req, res, { familyId: stored.familyId });
  stored.replacedByHash = hashToken(req.cookies[COOKIE.refresh] || '');
  await stored.save();
  return { ok: true, ...next };
}

async function logout(req, res) {
  const all = Boolean(req.body?.all);
  const token = req.cookies?.[COOKIE.refresh];
  if (token) {
    const tokenHash = hashToken(token);
    if (all && req.user) {
      await RefreshToken.updateMany(
        { userId: req.user._id, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
    } else {
      await RefreshToken.updateOne({ tokenHash }, { $set: { revokedAt: new Date() } });
    }
  }
  clearAuthCookies(res);
  await audit(all ? 'auth.logout_all' : 'auth.logout', req, {});
  return { ok: true };
}

async function forgotPassword(req) {
  rejectUnknown(req.body, ['email']);
  const email = String(req.body.email || '').trim().toLowerCase();
  assert(isEmail(email), 'Please enter a valid email.');
  const user = await User.findOne({ email, deletedAt: null });
  const generic = { sent: true };
  if (!user) return generic;
  const raw = randomToken();
  user.passwordResetTokenHash = hashToken(raw);
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  await audit('auth.forgot_password', req, { userId: String(user._id) });
  if (!env.isProd) return { sent: true, resetToken: raw };
  return generic;
}

async function resetPassword(req, res) {
  rejectUnknown(req.body, ['token', 'password']);
  const token = String(req.body.token || '');
  const pwd = validatePassword(req.body.password);
  assert(token.length > 10, 'Reset link is invalid or expired.');
  assert(pwd.ok, pwd.message);
  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetTokenHash +passwordResetExpires +passwordHash');
  if (!user) throw new ApiError(400, 'Reset link is invalid or expired.', { code: 'RESET_INVALID' });
  user.passwordHash = await hashPassword(req.body.password);
  user.passwordResetTokenHash = '';
  user.passwordResetExpires = null;
  await user.save();
  await RefreshToken.updateMany({ userId: user._id, revokedAt: null }, { $set: { revokedAt: new Date() } });
  clearAuthCookies(res);
  await audit('auth.reset_password', req, { userId: String(user._id) });
  return { ok: true };
}

async function verifyEmail(req) {
  rejectUnknown(req.body, ['token']);
  const token = String(req.body.token || '');
  assert(token.length > 10, 'Verification link is invalid.');
  const user = await User.findOne({
    emailVerifyTokenHash: hashToken(token),
    emailVerifyExpires: { $gt: new Date() },
  }).select('+emailVerifyTokenHash +emailVerifyExpires');
  if (!user) throw new ApiError(400, 'Verification link is invalid or expired.', { code: 'VERIFY_INVALID' });
  user.isEmailVerified = true;
  user.emailVerifyTokenHash = '';
  user.emailVerifyExpires = null;
  await user.save();
  await audit('auth.verify_email', req, { userId: String(user._id) });
  return { user: publicUser(user) };
}

async function listSessions(userId) {
  const sessions = await RefreshToken.find({ userId, revokedAt: null, expiresAt: { $gt: new Date() } })
    .select('userAgent ip createdAt expiresAt')
    .sort({ createdAt: -1 })
    .lean();
  return sessions.map((s) => ({
    id: String(s._id),
    userAgent: s.userAgent,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
  }));
}

module.exports = {
  register,
  login,
  googleLogin,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  listSessions,
  setAuthCookies,
  clearAuthCookies,
};
