import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import Trip from "../models/Trip.js";
import User from "../models/User.js";
import { isDBConnected } from "../config/db.js";
import { memoryStore } from "../utils/memoryStore.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/stats", async (req, res) => {
  if (isDBConnected()) {
    const users = await User.countDocuments();
    const trips = await Trip.countDocuments();
    const recentTrips = await Trip.find().sort({ createdAt: -1 }).limit(10);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select("-password");
    res.json({ success: true, data: { users, trips, recentTrips, recentUsers } });
  } else {
    res.json({ success: true, data: { users: memoryStore.users.length, trips: memoryStore.trips.length, recentTrips: memoryStore.trips.slice(0,10), recentUsers: memoryStore.users.slice(0,10) } });
  }
});

router.get("/users", async (req, res) => {
  if (isDBConnected()) {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, data: { users } });
  } else {
    res.json({ success: true, data: { users: memoryStore.users.map(({password, ...u})=>u) } });
  }
});

export default router;
