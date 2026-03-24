// index.js

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/mongodb.js";
import server from "./app.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`🔑 Mock OTP    : ${process.env.USE_MOCK_OTP === "true" ? "ON  ← OTP prints to console" : "OFF ← Twilio SMS active"}`);

    console.log(`\n📋 ── AUTH ROUTES (/api/user) ───────────────────────────────`);
    console.log(`   POST   http://localhost:${PORT}/api/user/sendOtp`);
    console.log(`   POST   http://localhost:${PORT}/api/user/verifyOtp`);
    console.log(`   POST   http://localhost:${PORT}/api/user/loginWithEmail`);
    console.log(`   GET    http://localhost:${PORT}/api/user/logout`);

    console.log(`\n📋 ── PROFILE ROUTES (/api/profile) ─────────────────────────`);
    console.log(`   POST   http://localhost:${PORT}/api/profile/createProfile`);
    console.log(`   GET    http://localhost:${PORT}/api/profile/Profile/:authID`);
    console.log(`   PATCH  http://localhost:${PORT}/api/profile/Profile          [protected]`);

    console.log(`\n📋 ── EMOTION ROUTES (/api/emotion) ─────────────────────────`);
    console.log(`   GET    http://localhost:${PORT}/api/emotion/today             [protected]`);
    console.log(`   POST   http://localhost:${PORT}/api/emotion/save              [protected]`);
    console.log(`   POST   http://localhost:${PORT}/api/emotion/feedback          [protected]`);

    console.log(`\n📋 ── HEALTH ─────────────────────────────────────────────────`);
    console.log(`   GET    http://localhost:${PORT}/health`);
    console.log(`\n`);
  });

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT",  () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start();