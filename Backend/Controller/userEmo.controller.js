// Controller/userEmo.controller.js

import userEmotionMOdel from "../models/userEmotation.model.js";
import AuthUser from "../models/auth.model.js";
import Recommendation from "../models/recommendation.model.js";

import { GoogleGenAI } from "@google/genai";
const getToday = () => new Date().toISOString().split("T")[0];

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getBooksByMood = async (mood, struggle, note, question, answer) => {
  try {
    const prompt = `
You are a compassionate book recommendation assistant.
A user answered these daily check-in questions:
- Question: "${question}"
- Their answer: "${answer}"
- Their mood today: "${mood}"
- Struggle they faced: "${struggle}"
- Extra note: "${note || "none"}"

Respond ONLY as a valid JSON array. No explanation, no markdown.
to recormend the 3 or 4 book 
[
  { "name": "Book Title", "reason": "One sentence why this fits the user" }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Or "gemini-1.5-pro"
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // This ensures the model outputs valid JSON
        response_mime_type: "application/json" 
      }
    });

    const raw = response.text;
    const parsed = JSON.parse(raw);

    return parsed.map((b) => ({
      name: b.name,
      feedback: { liked: null, rating: null, note: "", categoryFeeling: "" },
    }));
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return [
      { name: "Atomic Habits", feedback: { liked: null, rating: null, note: "", categoryFeeling: "" } },
      // ... rest of your fallbacks
    ];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/emotion/save
// Body: { mood, struggle, note, Question }
// Called when user submits the first-visit form
// ─────────────────────────────────────────────────────────────────────────────
export const saveDailyEmotion = async (req, res) => {
  try {
    const { mood, struggle, note, Question } = req.body; // ✅ FIX: Question matches model field name
    const userId = req.user._id;                         // ✅ FIX: use _id (authMiddleware sets req.user as full doc)
    const today  = getToday();

    // ── Validate user ────────────────────────────────────────────────────────
    const user = await AuthUser.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ── Reset dayVisit on new day, then mark visited today ───────────────────
    if (user.lastVisitDate !== today) {
      user.dayVisit      = false;
      user.lastVisitDate = today;
    }
    user.dayVisit = true;
    await user.save();

    // ── Save / update today's emotion ────────────────────────────────────────
    const emotionData = await userEmotionMOdel.findOneAndUpdate(
      { userId, day: today },
      { $set: { userId, day: today, mood, struggle, note, Question } },
      { new: true, upsert: true }
    );

    // ── Generate books via OpenAI ────────────────────────────────────────────
    const books = await getBooksByMood(mood, struggle, note, Question);

    // ── Save recommendation for today ────────────────────────────────────────
    const recommendation = await Recommendation.findOneAndUpdate(
      { userId, day: today },
      { $set: { userId, day: today, mood, struggle, note, books } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success:         true,
      message:         "Emotion saved for today",
      emotion:         emotionData,
      recommendations: recommendation.books,
    });
  } catch (err) {
    console.error("saveDailyEmotion error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/emotion/today
// First visit  → askQuestions: true  (no emotion saved yet today)
// Second visit → askQuestions: false + emotion + book recommendations from DB
// ─────────────────────────────────────────────────────────────────────────────
export const getTodayEmotion = async (req, res) => {
  try {
    const {userId} = req.body; // ✅ FIX: use _id
    console.log(userId);
    
    const today  = getToday();

    // ── Validate user ────────────────────────────────────────────────────────
    const user = await AuthUser.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ── Reset dayVisit on new day ────────────────────────────────────────────
    if (user.lastVisitDate !== today) {
      user.dayVisit      = false;
      user.lastVisitDate = today;
      await user.save();
    }

    // ── Check if emotion already saved today ─────────────────────────────────
    const emotionData = await userEmotionMOdel.findOne({ userId, day: today });

    // 🟡 FIRST VISIT → ask questions
    if (!emotionData) {
      return res.status(200).json({
        success:        true,
        firstVisitToday: true,
        askQuestions:    true,
        questions: [
          { id: "Question", text: "How was your day today?" },
          { id: "struggle", text: "What kind of struggle did you face?" },
        ],
      });
    }

    // 🟢 SECOND VISIT → return saved emotion + books from DB (no OpenAI call)
    const recommendation = await Recommendation.findOne({ userId, day: today });

    return res.status(200).json({
      success:         true,
      firstVisitToday: false,
      askQuestions:    false,

      user: { userId: user._id },

      emotion: {
        mood:     emotionData.mood,
        struggle: emotionData.struggle,
        note:     emotionData.note,
        Question: emotionData.Question,
      },

      recommendations: recommendation ? recommendation.books : [],
    });
  } catch (err) {
    console.error("getTodayEmotion error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/emotion/feedback
// Body: { bookName, liked, rating, note, categoryFeeling }
// Updates feedback on a specific book inside today's Recommendation doc
// ─────────────────────────────────────────────────────────────────────────────
export const updateBookFeedback = async (req, res) => {
  try {
    const { bookName, liked, rating, note, categoryFeeling } = req.body;
    const userId = req.user._id; // ✅ FIX: use _id
    const today  = getToday();

    if (!bookName) {
      return res.status(400).json({ success: false, message: "bookName is required" });
    }

    // ── Find today's recommendation doc ──────────────────────────────────────
    const recommendation = await Recommendation.findOne({ userId, day: today });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: "No recommendation found for today",
      });
    }

    // ── Find the book inside the books array ──────────────────────────────────
    const book = recommendation.books.find(
      (b) => b.name.toLowerCase() === bookName.toLowerCase()
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book "${bookName}" not found in today's recommendations`,
      });
    }

    // ── Update only the provided feedback fields ──────────────────────────────
    if (liked           !== undefined) book.feedback.liked           = liked;
    if (rating          !== undefined) book.feedback.rating          = rating;
    if (note            !== undefined) book.feedback.note            = note;
    if (categoryFeeling !== undefined) book.feedback.categoryFeeling = categoryFeeling;

    await recommendation.save();

    return res.status(200).json({
      success:  true,
      message:  "Feedback updated",
      book:     book,
    });
  } catch (err) {
    console.error("updateBookFeedback error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


// NEW: WhatNext Recommendation Controller
export const getWhatNextRecommendation = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ success: false, message: "Input is required" });
    }

    const prompt = `User likes these books/themes: "${input}". 
Recommend 1 perfect book. Return ONLY a JSON object with this exact structure: 
{ "title": "Book Title", "author": "Author Name", "reason": "Short explanation why", "vibe": "One word vibe" }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        response_mime_type: "application/json"
      }
    });

    const raw = response.text;
    const parsed = JSON.parse(raw);

    return res.status(200).json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error("Gemini Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get recommendation"
    });
  }
};