// models/book.model.js

import mongoose from 'mongoose'

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      trim: true,
      default: null
    },

    genre: {
      type: [String], // e.g. ["self-help", "fiction"]
      default: []
    },

    emotion_tags: {
      type: [String], // e.g. ["stress", "fear", "sad"]
      default: []
    },

    intent_tags: {
      type: [String], // e.g. ["education", "self_improvement"]
      default: []
    },

    description: {
      type: String,
      trim: true,
      default: ''
    },
    reviews: {
      type: [String], // e.g. ["education", "self_improvement"]
      default: []
    },
    coverImage: {
      type: String, // URL or cloudinary link
      default: null
    },

    isActive: {
      type: Boolean,
      default: true // soft delete support
    }
  },
  { timestamps: true }
)

// Index for fast tag-based queries (used by AI recommendation lookup)
bookSchema.index({ emotion_tags: 1 })
bookSchema.index({ intent_tags: 1 })
bookSchema.index({ genre: 1 })

const Book = mongoose.model('Book', bookSchema)

export default Book
