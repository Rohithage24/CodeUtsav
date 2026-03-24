import React, { useState } from 'react'; // Added useState
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal"; // Import the modal

function Navbar() {
  // Logic to track if the popup is open
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Link to="/">
              {/* Dynamic CSS Book Icon */}
              <div className="logo-visual">
                <div className="book-spine"></div>
                <div className="book-page"></div>
              </div>
              <span className="logo-text">BookAI</span>
            </Link>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/about" className="nav-item">About</Link>
            <Link to="/contact" className="nav-item">Contact</Link>
            
            {/* Just the Login Item changed to trigger the popup */}
            <div className="login-link" onClick={() => setIsLoginOpen(true)} style={{cursor: 'pointer'}}>
              <button className="login-btn">Login</button>
            </div>
          </div>
        </div>
      </nav>

      {/* The Popup component */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}

export default Navbar;