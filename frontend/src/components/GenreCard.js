import React from 'react';

const GenreCard = ({ genre, onClick, active }) => {
  return (
    <div 
      className={`genre-chip ${active ? "active" : ""}`} 
      onClick={onClick}
    >
      {active && <span className="chip-dot"></span>}
      {genre}
    </div>
  );
};

export default GenreCard;