import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { isDBConnected } from "../config/db.js";
import { memoryStore } from "../utils/memoryStore.js";

const sanitizeUser = (u) => {
  const { password, ...rest } = u.toObject ? u.toObject() : u;
  return rest;
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, message: errors.array()[0].msg });

  const { name, email, password, avatar } = req.body;

  if (isDBConnected()) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, avatar: avatar || "" });
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7*24*3600000, sameSite: "lax" });
    return res.status(201).json({ success: true, message: "Account created", data: { user: sanitizeUser(user), token } });
  } else {
    if (memoryStore.users.find(u => u.email === email)) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = { _id: memoryStore.generateId(), name, email, password: hashed, avatar: avatar || "", role: "user", history: [], stats: { totalTrips:0, totalDistanceKm:0, totalSteps:0 }, createdAt: new Date() };
    memoryStore.users.push(user);
    memoryStore.persist();
    const token = generateToken(user._id);
    const { password: pw, ...safe } = user;
    return res.status(201).json({ success: true, message: "Account created (in-memory)", data: { user: safe, token } });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  if (isDBConnected()) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7*24*3600000, sameSite: "lax" });
    return res.json({ success: true, message: "Login successful", data: { user: sanitizeUser(user), token } });
  } else {
    const user = memoryStore.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user._id);
    const { password: pw, ...safe } = user;
    return res.json({ success: true, message: "Login successful (in-memory)", data: { user: safe, token } });
  }
};

// Mock Google Auth — creates/finds user by email, no real OAuth verification (demo-safe)
export const googleAuth = async (req, res) => {
  const { name, email, avatar, googleId } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required for Google auth" });
  if (isDBConnected()) {
    let user = await User.findOne({ email });
    if (!user) {
      const randomPass = Math.random().toString(36).slice(-12);
      const hashed = await bcrypt.hash(randomPass, 10);
      user = await User.create({ name: name || email.split("@")[0], email, password: hashed, avatar: avatar || "", googleId });
    } else if (avatar && !user.avatar) {
      user.avatar = avatar; await user.save();
    }
    const token = generateToken(user._id);
    return res.json({ success: true, message: "Google login successful", data: { user: sanitizeUser(user), token } });
  } else {
    let user = memoryStore.users.find(u => u.email === email);
    if (!user) {
      user = { _id: memoryStore.generateId(), name: name || email.split("@")[0], email, password: await bcrypt.hash("google",10), avatar: avatar||"", role:"user", history:[], stats:{totalTrips:0,totalDistanceKm:0,totalSteps:0}, googleId, createdAt: new Date() };
      memoryStore.users.push(user);
      memoryStore.persist();
    }
    const token = generateToken(user._id);
    const { password, ...safe } = user;
    return res.json({ success: true, message: "Google login successful (mock)", data: { user: safe, token } });
  }
};

export const updateProfile = async (req, res) => {
  const { name, avatar, preferences } = req.body;
  if (isDBConnected()) {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar; // base64 up to 1MB
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    return res.json({ success: true, message: "Profile updated", data: { user: sanitizeUser(user) } });
  } else {
    const user = memoryStore.users.find(u => u._id === req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    memoryStore.persist();
    const { password, ...safe } = user;
    return res.json({ success: true, message: "Profile updated (memory)", data: { user: safe } });
  }
};

export const addHistory = async (req, res) => {
  const { destination, from, days, tripId, distanceKm, steps } = req.body;
  if (isDBConnected()) {
    const user = await User.findById(req.user._id);
    user.history.unshift({ destination, from, days, tripId });
    if (user.history.length > 50) user.history = user.history.slice(0,50);
    if (distanceKm) user.stats.totalDistanceKm += Number(distanceKm);
    if (steps) user.stats.totalSteps += Number(steps);
    user.stats.totalTrips = user.history.length;
    await user.save();
    return res.json({ success: true, data: { history: user.history, stats: user.stats } });
  } else {
    const user = memoryStore.users.find(u => u._id === req.user._id);
    user.history = user.history || [];
    user.history.unshift({ destination, from, days, tripId, visitedAt: new Date() });
    user.stats = user.stats || { totalTrips:0,totalDistanceKm:0,totalSteps:0 };
    if (distanceKm) user.stats.totalDistanceKm += Number(distanceKm);
    if (steps) user.stats.totalSteps += Number(steps);
    user.stats.totalTrips = user.history.length;
    memoryStore.persist();
    return res.json({ success: true, data: { history: user.history, stats: user.stats } });
  }
};

export const getHistory = async (req, res) => {
  if (isDBConnected()) {
    const user = await User.findById(req.user._id);
    return res.json({ success: true, data: { history: user.history, stats: user.stats } });
  } else {
    const user = memoryStore.users.find(u => u._id === req.user._id);
    return res.json({ success: true, data: { history: user.history||[], stats: user.stats||{totalTrips:0,totalDistanceKm:0,totalSteps:0} } });
  }
};

export const me = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};
