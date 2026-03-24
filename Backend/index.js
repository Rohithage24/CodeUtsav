// index.js

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/mongodb.js";
import server from "./app.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  // ✅ Connect to MongoDB FIRST, then start server
  await connectDB();

  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`🔑 Mock OTP    : ${process.env.USE_MOCK_OTP === "true" ? "ON  ← OTP prints to console" : "OFF ← Twilio SMS active"}`);
    console.log(`\n📋 Backend API Routes:`);
    console.log(`   GET    http://localhost:${PORT}/health`);
    console.log(`   POST   http://localhost:${PORT}/api/user/send-otp`);
    console.log(`   POST   http://localhost:${PORT}/api/user/verify-otp`);
    console.log(`   GET    http://localhost:${PORT}/api/profile/profile`);
    console.log(`   POST   http://localhost:${PORT}/api/profile/createProfile`);
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start();
