import express from "express";
import { body } from "express-validator";
import { signup, login, me, logout } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", [
  body("name").trim().notEmpty().withMessage("Name required").isLength({ min: 2, max: 50 }),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
], signup);

router.post("/login", login);
router.get("/me", protect, me);
router.post("/logout", protect, logout);

export default router;
