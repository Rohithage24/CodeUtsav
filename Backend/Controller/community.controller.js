// Controller/community.controller.js
// WhatsApp-channel-style community for book reviews, questions, recommendations

import CommunityPost from "../models/community.model.js";
import Profile from "../models/user.model.js";

// ── Helper: get display name for a user ──────────────────────────────────────
const getAuthorName = async (userId) => {
  try {
    const profile = await Profile.findOne({ authID: userId }).select("name");
    return profile?.name || "Anonymous";
  } catch {
    return "Anonymous";
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/community/post
// Create a new community post (review, question, recommendation, discussion)
// Body: { postType, title, content, taggedBooks, genreTags, rating }
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const createPost = async (req, res) => {
  try {
    const { postType, title, content, taggedBooks, genreTags, rating } = req.body;
    const userId = req.user._id;

    if (!content || String(content).trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Content is required (minimum 3 characters)",
      });
    }

    // Only allow rating on review posts
    if (rating !== undefined && postType !== "review") {
      return res.status(400).json({
        success: false,
        message: "Rating is only allowed on review posts",
      });
    }

    const authorName = await getAuthorName(userId);

    const post = await CommunityPost.create({
      author: userId,
      authorName,
      postType: postType || "discussion",
      title: title || "",
      content: String(content).trim(),
      taggedBooks: taggedBooks || [],
      genreTags: genreTags || [],
      rating: postType === "review" ? rating : null,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    console.error("createPost error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/feed
// Get all community posts (paginated, newest first, pinned on top)
// Query: ?page=1&limit=20&postType=review&genre=fiction
// Public
// ─────────────────────────────────────────────────────────────────────────────
export const getFeed = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const filter = { isActive: true };

    if (req.query.postType) filter.postType = req.query.postType;
    if (req.query.genre)    filter.genreTags = req.query.genre;

    // Search in title or content
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-comments") // Don't load full comments in feed
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    // Append comment count to each post
    const postsWithCount = posts.map((p) => ({
      ...p,
      likesCount:    p.likes?.length || 0,
      commentsCount: 0, // no comments loaded in feed
    }));

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: postsWithCount,
    });
  } catch (err) {
    console.error("getFeed error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/post/:id
// Get a single post with full comments
// Public
// ─────────────────────────────────────────────────────────────────────────────
export const getPostById = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...post.toObject(),
        likesCount:    post.likes.length,
        commentsCount: post.comments.length,
      },
    });
  } catch (err) {
    console.error("getPostById error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/community/post/:id
// Edit your own post (content, title, genreTags only)
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts",
      });
    }

    const { title, content, genreTags } = req.body;

    if (content !== undefined) {
      if (String(content).trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Content must be at least 3 characters",
        });
      }
      post.content = String(content).trim();
    }

    if (title     !== undefined) post.title     = String(title).trim();
    if (genreTags !== undefined) post.genreTags  = genreTags;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated",
      data: post,
    });
  } catch (err) {
    console.error("updatePost error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/community/post/:id
// Soft-delete your own post
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const deletePost = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    post.isActive = false;
    await post.save();

    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error("deletePost error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/community/post/:id/like
// Toggle like on a post
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const userId   = req.user._id;
    const alreadyLiked = post.likes.some(
      (id) => String(id) === String(userId)
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Post liked",
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error("toggleLike error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/community/post/:id/comment
// Add a comment to a post
// Body: { content }
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || String(content).trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const authorName = await getAuthorName(userId);

    post.comments.push({
      author: userId,
      authorName,
      content: String(content).trim(),
      likes: [],
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];

    return res.status(201).json({
      success: true,
      message: "Comment added",
      data: newComment,
      commentsCount: post.comments.length,
    });
  } catch (err) {
    console.error("addComment error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/community/post/:id/comment/:commentId
// Delete your own comment
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const deleteComment = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (String(comment.author) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    comment.deleteOne();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted",
      commentsCount: post.comments.length,
    });
  } catch (err) {
    console.error("deleteComment error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/community/post/:id/comment/:commentId/like
// Toggle like on a comment
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const toggleCommentLike = async (req, res) => {
  try {
    const post = await CommunityPost.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const userId = req.user._id;
    const alreadyLiked = comment.likes.some(
      (id) => String(id) === String(userId)
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id) => String(id) !== String(userId));
    } else {
      comment.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Comment liked",
      likesCount: comment.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error("toggleCommentLike error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/reviews/:bookTitle
// Get all reviews for a specific book title (case-insensitive)
// Public
// ─────────────────────────────────────────────────────────────────────────────
export const getBookReviews = async (req, res) => {
  try {
    const { bookTitle } = req.params;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = {
      isActive:  true,
      postType:  "review",
      "taggedBooks.bookTitle": new RegExp(bookTitle, "i"),
    };

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    // Calculate average rating
    const allRated = posts.filter((p) => p.rating !== null);
    const avgRating =
      allRated.length > 0
        ? (allRated.reduce((sum, p) => sum + p.rating, 0) / allRated.length).toFixed(1)
        : null;

    return res.status(200).json({
      success: true,
      bookTitle,
      avgRating: avgRating ? parseFloat(avgRating) : null,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    console.error("getBookReviews error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/ask?genre=thriller&q=what+to+read
// Community help — fetch posts of type "help" or "question" that match genre
// Public
// ─────────────────────────────────────────────────────────────────────────────
export const askCommunity = async (req, res) => {
  try {
    const { genre, q } = req.query;

    const filter = {
      isActive: true,
      postType: { $in: ["help", "question"] },
    };

    if (genre) filter.genreTags = genre;

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const posts = await CommunityPost.find(filter)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    console.error("askCommunity error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/recommendations
// Get all community recommendation posts
// Public
// ─────────────────────────────────────────────────────────────────────────────
export const getCommunityRecommendations = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const filter = { isActive: true, postType: "recommendation" };
    if (req.query.genre) filter.genreTags = req.query.genre;

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .sort({ likes: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: posts.map((p) => ({ ...p, likesCount: p.likes?.length || 0 })),
    });
  } catch (err) {
    console.error("getCommunityRecommendations error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/community/my-posts
// Get all posts by the logged-in user
// Protected
// ─────────────────────────────────────────────────────────────────────────────
export const getMyPosts = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const filter = { isActive: true, author: req.user._id };

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (err) {
    console.error("getMyPosts error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};