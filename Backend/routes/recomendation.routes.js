// routes/recomendation.routes.js

import express from "express";
import {
  saveDailyEmotion,
  getTodayEmotion,
  updateBookFeedback,
  getWhatNextRecommendation
} from "../Controller/userEmo.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ FIX: all emotion routes need auth

const router = express.Router();

// 🔹 First visit  → returns questions
// 🔹 Second visit → returns emotion + book recommendations
router.post("/today", authMiddleware, getTodayEmotion); // ✅ FIX: was commented out

// 🔹 Save daily emotion + generate book recommendations via OpenAI
router.post("/save", authMiddleware, saveDailyEmotion);

// 🔹 Submit feedback on a recommended book
router.post("/feedback", authMiddleware, updateBookFeedback);

// routes
router.post("/whatnext", getWhatNextRecommendation);

export default router;