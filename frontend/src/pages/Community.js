import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function Community() {
  const [userPov, setUserPov] = useState("");

  // Static Data: Old Community Chats/POVs
  const communityPosts = [
    {
      user: "Astrid_Read",
      book: "The Alchemist",
      pov: "It’s more than just a story; it's a manual for listening to your heart. If you're feeling lost in your career, this is the sign you need.",
      tags: ["Life-Changing", "Short Read"],
      likes: 124
    },
    {
      user: "LogicLover",
      book: "Atomic Habits",
      pov: "The '2-minute rule' changed how I view my morning routine. If you struggle with consistency, start here instead of Deep Work.",
      tags: ["Productivity", "Practical"],
      likes: 89
    },
    {
      user: "ZenMaster",
      book: "The Power of Now",
      pov: "A bit heavy for beginners, but the concept of 'inner body' awareness is gold for anxiety. Read it slowly.",
      tags: ["Spiritual", "Mindfulness"],
      likes: 56
    }
  ];

  return (
    <div className="home-wrapper">
      <Navbar />
      <Sidebar />
      
      <main className="main-content">
        <section className="content-section sparkle-bg">
          <div className="dynamic-glow"></div>
          
          <div className="section-header">
            <span className="line"></span>
            <h2 className="section-title">Community <span className="text-gradient">POV Feed</span></h2>
            <span className="line"></span>
          </div>

          {/* SHARE YOUR POV BOX */}
          <div className="share-pov-container">
            <div className="glass-card pov-input-box">
              <div className="user-avatar-small">✨</div>
              <textarea 
                placeholder="Share your POV on a book or ask for a suggestion..."
                value={userPov}
                onChange={(e) => setUserPov(e.target.value)}
              />
              <div className="pov-actions">
                <input type="text" placeholder="Book Title..." className="mini-input" />
                <button className="post-btn">Share to Codex ✦</button>
              </div>
            </div>
          </div>

          {/* COMMUNITY POSTS FEED */}
          <div className="community-feed">
            {communityPosts.map((post, i) => (
              <div key={i} className="pov-card-glass reveal-item" style={{ "--delay": `${i * 0.1}s` }}>
                <div className="pov-card-header">
                  <div className="user-info">
                    <span className="user-icon">👤</span>
                    <span className="user-name">{post.user}</span>
                  </div>
                  <div className="post-tags">
                    {post.tags.map((tag, j) => (
                      <span key={j} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pov-content">
                  <h4>{post.book}</h4>
                  <p>"{post.pov}"</p>
                </div>

                <div className="pov-footer">
                  <div className="interaction">
                    <button className="like-btn">❤️ {post.likes}</button>
                    <button className="reply-btn">💬 Reply</button>
                  </div>
                  <button className="add-to-shelf">Add to Wishlist +</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}