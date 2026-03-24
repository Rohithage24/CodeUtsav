// models/community.model.js
// WhatsApp-channel-style community posts for book discussions

import mongoose from "mongoose";

// ── Sub-schema: Comment ───────────────────────────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },
    authorName: {
      type: String,
      default: "Anonymous",
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
      },
    ],
  },
  { timestamps: true }
);

// ── Sub-schema: BookTag (for tagging a specific book in a post) ───────────────
const bookTagSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    default: null,
  },
  bookTitle: {
    type: String,
    trim: true,
  },
});

// ── Main Community Post Schema ────────────────────────────────────────────────
const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },
    authorName: {
      type: String,
      default: "Anonymous",
    },

    // Type of post
    postType: {
      type: String,
      enum: ["review", "question", "recommendation", "discussion", "help"],
      default: "discussion",
    },

    // Main content / message
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [3000, "Post cannot exceed 3000 characters"],
    },

    // Optional: title for reviews or questions
    title: {
      type: String,
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      default: "",
    },

    // Books tagged in this post (for reviews or recommendations)
    taggedBooks: [bookTagSchema],

    // Genre tags the user is asking/talking about
    genreTags: {
      type: [String],
      default: [],
    },

    // Rating (only applicable for review posts, 1-5)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Likes (who liked this post)
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthUser",
      },
    ],

    // Comments thread
    comments: [commentSchema],

    // Is this post pinned by a moderator?
    isPinned: {
      type: Boolean,
      default: false,
    },

    // Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for fast queries
communityPostSchema.index({ postType: 1, createdAt: -1 });
communityPostSchema.index({ genreTags: 1 });
communityPostSchema.index({ author: 1 });
communityPostSchema.index({ isPinned: -1, createdAt: -1 });

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);

export default CommunityPost;