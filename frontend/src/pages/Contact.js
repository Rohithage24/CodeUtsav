import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message Sent:", formData);
    alert("Message beamed to the station! 🚀");
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <main className="contact-container">
        <section className="contact-header">
          <h1 className="hero-title">Reach the <span className="text-gradient">Station</span></h1>
          <p className="hero-subtitle">Have a question or a cosmic suggestion? Send us a transmission.</p>
        </section>

        <div className="contact-wrapper">
          {/* Left Side: Info Cards */}
          <div className="contact-info">
            <div className="info-card-glass">
              <span className="info-icon">📧</span>
              <div>
                <h4>Email Us</h4>
                <p>hello@bookai.com</p>
              </div>
            </div>
            <div className="info-card-glass">
              <span className="info-icon">📍</span>
              <div>
                <h4>HQ Location</h4>
                <p>Digital Galaxy, Sector-7</p>
              </div>
            </div>
            <div className="info-card-glass">
              <span className="info-icon">💬</span>
              <div>
                <h4>Community</h4>
                <p>Join our Discord</p>
              </div>
            </div>
          </div>

          {/* Right Side: The Glass Form */}
          <form className="contact-form-glass" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                placeholder="Commander Shepard" 
                required 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="name@galaxy.com" 
                required 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Transmission</label>
              <textarea 
                rows="5" 
                placeholder="Type your message here..." 
                required 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn-primary full-width">
              Send Transmission ⚡
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;