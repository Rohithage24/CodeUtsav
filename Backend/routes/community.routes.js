// routes/community.routes.js
// Book community — WhatsApp-channel-style posts, reviews, Q&A, recommendations

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  toggleCommentLike,
  getBookReviews,
  askCommunity,
  getCommunityRecommendations,
  getMyPosts,
} from "../Controller/community.controller.js";

const router = express.Router();

// ── Feed & Discovery (Public) ─────────────────────────────────────────────────
// GET /api/community/feed?page=1&limit=20&postType=review&genre=fiction&search=atomic
router.get("/feed",            getFeed);

// GET /api/community/reviews/:bookTitle?page=1
router.get("/reviews/:bookTitle", getBookReviews);

// GET /api/community/ask?genre=thriller&q=what+to+read
router.get("/ask",             askCommunity);

// GET /api/community/recommendations?genre=self-help
router.get("/recommendations", getCommunityRecommendations);

// GET /api/community/post/:id  (single post with full comments)
router.get("/post/:id",        getPostById);

// ── My Posts (Protected) ──────────────────────────────────────────────────────
// GET /api/community/my-posts
router.get("/my-posts",        authMiddleware, getMyPosts);

// ── Post CRUD (Protected) ─────────────────────────────────────────────────────
// POST /api/community/post
router.post("/post",           authMiddleware, createPost);

// PATCH /api/community/post/:id
router.patch("/post/:id",      authMiddleware, updatePost);

// DELETE /api/community/post/:id
router.delete("/post/:id",     authMiddleware, deletePost);

// ── Likes (Protected) ─────────────────────────────────────────────────────────
// POST /api/community/post/:id/like
router.post("/post/:id/like",  authMiddleware, toggleLike);

// ── Comments (Protected) ──────────────────────────────────────────────────────
// POST /api/community/post/:id/comment
router.post("/post/:id/comment",                        authMiddleware, addComment);

// DELETE /api/community/post/:id/comment/:commentId
router.delete("/post/:id/comment/:commentId",           authMiddleware, deleteComment);

// POST /api/community/post/:id/comment/:commentId/like
router.post("/post/:id/comment/:commentId/like",        authMiddleware, toggleCommentLike);

export default router;