import React from 'react';

function Sidebar() {
  const menuItems = [
    { icon: "🏠", label: "Community", active: true },
    { icon: "🤖", label: "AI Chatbot", active: false },
  ];

  return (
    <aside className="sidebar-glass">
      <div className="sidebar-nav">
        {menuItems.map((item, i) => (
          <a 
            key={i} 
            href="#" 
            className={`sidebar-link ${item.active ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
            {item.active && <div className="active-indicator"></div>}
          </a>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;