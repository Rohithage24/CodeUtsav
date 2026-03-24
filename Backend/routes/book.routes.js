// routes/book.routes.js

import express from "express";
import {
  addBook,
  addBulkBooks,
  getAllBooks,
  getBookById,
  getBooksByTags,
  updateBook,
  deleteBook,
} from "../Controller/book.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/all",      getAllBooks);       // GET  /api/books/all
router.get("/by-tags",  getBooksByTags);    // GET  /api/books/by-tags?emotion_tags=stress,fear
router.get("/:id",      getBookById);       // GET  /api/books/:id

// ── Protected ─────────────────────────────────────────────────────────────────
router.post("/add",     authMiddleware, addBook);       // POST  /api/books/add
router.post("/bulk",    authMiddleware, addBulkBooks);  // POST  /api/books/bulk
router.patch("/:id",    authMiddleware, updateBook);    // PATCH /api/books/:id
router.delete("/:id",   authMiddleware, deleteBook);    // DELETE /api/books/:id

export default router;