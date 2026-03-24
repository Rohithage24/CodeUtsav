import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // 1. Import ReactDOM for the Portal

export default function Chatbot({ isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // To track user prompts

  useEffect(() => {
    if (isOpen) {
      // Delay the flip slightly for a sexy opening effect
      const timer = setTimeout(() => setIsFlipped(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
      setRecommendations([]); // Optional: clear on close
    }
  }, [isOpen]);

  const fetchRecommendations = async () => {
    if (!input.trim()) return;

    // Add user message to history
    setChatHistory([...chatHistory, input]);
    const currentInput = input;
    setInput(""); // Clear input early for UX

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/bookRe/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentInput })
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

  // 2. Wrap everything in a Portal so it teleports to the top of <body>
  return ReactDOM.createPortal(
    <div className="chat-overlay" onClick={onClose}>
      <div 
        className={`book-container ${isFlipped ? 'spread-view' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LEFT PAGE (The Results / Back of flipping page) */}
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
                <div className="loading-state">
                  <div className="spinner-sparkle">✨</div>
                  <p>Consulting the Archivist...</p>
                </div>
              ) : recommendations.length > 0 ? (
                recommendations.map((book, i) => (
                  <div key={i} className="rec-item-glass">
                    <div className="rec-info">
                      <p className="rec-title">{book.title}</p>
                      <p className="rec-author">{book.author}</p>
                      <p className="rec-reason">{book.reason}</p>
                    </div>
                    <button className="rec-add">Add</button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Your next journey will appear here once you share your mood.</p>
                </div>
              )}
            </div>
            <div className="page-footer">Page 01 • Manifestations</div>
          </div>
        </div>

        {/* RIGHT PAGE (The Chat Interface) */}
        <div className="chatbot-page">
          <div className="chat-header">
            <div className="ai-status">
              <div className="status-dot"></div>
              <h3>AI Librarian</h3>
            </div>
            <button className="close-chat-btn" onClick={onClose}>&times;</button>
          </div>

          <div className="chat-messages">
            <div className="ai-bubble">
              Hello! Tell me how you're feeling or what themes you're looking for. I’ll manifest books to match your energy.
            </div>
            
            {/* Show user's recent prompts */}
            {chatHistory.map((msg, index) => (
              <div key={index} className="user-bubble">
                {msg}
              </div>
            ))}
          </div>

          <form 
            className="chat-input-wrapper" 
            onSubmit={(e) => {
              e.preventDefault();
              fetchRecommendations();
            }}
          >
            <div className="search-glass-inner">
              <input 
                type="text" 
                placeholder="Ex: I'm feeling adventurous..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="send-btn">✦</button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body // Teleport destination
  );
}