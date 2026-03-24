import React, { useState, useEffect } from 'react';

export default function Chatbot({ isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsFlipped(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [isOpen]);

  // 🔥 API CALL FUNCTION
  const fetchRecommendations = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/bookRe/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: input })
      });

      const data = await res.json();

      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className={`book-container ${isFlipped ? 'spread-view' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* LEFT PAGE */}
        <div className={`flipping-page ${isFlipped ? 'flipped' : ''}`}>
          
          <div className="page-front">
            <div className="page-content">
              <span className="pulsing-icon">📖</span>
              <p>Unbinding Codex...</p>
            </div>
          </div>

          <div className="page-back">
            <div className="rec-header">
              <h4>Recommended <span className="text-gradient">Reads</span></h4>
            </div>

            <div className="rec-list">
              {loading ? (
                <p>Loading recommendations...</p>
              ) : recommendations.length > 0 ? (
                recommendations.map((book, i) => (
                  <div key={i} className="rec-item-glass">
                    <div className="rec-info">
                      <p className="rec-title">{book.title}</p>
                      <p className="rec-author">{book.author}</p>
                      <p className="rec-reason">{book.reason}</p>
                    </div>
                    <button className="rec-add">+</button>
                  </div>
                ))
              ) : (
                <p>No recommendations yet</p>
              )}
            </div>

            <div className="page-footer">Page 01 • Suggestions</div>
          </div>
        </div>

        {/* RIGHT PAGE (CHATBOT) */}
        <div className="chatbot-page">
          <div className="chat-header">
            <div className="ai-status">
              <div className="status-dot"></div>
              <h3>AI Librarian</h3>
            </div>
            <button className="close-chat" onClick={onClose}>&times;</button>
          </div>

          <div className="chat-messages">
            <div className="ai-bubble">
              Hello!  
              What's your mood today or what do you want to read?  
              I’ll suggest books based on your mood.
            </div>
          </div>

          <form 
            className="chat-input-wrapper" 
            onSubmit={(e) => {
              e.preventDefault();
              fetchRecommendations(); // 🔥 call API on submit
            }}
          >
            <div className="search-glass-inner">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="send-btn">✦</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}