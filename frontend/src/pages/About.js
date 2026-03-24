import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const values = [
    { icon: "🧠", title: "AI-Driven", desc: "Using neural networks to understand the soul of a book, not just the genre." },
    { icon: "🌍", title: "Universal", desc: "Accessing a global library of wisdom, translated and curated for you." },
    { icon: "⚡", title: "Instant", desc: "Real-time discovery that evolves as your reading taste changes." }
  ];

  return (
    <div className="about-page">
      <Navbar />
      
      <main className="about-container">
        {/* Header Section */}
        <section className="about-hero">
          <h1 className="hero-title">Beyond <span className="text-gradient">Pages</span></h1>
          <p className="hero-subtitle">
            We are redefining how humans connect with stories through Artificial Intelligence.
          </p>
        </section>

        {/* Vision Cards */}
        <section className="values-grid">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </section>

        {/* Interactive Story Section */}
        <section className="story-section glass-card">
          <div className="story-content">
            <h2>Our <span className="text-gradient">Mission</span></h2>
            <p>
              In a world of infinite content, finding the right book is harder than ever. 
              BookAI was born in 2026 to act as a celestial navigator for your intellectual journey. 
              We don't just recommend; we understand.
            </p>
            <button className="btn-primary">Join the Community</button>
          </div>
          <div className="story-visual">
            <div className="blob-gradient"></div>
            <span className="visual-emoji">🚀</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;