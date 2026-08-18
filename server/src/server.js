import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import dotenv from "dotenv";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// Security & Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  config.clientUrl,
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, cb) {
    if (!origin) return cb(null, true);
    // Allow any preview host (*.e2b.app) and localhost
    if (origin.includes("e2b.app") || origin.includes("localhost") || origin.includes("127.0.0.1") || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(null, true); // allow all for demo
  },
  credentials: true,
}));

app.use(mongoSanitize());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests, try again later" }
});
app.use("/api/", limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, message: "AI limit: 20 requests/min" }
});

// Health
app.get("/", (req, res) => {
  res.json({ success: true, message: "🚀 YatraGenie AI Server Running", version: "1.0.0", gemini: config.geminiKey ? "connected" : "mock mode" });
});

app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, message: "Health OK", uptime: process.uptime(), gemini: config.geminiKey ? "live" : "mock" });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/trips", aiLimiter, tripRoutes);
app.use("/api/v1/admin", adminRoutes);

// 404 & Error
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = config.port;
app.listen(PORT, "0.0.0.0", () => {

    console.log(`✅ YatraGenie Server running on 0.0.0.0:${PORT}`);
    console.log(`🤖 Gemini: ${config.geminiKey ? "LIVE (real AI)" : "MOCK MODE (set GEMINI_API_KEY for real AI)"}`);
    console.log(`🌍 Client URL: ${config.clientUrl}`);
  });
connectDB();

export default app;
