import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Chatbot from './Chatbot'; 

function Sidebar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "👥", label: "Community", path: "/community" },
    { icon: "🤖", label: "AI Chatbot", path: null },
  ];

  return (
    <>
      <aside className="sidebar-glass">
        <div className="sidebar-nav">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            
            return (
              <a 
                key={i} 
                href="#" 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.label === "AI Chatbot") {
                    setIsChatOpen(true);
                  } else {
                    navigate(item.path);
                  }
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {isActive && <div className="active-indicator"></div>}
              </a>
            );
          })}
        </div>
      </aside>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}

export default Sidebar;