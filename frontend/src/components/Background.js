import React from 'react';

const Background = () => {
  return (
    <div className="fixed-background">
      <div className="dynamic-glow"></div>
      <div className="sparkle-container">
        {/* We create 50 sparkles dynamically */}
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="sparkle" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `scale(${Math.random()})`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Background;