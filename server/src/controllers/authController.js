import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { isDBConnected } from "../config/db.js";
import { memoryStore } from "../utils/memoryStore.js";

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, message: errors.array()[0].msg });

  const { name, email, password } = req.body;

  if (isDBConnected()) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7*24*3600000, sameSite: "lax" });
    return res.status(201).json({ success: true, message: "Account created", data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } else {
    // Memory fallback
    if (memoryStore.users.find(u => u.email === email)) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = { _id: memoryStore.generateId(), name, email, password: hashed, role: "user", createdAt: new Date() };
    memoryStore.users.push(user);
    const token = generateToken(user._id);
    const { password: pw, ...safe } = user;
    return res.status(201).json({ success: true, message: "Account created (in-memory)", data: { user: safe, token } });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

  let user, isMatch;
  if (isDBConnected()) {
    user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 7*24*3600000, sameSite: "lax" });
    return res.json({ success: true, message: "Login successful", data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } else {
    user = memoryStore.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const token = generateToken(user._id);
    const { password: pw, ...safe } = user;
    return res.json({ success: true, message: "Login successful (in-memory)", data: { user: safe, token } });
  }
};

export const me = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out" });
};
