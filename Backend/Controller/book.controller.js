// Controller/book.controller.js

import Book from "../models/book.model.js";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/books/add
// Add a single book
// Body: { title, author, genre, emotion_tags, intent_tags, description, coverImage }
// ─────────────────────────────────────────────────────────────────────────────
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, emotion_tags, intent_tags, description, coverImage } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "title is required" });
    }

    const book = await Book.create({
      title,
      author,
      genre:        genre        || [],
      emotion_tags: emotion_tags || [],
      intent_tags:  intent_tags  || [],
      description,
      coverImage,
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      data:    book,
    });
  } catch (err) {
    console.error("addBook error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/books/bulk
// Add multiple books at once
// Body: [ { title, ... }, { title, ... } ]
// ─────────────────────────────────────────────────────────────────────────────
export const addBulkBooks = async (req, res) => {
  try {
    const books = req.body;
    console.log(books);
    

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({ success: false, message: "Send an array of books" });
    }

    const inserted = await Book.insertMany(books, { ordered: false }); // ordered:false → continue on duplicate

    return res.status(201).json({
      success: true,
      message: `${inserted.length} books added`,
      data:    inserted,
    });
  } catch (err) {
    console.error("addBulkBooks error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/books/all
// Get all active books (supports optional filter query params)
// Query: ?genre=self-help  OR  ?emotion_tags=stress  OR  ?intent_tags=education
// ─────────────────────────────────────────────────────────────────────────────
export const getAllBooks = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.genre)        filter.genre        = req.query.genre;
    if (req.query.emotion_tags) filter.emotion_tags = req.query.emotion_tags;
    if (req.query.intent_tags)  filter.intent_tags  = req.query.intent_tags;

    const books = await Book.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   books.length,
      data:    books,
    });
  } catch (err) {
    console.error("getAllBooks error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/books/:id
// Get a single book by ID
// ─────────────────────────────────────────────────────────────────────────────
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book || !book.isActive) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    return res.status(200).json({ success: true, data: book });
  } catch (err) {
    console.error("getBookById error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/books/by-tags
// Find books matching emotion_tags OR intent_tags (used by recommendation engine)
// Query: ?emotion_tags=stress,fear&intent_tags=education
// ─────────────────────────────────────────────────────────────────────────────
export const getBooksByTags = async (req, res) => {
  try {
    const emotionList = req.query.emotion_tags
      ? req.query.emotion_tags.split(",").map((t) => t.trim())
      : [];

    const intentList = req.query.intent_tags
      ? req.query.intent_tags.split(",").map((t) => t.trim())
      : [];

    if (emotionList.length === 0 && intentList.length === 0) {
      return res.status(400).json({ success: false, message: "Provide at least one tag" });
    }

    const orConditions = [];
    if (emotionList.length > 0) orConditions.push({ emotion_tags: { $in: emotionList } });
    if (intentList.length  > 0) orConditions.push({ intent_tags:  { $in: intentList  } });

    const books = await Book.find({ isActive: true, $or: orConditions }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   books.length,
      data:    books,
    });
  } catch (err) {
    console.error("getBooksByTags error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/books/:id
// Update a book
// Body: any fields to update
// ─────────────────────────────────────────────────────────────────────────────
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Book updated",
      data:    book,
    });
  } catch (err) {
    console.error("updateBook error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/books/:id
// Soft delete — sets isActive: false
// ─────────────────────────────────────────────────────────────────────────────
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    return res.status(200).json({ success: true, message: "Book deleted" });
  } catch (err) {
    console.error("deleteBook error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};