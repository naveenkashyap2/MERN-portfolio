import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import User from "../models/User.js";
import { isDBConnected } from "../config/db.js";
import { memoryStore } from "../utils/memoryStore.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token", error: { code: "NO_TOKEN" } });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    
    if (isDBConnected()) {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) throw new Error("User not found");
      req.user = user;
    } else {
      const user = memoryStore.users.find(u => u._id === decoded.id);
      if (!user) throw new Error("User not found");
      const { password, ...rest } = user;
      req.user = rest;
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed", error: { code: "TOKEN_FAILED" } });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden", error: { code: "FORBIDDEN" } });
  }
  next();
};
