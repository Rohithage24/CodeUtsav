// app.js

import express      from "express";
import cors         from "cors";
import http         from "http";
import cookieParser from "cookie-parser";
import dotenv       from "dotenv";

import authRoutes        from "./routes/auth.routes.js";
import profileRouter     from "./routes/profile.routes.js";
import userEmotionRoutes from "./routes/recomendation.routes.js";
import bookRoutes        from "./routes/book.routes.js";
import communityRoutes   from "./routes/community.routes.js";

dotenv.config();

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// ✅ FIX: original expression was always `true` due to operator precedence bug.
//         Now properly checks CORS_ORIGIN from .env
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? true
        : process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials:    true,
    methods:        ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success:     true,
    message:     "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp:   new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/user",      authRoutes);
app.use("/api/profile",   profileRouter);
app.use("/api/emotion",   userEmotionRoutes);
app.use("/api/books",     bookRoutes);
app.use("/api/community", communityRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const server = http.createServer(app);
export default server;