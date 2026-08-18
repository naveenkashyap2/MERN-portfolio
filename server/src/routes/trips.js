import express from "express";
import { generateTrip, getMyTrips, getPublicTrips, getTripById, deleteTrip, chatTrip, getStats } from "../controllers/tripController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/public", getPublicTrips);
router.get("/stats", getStats);
router.get("/:id", getTripById);
router.post("/chat/:id", chatTrip);

// Protected optional - allow generation without auth but try to detect token
router.post("/generate", async (req, res, next) => {
  // Try to attach user if token present, but don't fail
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Use protect middleware logic but optional
    try {
      await new Promise((resolve) => {
        protect(req, res, (err) => {
          if (err) resolve();
          else resolve();
        });
      });
    } catch {}
  }
  next();
}, generateTrip);

router.get("/", protect, getMyTrips);
router.delete("/:id", protect, deleteTrip);

export default router;
