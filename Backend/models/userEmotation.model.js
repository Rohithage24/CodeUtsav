// models/userEmotation.model.js

import mongoose from "mongoose"; // ✅ FIX 1: was wrongly importing express instead of mongoose

const userEmotionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

    mood: {
      type: String,
      enum: ["happy", "sad", "angry", "excited", "relaxed", "bored"],
      required: true,
    },

    Question: {               // ✅ FIX 2: kept as-is to match your req.body field name
      type: String,
      required: false,        // ✅ FIX 3: changed to false — it was crashing saves without it
    },

    struggle: {
      type: String,
      required: true,
    },

    note: {
      type: String,
    },
  },
  { timestamps: true }
);

userEmotionSchema.index({ userId: 1, day: 1 }, { unique: true });

const userEmotionMOdel = mongoose.model("UserEmotion", userEmotionSchema);

export default userEmotionMOdel;