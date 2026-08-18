import express from "express";
import { generateTrip, getMyTrips, getPublicTrips, getTripById, deleteTrip, chatTrip, getStats } from "../controllers/tripController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/public", getPublicTrips);
router.get("/stats", getStats);
router.get("/:id", getTripById);
router.post("/chat/:id", chatTrip);

// Now MANDATORY AUTH - security important as per user request
router.post("/generate", protect, generateTrip);
router.get("/", protect, getMyTrips);
router.delete("/:id", protect, deleteTrip);

export default router;
