import React, { useState } from 'react';
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // 🔥 Auth context
  const [auth, setAuth] = useAuth();

  // 🔥 Logout function
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/user/logout", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      // 🔹 Clear auth state
      setAuth({
        user: null,
        token: "",
      });

      // 🔹 Remove from localStorage (IMPORTANT)
      localStorage.removeItem("auth");

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          
          <div className="logo">
            <Link to="/">
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

            {/* 🔥 CONDITION */}
            {auth?.user ? (
              <div className="user-section">
                {/* <span className="nav-item">
                  {auth.user.mobile}
                </span> */}

                <button 
                  className="login-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div 
                className="login-link" 
                onClick={() => setIsLoginOpen(true)} 
                style={{ cursor: 'pointer' }}
              >
                <button className="login-btn">Login</button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}

export default Navbar;