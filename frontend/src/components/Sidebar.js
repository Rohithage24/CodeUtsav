import React, { useState } from 'react';
import Chatbot from './Chatbot'; // Ensure the path to your Chatbot file is correct

function Sidebar() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const menuItems = [
    { icon: "🏠", label: "Community", active: true },
    { icon: "🤖", label: "AI Chatbot", active: false },
  ];

  return (
    <>
      <aside className="sidebar-glass">
        <div className="sidebar-nav">
          {menuItems.map((item, i) => (
            <a 
              key={i} 
              href="#" 
              className={`sidebar-link ${item.active ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                // If the icon is the Robot, open the chatbot
                if (item.label === "AI Chatbot") setIsChatOpen(true);
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              {item.active && <div className="active-indicator"></div>}
            </a>
          ))}
        </div>
      </aside>

      {/* The Chatbot Drawer - Only appears when isChatOpen is true */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

export default Sidebar;