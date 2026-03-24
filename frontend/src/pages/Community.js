import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// ─── API base ────────────────────────────────────────────────────────────────
const BASE = "http://localhost:5000/api/community";

// Helper: get token from cookie or localStorage
const getToken = () =>
  localStorage.getItem("token") ||
  document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1") ||
  null;

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ─── POST TYPE CONFIG ────────────────────────────────────────────────────────
const POST_TYPES = [
  { value: "discussion", label: "Discussion",      icon: "💬" },
  { value: "review",     label: "Review",          icon: "⭐" },
  { value: "question",   label: "Question",        icon: "❓" },
  { value: "recommendation", label: "Recommend",   icon: "📚" },
  { value: "help",       label: "Help",            icon: "🙋" },
];

const FILTER_TYPES = [
  { value: "",               label: "All",        icon: "✦" },
  { value: "review",         label: "Reviews",    icon: "⭐" },
  { value: "question",       label: "Questions",  icon: "❓" },
  { value: "recommendation", label: "Recs",       icon: "📚" },
  { value: "discussion",     label: "Discussion", icon: "💬" },
  { value: "help",           label: "Help",       icon: "🙋" },
];

const TYPE_COLORS = {
  review:         { bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.35)",  text: "#c9a84c" },
  question:       { bg: "rgba(94,138,195,0.12)",  border: "rgba(94,138,195,0.35)",  text: "#6ea4e0" },
  recommendation: { bg: "rgba(76,175,80,0.12)",   border: "rgba(76,175,80,0.35)",   text: "#6dbf70" },
  discussion:     { bg: "rgba(220,220,220,0.08)", border: "rgba(220,220,220,0.2)",  text: "#c0bdb8" },
  help:           { bg: "rgba(240,100,80,0.10)",  border: "rgba(240,100,80,0.3)",   text: "#f07060" },
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;500;700&display=swap');

.community-root {
  --bg:        #0e0c09;
  --surface:   #161410;
  --card:      #1c1915;
  --border:    rgba(201,168,76,0.13);
  --gold:      #c9a84c;
  --gold-dim:  rgba(201,168,76,0.55);
  --gold-glow: rgba(201,168,76,0.08);
  --text:      #e8dfc8;
  --muted:     #7a7060;
  --rust:      #9b4a2a;
  --error:     #f07060;
  font-family: 'Syne', sans-serif;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
}

/* ── Feed layout ── */
.community-shell {
  max-width: 820px;
  margin: 0 auto;
  padding: 40px 20px 80px;
}

/* ── Section header ── */
.comm-header {
  text-align: center;
  margin-bottom: 36px;
  position: relative;
}

.comm-header::before {
  content: '';
  position: absolute;
  inset: -60px -100vw;
  background: radial-gradient(ellipse 600px 300px at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%);
  pointer-events: none;
}

.comm-eyebrow {
  font-size: 0.68rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold-dim);
  margin-bottom: 10px;
}

.comm-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px;
  line-height: 1.15;
}

.comm-title em {
  font-style: italic;
  background: linear-gradient(135deg, var(--gold), var(--rust));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.comm-subtitle {
  font-size: 0.78rem;
  color: var(--muted);
  letter-spacing: 0.04em;
}

/* ── Filter tabs ── */
.filter-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 28px;
  padding: 4px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.filter-tab {
  flex: 1;
  min-width: fit-content;
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Syne', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 7px 12px;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  transition: all 0.18s ease;
}

.filter-tab:hover { background: var(--gold-glow); color: var(--text); }

.filter-tab.active {
  background: rgba(201,168,76,0.15);
  color: var(--gold);
  box-shadow: inset 0 0 0 1px rgba(201,168,76,0.3);
}

/* ── Compose box ── */
.compose-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.compose-card:focus-within { border-color: rgba(201,168,76,0.35); }

.compose-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
  opacity: 0.5;
}

.compose-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.compose-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold), var(--rust));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
}

.compose-textarea {
  flex: 1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  color: var(--text);
  font-family: 'Syne', sans-serif;
  font-size: 0.82rem;
  line-height: 1.65;
  padding: 12px 14px;
  resize: none;
  outline: none;
  min-height: 88px;
  width: 100%;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
}

.compose-textarea:focus { border-color: rgba(201,168,76,0.3); }
.compose-textarea::placeholder { color: rgba(255,255,255,0.2); }

.compose-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.compose-select, .compose-mini-input {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  color: var(--text);
  font-family: 'Syne', sans-serif;
  font-size: 0.72rem;
  padding: 7px 10px;
  outline: none;
  transition: border-color 0.2s ease;
}

.compose-select:focus, .compose-mini-input:focus { border-color: rgba(201,168,76,0.3); }
.compose-mini-input { flex: 1; min-width: 120px; }
.compose-mini-input::placeholder { color: rgba(255,255,255,0.2); }

.compose-select option { background: #1c1915; }

.rating-row {
  display: flex;
  gap: 4px;
  align-items: center;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.35;
  transition: opacity 0.15s ease, transform 0.15s ease;
  padding: 2px;
  line-height: 1;
}

.star-btn.active { opacity: 1; }
.star-btn:hover { opacity: 0.8; transform: scale(1.15); }

.compose-submit {
  margin-left: auto;
  background: linear-gradient(135deg, rgba(201,168,76,0.85), rgba(155,74,42,0.85));
  border: none;
  color: #fff;
  font-family: 'Syne', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
  white-space: nowrap;
}

.compose-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.compose-submit:disabled { opacity: 0.35; cursor: not-allowed; }

.compose-error {
  font-size: 0.7rem;
  color: var(--error);
  margin-top: 8px;
  padding: 6px 10px;
  background: rgba(240,112,96,0.08);
  border-radius: 5px;
  border: 1px solid rgba(240,112,96,0.2);
}

/* ── Feed ── */
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Post card ── */
.post-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  animation: card-in 0.38s ease both;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  border-color: rgba(201,168,76,0.25);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

.post-card-top {
  padding: 16px 18px 12px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.post-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a3020, #2a2018);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
  color: var(--gold-dim);
}

.post-author {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.03em;
}

.post-time {
  font-size: 0.65rem;
  color: var(--muted);
  margin-left: auto;
}

.post-type-pill {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 20px;
}

.post-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
  line-height: 1.3;
}

.post-content {
  font-size: 0.8rem;
  color: rgba(232,223,200,0.8);
  line-height: 1.7;
  margin: 0;
}

.post-books {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.book-chip {
  font-size: 0.67rem;
  background: rgba(201,168,76,0.08);
  border: 1px solid rgba(201,168,76,0.2);
  color: var(--gold-dim);
  padding: 3px 9px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.genre-tag {
  font-size: 0.62rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--muted);
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.post-rating {
  display: flex;
  gap: 2px;
  margin-top: 8px;
}

.star-display {
  font-size: 0.85rem;
  opacity: 0.4;
}
.star-display.lit { opacity: 1; }

/* ── Post footer ── */
.post-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px 12px;
  border-top: 1px solid rgba(255,255,255,0.04);
  flex-wrap: wrap;
}

.action-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.07);
  color: var(--muted);
  font-family: 'Syne', sans-serif;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.18s ease;
  line-height: 1;
}

.action-btn:hover { border-color: var(--border); color: var(--text); background: rgba(255,255,255,0.03); }

.action-btn.liked {
  border-color: rgba(240,80,80,0.4);
  color: #f06060;
  background: rgba(240,80,80,0.07);
}

.action-btn.liked:hover { background: rgba(240,80,80,0.12); }

.delete-btn {
  margin-left: auto;
  color: rgba(240,112,96,0.5);
  border-color: rgba(240,112,96,0.15);
}
.delete-btn:hover { color: var(--error); border-color: rgba(240,112,96,0.35); background: rgba(240,112,96,0.06); }

/* ── Comments panel ── */
.comments-panel {
  border-top: 1px solid rgba(255,255,255,0.04);
  background: rgba(0,0,0,0.15);
  padding: 14px 18px;
  animation: panel-in 0.22s ease both;
}

@keyframes panel-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(201,168,76,0.15) transparent;
}

.comments-list::-webkit-scrollbar { width: 3px; }
.comments-list::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.15); border-radius: 2px; }

.comment-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: card-in 0.25s ease both;
}

.comment-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(201,168,76,0.1);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: var(--gold-dim);
  flex-shrink: 0;
}

.comment-body { flex: 1; min-width: 0; }

.comment-author {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--gold-dim);
  margin-bottom: 2px;
}

.comment-text {
  font-size: 0.75rem;
  color: rgba(232,223,200,0.75);
  line-height: 1.55;
}

.comment-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.comment-like-btn {
  background: none;
  border: none;
  font-size: 0.64rem;
  color: var(--muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0;
  transition: color 0.15s ease;
}
.comment-like-btn:hover { color: #f06060; }
.comment-like-btn.liked { color: #f06060; }

.comment-del-btn {
  background: none;
  border: none;
  font-size: 0.62rem;
  color: rgba(240,112,96,0.35);
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;
}
.comment-del-btn:hover { color: var(--error); }

.comment-input-row {
  display: flex;
  gap: 8px;
}

.comment-input {
  flex: 1;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  color: var(--text);
  font-family: 'Syne', sans-serif;
  font-size: 0.73rem;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s ease;
}
.comment-input:focus { border-color: rgba(201,168,76,0.3); }
.comment-input::placeholder { color: rgba(255,255,255,0.18); }

.comment-send-btn {
  background: rgba(201,168,76,0.15);
  border: 1px solid rgba(201,168,76,0.25);
  color: var(--gold);
  font-family: 'Syne', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.18s ease;
  white-space: nowrap;
}
.comment-send-btn:hover:not(:disabled) { background: rgba(201,168,76,0.25); }
.comment-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Load more ── */
.load-more-row {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.load-more-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--gold-dim);
  font-family: 'Syne', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  padding: 10px 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.load-more-btn:hover { background: var(--gold-glow); border-color: rgba(201,168,76,0.3); color: var(--gold); }
.load-more-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── States ── */
.feed-loading, .feed-empty, .feed-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
  color: var(--muted);
  font-size: 0.8rem;
  font-style: italic;
}

.feed-loading-icon {
  font-size: 2.4rem;
  animation: pulse-glow 1.6s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.08); }
}

.feed-empty-icon, .feed-error-icon { font-size: 2.4rem; opacity: 0.4; }
.feed-error { color: rgba(240,112,96,0.7); }

/* ── My-posts toggle ── */
.view-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  align-items: center;
}

.view-toggle-btn {
  background: none;
  border: 1px solid rgba(255,255,255,0.07);
  color: var(--muted);
  font-family: 'Syne', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s ease;
}
.view-toggle-btn.active {
  background: rgba(201,168,76,0.1);
  border-color: rgba(201,168,76,0.3);
  color: var(--gold);
}

.search-input {
  margin-left: auto;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 6px;
  color: var(--text);
  font-family: 'Syne', sans-serif;
  font-size: 0.72rem;
  padding: 6px 12px;
  outline: none;
  width: 180px;
  transition: border-color 0.2s ease;
}
.search-input:focus { border-color: rgba(201,168,76,0.3); }
.search-input::placeholder { color: rgba(255,255,255,0.18); }
`;

// ─── TIME FORMAT ─────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)       return "just now";
  if (diff < 3600)     return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)    return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const initials = (name = "") =>
  name.slice(0, 2).toUpperCase() || "?";

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  return (
    <div className="rating-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`star-btn ${value >= s ? "active" : ""}`}
          onClick={() => onChange(value === s ? null : s)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── SINGLE POST CARD ────────────────────────────────────────────────────────
function PostCard({ post, currentUserId, onDelete, onPostUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [comments,     setComments]     = useState(post.comments || []);
  const [commentInput, setCommentInput] = useState("");
  const [sending,      setSending]      = useState(false);
  const [liked,        setLiked]        = useState(
    post.likes?.includes(currentUserId)
  );
  const [likesCount,   setLikesCount]   = useState(post.likes?.length || 0);
  const [loadingCmt,   setLoadingCmt]   = useState(false);

  const typeStyle = TYPE_COLORS[post.postType] || TYPE_COLORS.discussion;
  const typeInfo  = POST_TYPES.find((t) => t.value === post.postType);

  // Toggle post like
  const handleLike = async () => {
    if (!getToken()) return;
    try {
      const res = await fetch(`${BASE}/post/${post._id}/like`, {
        method: "POST", headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setLiked(json.liked);
        setLikesCount(json.likesCount);
      }
    } catch (e) { console.error(e); }
  };

  // Load comments when expanded
  const handleShowComments = async () => {
    if (!showComments && comments.length === 0 && post.commentsCount > 0) {
      setLoadingCmt(true);
      try {
        const res  = await fetch(`${BASE}/post/${post._id}`);
        const json = await res.json();
        if (json.success) setComments(json.data.comments || []);
      } catch (e) { console.error(e); } finally { setLoadingCmt(false); }
    }
    setShowComments((v) => !v);
  };

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text || !getToken()) return;
    setSending(true);
    try {
      const res  = await fetch(`${BASE}/post/${post._id}/comment`, {
        method:  "POST",
        headers: authHeaders(),
        body:    JSON.stringify({ content: text }),
      });
      const json = await res.json();
      if (json.success) {
        setComments((prev) => [...prev, json.data]);
        setCommentInput("");
      }
    } catch (e) { console.error(e); } finally { setSending(false); }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!getToken()) return;
    try {
      const res  = await fetch(`${BASE}/post/${post._id}/comment/${commentId}`, {
        method: "DELETE", headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success)
        setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (e) { console.error(e); }
  };

  // Like a comment
  const handleCommentLike = async (commentId) => {
    if (!getToken()) return;
    try {
      const res  = await fetch(`${BASE}/post/${post._id}/comment/${commentId}/like`, {
        method: "POST", headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: json.liked
                  ? [...(c.likes || []), currentUserId]
                  : (c.likes || []).filter((id) => id !== currentUserId) }
              : c
          )
        );
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="post-card">
      <div className="post-card-top">
        {/* Meta row */}
        <div className="post-meta">
          <div className="post-avatar">{initials(post.authorName)}</div>
          <div>
            <div className="post-author">{post.authorName || "Anonymous"}</div>
          </div>
          <span
            className="post-type-pill"
            style={{
              background: typeStyle.bg,
              border:     `1px solid ${typeStyle.border}`,
              color:      typeStyle.text,
            }}
          >
            {typeInfo?.icon} {typeInfo?.label || post.postType}
          </span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        {post.title && <h4 className="post-title">{post.title}</h4>}

        {/* Content */}
        <p className="post-content">{post.content}</p>

        {/* Rating (reviews) */}
        {post.postType === "review" && post.rating && (
          <div className="post-rating">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className={`star-display ${post.rating >= s ? "lit" : ""}`}>★</span>
            ))}
          </div>
        )}

        {/* Tagged books */}
        {post.taggedBooks?.length > 0 && (
          <div className="post-books">
            {post.taggedBooks.map((b, i) => (
              <span key={i} className="book-chip">📖 {b.bookTitle}</span>
            ))}
          </div>
        )}

        {/* Genre tags */}
        {post.genreTags?.length > 0 && (
          <div className="post-genres">
            {post.genreTags.map((g, i) => (
              <span key={i} className="genre-tag">{g}</span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="post-footer">
        <button
          className={`action-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"} {likesCount}
        </button>

        <button className="action-btn" onClick={handleShowComments}>
          💬 {comments.length || post.commentsCount || 0}
        </button>

        {/* Delete own post */}
        {currentUserId && String(post.author) === String(currentUserId) && (
          <button className="action-btn delete-btn" onClick={() => onDelete(post._id)}>
            🗑 Delete
          </button>
        )}
      </div>

      {/* Comments panel */}
      {showComments && (
        <div className="comments-panel">
          <div className="comments-list">
            {loadingCmt && (
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.73rem", padding: "12px" }}>
                Loading...
              </div>
            )}
            {comments.map((c) => (
              <div key={c._id} className="comment-item">
                <div className="comment-avatar">{initials(c.authorName)}</div>
                <div className="comment-body">
                  <div className="comment-author">{c.authorName || "Anonymous"}</div>
                  <div className="comment-text">{c.content}</div>
                  <div className="comment-actions">
                    <button
                      className={`comment-like-btn ${c.likes?.includes(currentUserId) ? "liked" : ""}`}
                      onClick={() => handleCommentLike(c._id)}
                    >
                      ♥ {c.likes?.length || 0}
                    </button>
                    {currentUserId && String(c.author) === String(currentUserId) && (
                      <button
                        className="comment-del-btn"
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!loadingCmt && comments.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.73rem", fontStyle: "italic", padding: "8px" }}>
                No comments yet. Be the first!
              </div>
            )}
          </div>

          {/* Add comment */}
          {getToken() ? (
            <form className="comment-input-row" onSubmit={handleAddComment}>
              <input
                className="comment-input"
                placeholder="Add a reply..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={sending}
              />
              <button
                className="comment-send-btn"
                type="submit"
                disabled={sending || !commentInput.trim()}
              >
                {sending ? "..." : "Reply ✦"}
              </button>
            </form>
          ) : (
            <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontStyle: "italic", textAlign: "center" }}>
              Login to reply
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMMUNITY PAGE ──────────────────────────────────────────────────────
export default function Community() {
  // Feed state
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [filterType,  setFilterType]  = useState("");
  const [search,      setSearch]      = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [viewMyPosts, setViewMyPosts] = useState(false);

  // Compose
  const [content,     setContent]     = useState("");
  const [title,       setTitle]       = useState("");
  const [postType,    setPostType]     = useState("discussion");
  const [bookTitle,   setBookTitle]    = useState("");
  const [genreInput,  setGenreInput]   = useState("");
  const [rating,      setRating]       = useState(null);
  const [submitting,  setSubmitting]   = useState(false);
  const [composeErr,  setComposeErr]   = useState("");

  // Current user
  const [currentUserId] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}").id || null; }
    catch { return null; }
  });

  // ── Load feed ──────────────────────────────────────────────────────────────
  const loadFeed = useCallback(async (pg = 1, append = false) => {
    if (pg === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      let url;
      if (viewMyPosts && getToken()) {
        url = `${BASE}/my-posts?page=${pg}&limit=10`;
      } else {
        const params = new URLSearchParams({ page: pg, limit: 10 });
        if (filterType) params.set("postType", filterType);
        if (search)     params.set("search",   search);
        url = `${BASE}/feed?${params}`;
      }

      const res  = await fetch(url, { headers: authHeaders() });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || "Failed to load");

      const newPosts = json.data || [];
      setPosts((prev) => append ? [...prev, ...newPosts] : newPosts);
      setHasMore(pg < (json.totalPages || 1));
      setPage(pg);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filterType, search, viewMyPosts]);

  // Reload on filter / search / view change
  useEffect(() => { loadFeed(1, false); }, [loadFeed]);

  // Debounce search
  const searchTimer = useRef(null);
  const handleSearchInput = (val) => {
    setSearchInput(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(val), 500);
  };

  // ── Submit post ────────────────────────────────────────────────────────────
  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setComposeErr("");

    if (!getToken()) { setComposeErr("You must be logged in to post."); return; }
    if (!content.trim()) { setComposeErr("Content is required."); return; }

    setSubmitting(true);
    try {
      const body = {
        postType,
        content: content.trim(),
        title:   title.trim(),
        genreTags: genreInput.trim()
          ? genreInput.split(",").map((g) => g.trim()).filter(Boolean)
          : [],
        taggedBooks: bookTitle.trim()
          ? [{ bookTitle: bookTitle.trim() }]
          : [],
      };

      if (postType === "review" && rating) body.rating = rating;

      const res  = await fetch(`${BASE}/post`, {
        method:  "POST",
        headers: authHeaders(),
        body:    JSON.stringify(body),
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || "Failed to post");

      // Prepend new post
      setPosts((prev) => [json.data, ...prev]);
      setContent(""); setTitle(""); setBookTitle("");
      setGenreInput(""); setRating(null); setPostType("discussion");
    } catch (err) {
      setComposeErr(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete post ────────────────────────────────────────────────────────────
  const handleDeletePost = async (postId) => {
    if (!getToken()) return;
    try {
      const res  = await fetch(`${BASE}/post/${postId}`, {
        method: "DELETE", headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="community-root home-wrapper">
      <style>{styles}</style>
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="community-shell">

          {/* ── Header ── */}
          <div className="comm-header">
            <p className="comm-eyebrow">✦ The Reading Circle ✦</p>
            <h1 className="comm-title">
              Community <em>POV Feed</em>
            </h1>
            <p className="comm-subtitle">
              Share reviews · ask for picks · help fellow readers
            </p>
          </div>

          {/* ── Filter bar ── */}
          <div className="filter-bar">
            {FILTER_TYPES.map((ft) => (
              <button
                key={ft.value}
                className={`filter-tab ${filterType === ft.value && !viewMyPosts ? "active" : ""}`}
                onClick={() => { setFilterType(ft.value); setViewMyPosts(false); }}
              >
                {ft.icon} {ft.label}
              </button>
            ))}
          </div>

          {/* ── View toggle + search ── */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${!viewMyPosts ? "active" : ""}`}
              onClick={() => setViewMyPosts(false)}
            >
              All Posts
            </button>
            {getToken() && (
              <button
                className={`view-toggle-btn ${viewMyPosts ? "active" : ""}`}
                onClick={() => setViewMyPosts(true)}
              >
                My Posts
              </button>
            )}
            <input
              className="search-input"
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
          </div>

          {/* ── Compose box ── */}
          {getToken() && (
            <form className="compose-card" onSubmit={handleSubmitPost}>
              <div className="compose-top">
                <div className="compose-avatar">✦</div>
                <textarea
                  className="compose-textarea"
                  placeholder="Share your thoughts on a book, ask for suggestions, or help a reader..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="compose-row">
                <select
                  className="compose-select"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                >
                  {POST_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>

                <input
                  className="compose-mini-input"
                  placeholder="Book title (optional)"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                />

                <input
                  className="compose-mini-input"
                  placeholder="Title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  className="compose-mini-input"
                  placeholder="Genres, comma separated"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                />

                {postType === "review" && (
                  <StarRating value={rating} onChange={setRating} />
                )}

                <button
                  type="submit"
                  className="compose-submit"
                  disabled={submitting || !content.trim()}
                >
                  {submitting ? "Posting..." : "Share to Codex ✦"}
                </button>
              </div>

              {composeErr && (
                <div className="compose-error">⚠ {composeErr}</div>
              )}
            </form>
          )}

          {/* ── Feed ── */}
          {loading ? (
            <div className="feed-loading">
              <span className="feed-loading-icon">📚</span>
              <span>Loading the reading circle...</span>
            </div>
          ) : error ? (
            <div className="feed-error">
              <span className="feed-error-icon">⚠</span>
              <span>Could not load posts: {error}</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="feed-empty">
              <span className="feed-empty-icon">🔍</span>
              <span>No posts found. Be the first to share!</span>
            </div>
          ) : (
            <div className="feed-list">
              {posts.map((post, i) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                  onDelete={handleDeletePost}
                  onPostUpdate={(updated) =>
                    setPosts((prev) =>
                      prev.map((p) => (p._id === updated._id ? updated : p))
                    )
                  }
                />
              ))}
            </div>
          )}

          {/* ── Load more ── */}
          {hasMore && !loading && (
            <div className="load-more-row">
              <button
                className="load-more-btn"
                disabled={loadingMore}
                onClick={() => loadFeed(page + 1, true)}
              >
                {loadingMore ? "Loading..." : "Load More ✦"}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}