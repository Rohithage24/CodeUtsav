// import React, { useState, useEffect } from 'react';

// export default function Chatbot({ isOpen, onClose }) {
//   const [isRevealed, setIsRevealed] = useState(false);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     if (isOpen) {
//       // Trigger the "Flip" animation
//       setIsRevealed(false);
//       const timer = setTimeout(() => setIsRevealed(true), 600); // Reveal UI after flip
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="chat-overlay" onClick={onClose}>
//       <div className="chatbot-wrapper" onClick={(e) => e.stopPropagation()}>
        
//         {/* THE ANIMATED PAGE (The "Reveal" Layer) */}
//         {!isRevealed && <div className="magic-page-flip"></div>}

//         {/* THE ACTUAL CHATBOT UI */}
//         <div className={`chatbot-drawer ${isRevealed ? 'show-ui' : 'hide-ui'}`}>
//           <div className="chat-header">
//             <div className="ai-status">
//               <div className="status-dot"></div>
//               <h3>Celestial Codex</h3>
//             </div>
//             <button className="close-chat" onClick={onClose}>&times;</button>
//           </div>

//           <div className="chat-messages">
//             <div className="ai-bubble">
//               The ink is dry, the secrets are yours. How shall we begin?
//             </div>
//           </div>

//           <form className="chat-input-wrapper" onSubmit={(e) => e.preventDefault()}>
//             <div className="search-glass-inner">
//               <input 
//                 type="text" 
//                 placeholder="Consult the AI..." 
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//               />
//               <button type="submit" className="send-btn">✦</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';

// export default function Chatbot({ isOpen, onClose }) {
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     if (isOpen) {
//       // Small delay to start the flip animation after the component mounts
//       const timer = setTimeout(() => setIsFlipped(true), 100);
//       return () => clearTimeout(timer);
//     } else {
//       setIsFlipped(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="chat-overlay" onClick={onClose}>
//       <div className="book-container" onClick={(e) => e.stopPropagation()}>
        
//         {/* THE PAGE THAT FLIPS */}
//         <div className={`flipping-page ${isFlipped ? 'flipped' : ''}`}>
//           <div className="page-front">
//             <div className="page-content">
//               <span>📖</span>
//               <p>Opening the Codex...</p>
//             </div>
//           </div>
//           <div className="page-back"></div>
//         </div>

//         {/* THE STATIONARY PAGE (The Chatbot) */}
//         <div className="chatbot-page">
//           <div className="chat-header">
//             <div className="ai-status">
//               <div className="status-dot"></div>
//               <h3>Celestial Assistant</h3>
//             </div>
//             <button className="close-chat" onClick={onClose}>&times;</button>
//           </div>

//           <div className="chat-messages">
//             <div className="ai-bubble">
//               *The page turns...* <br/>
//               The archive is ready. What do you wish to find?
//             </div>
//           </div>

//           <form className="chat-input-wrapper" onSubmit={(e) => e.preventDefault()}>
//             <div className="search-glass-inner">
//               <input 
//                 type="text" 
//                 placeholder="Search the book..." 
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 autoFocus
//               />
//               <button type="submit" className="send-btn">✦</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';

export default function Chatbot({ isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [input, setInput] = useState("");

  // Mock recommendations (These would come from your backend)
  const recommendations = [
    { title: "The Midnight Library", author: "Matt Haig" },
    { title: "Project Hail Mary", author: "Andy Weir" },
    { title: "Klara and the Sun", author: "Kazuo Ishiguro" }
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsFlipped(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div className={`book-container ${isFlipped ? 'spread-view' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* THE TURNING PAGE */}
        <div className={`flipping-page ${isFlipped ? 'flipped' : ''}`}>
          {/* Front (Visible while opening) */}
          <div className="page-front">
            <div className="page-content">
              <span className="pulsing-icon">📖</span>
              <p>Unbinding Codex...</p>
            </div>
          </div>

          {/* Back (Visible after flip - LEFT SIDE) */}
          <div className="page-back">
            <div className="rec-header">
              <h4>Recommended <span className="text-gradient">Reads</span></h4>
            </div>
            <div className="rec-list">
              {recommendations.map((book, i) => (
                <div key={i} className="rec-item-glass">
                  <div className="rec-info">
                    <p className="rec-title">{book.title}</p>
                    <p className="rec-author">{book.author}</p>
                  </div>
                  <button className="rec-add">+</button>
                </div>
              ))}
            </div>
            <div className="page-footer">Page 01 • Suggestions</div>
          </div>
        </div>

        {/* THE STATIONARY PAGE (The Chatbot - RIGHT SIDE) */}
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
              Hello.! 
              Whats your mood today Or what you want to read?
              I will suggest you some books based on your mood and interest.
            </div>
          </div>

          <form className="chat-input-wrapper" onSubmit={(e) => e.preventDefault()}>
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