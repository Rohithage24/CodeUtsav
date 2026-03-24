import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-line"></div>
      <div className="footer-content">
        <div className="footer-logo">
          <span className="text-gradient">BookAI</span>
        </div>
        <p className="copyright">© 2026 Crafted with ✨ for Readers</p>
        <div className="footer-socials">
          <span className="social-link">Github</span>
          <span className="social-link">Twitter</span>
          <span className="social-link">Discord</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;