import express from "express";
import { body } from "express-validator";
import { signup, login, me, logout, googleAuth, updateProfile, getHistory, addHistory } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", [
  body("name").trim().notEmpty().withMessage("Name required").isLength({ min: 2, max: 50 }),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
], signup);

router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, me);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);
router.get("/history", protect, getHistory);
router.post("/history", protect, addHistory);

export default router;
