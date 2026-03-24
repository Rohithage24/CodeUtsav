import React, { useState } from 'react';

export default function Chatbot({ isOpen, onClose }) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  return (
    /* Overlay to dim the background when chat is open */
    <div className="chat-overlay" onClick={onClose}>
      <div className="chatbot-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header with Close Button */}
        <div className="chat-header">
          <div className="ai-status">
            <div className="status-dot"></div>
            <div className="ai-info">
              <h3>BookAI Assistant</h3>
              <span>Online • Celestial Library</span>
            </div>
          </div>
          <button className="close-chat" onClick={onClose}>&times;</button>
        </div>

        {/* Message Area (Large workspace) */}
        <div className="chat-messages">
          <div className="ai-bubble">
            Hello! I'm your celestial librarian. Whats your mood Or what book are you looking for today? I will help you with that.🌟
          </div>
          {/* Messages will map here */}
        </div>

        {/* Search/Input Bar */}
        <form className="chat-input-wrapper" onSubmit={(e) => e.preventDefault()}>
          <div className="search-glass-inner">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="send-btn">✦</button>
          </div>
          <p className="chat-note">AI can make mistakes. Verify important info.</p>
        </form>
      </div>
    </div>
  );
}