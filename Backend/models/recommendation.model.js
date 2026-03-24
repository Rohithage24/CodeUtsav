import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  feedback: {
    liked: { type: Boolean, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    note: { type: String, default: "" },
    categoryFeeling: { type: String, default: "" },
  },
});

const recommendationSchema = new mongoose.Schema(
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

    mood: String,
    struggle: String,
    note: String,

    books: [bookSchema],
  },
  { timestamps: true }
);

recommendationSchema.index({ userId: 1, day: 1 }, { unique: true });

export default mongoose.model("Recommendation", recommendationSchema);