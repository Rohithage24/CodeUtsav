import React from 'react';

function Hero() {
  // --- SPARKLE SIZE & SPEED BOOST ---
  // Increased count and adjusted sizes for huge, dramatic sparkles.
  const sparkles = Array.from({ length: 30 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 110}%`, 
    duration: `${Math.random() * 6 + 4}s`, // Fast but readable speed
    delay: `${Math.random() * 8}s`,
    // HUGE size range: 4px to 12px
    size: `${Math.random() * 8 + 4}px`, 
  }));

  return (
    <section className="hero">
      {/* --- REIMAGINED GALAXY BACKGROUND --- */}
      <div className="hero-bg">
        {/* This layer handles the swirling gradient animation */}
        <div className="galaxy-vortex"></div>
        {/* Optional blur for a softer, premium feel */}
        <div className="galaxy-blur"></div>
        
        <div className="sparkles">
          {sparkles.map((p, i) => (
            <span 
              key={i} 
              className="sparkle" 
              style={{ 
                '--left': p.left, 
                '--top': p.top, 
                '--duration': p.duration,
                '--delay': p.delay,
                '--size': p.size
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* --- HERO CONTENT (Remains sharp and on top) --- */}
      <div className="hero-content">
        <div className="badge">✨ AI-Powered Discovery</div>
        <h1 className="hero-title">
          Discover Books <br /> 
          <span className="text-gradient">You'll Love</span>
        </h1>
        <p className="hero-subtitle">
          Personalized reading journeys guided by advanced artificial intelligence. 
        </p>
        
        <div className="hero-btns">
          <button className="btn-primary">Get Started</button>
          <button className="btn-secondary">Explore Library</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;