import { body } from "express-validator";

export const validateTrip = [
  body("source").trim().notEmpty().withMessage("Source is required").isLength({ max: 100 }),
  body("destination").trim().notEmpty().withMessage("Destination is required").isLength({ max: 100 }),
  body("days").isInt({ min: 1, max: 30 }).withMessage("Days must be 1-30"),
  body("travelers").isInt({ min: 1, max: 20 }).withMessage("Travelers must be 1-20"),
  body("budget").isInt({ min: 1000 }).withMessage("Budget too low"),
  body("interests").optional().isArray(),
  body("travelStyle").optional().isIn(["budget","comfort","luxury"]),
];
