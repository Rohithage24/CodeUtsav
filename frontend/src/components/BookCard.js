import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="book-card-glass">
      <div className="book-cover-area">
        <div className="book-visual">
          <span className="book-icon-large">📖</span>
        </div>
        <div className="book-badge">{book.genre}</div>
      </div>
      
      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author-name">by {book.author}</p>
        
        <div className="book-footer">
          <button className="view-btn">
            View Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;