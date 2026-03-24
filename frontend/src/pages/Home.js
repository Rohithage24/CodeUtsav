import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import GenreCard from "../components/GenreCard";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";
import { books } from "../data/books";

export default function Home() {
  const [genre, setGenre] = useState("All");
  const [search, setSearch] = useState("");

  const genres = ["All", "Fantasy", "Fiction", "Finance", "Self-Help"];

  const filtered = books.filter(
    (b) =>
      (genre === "All" || b.genre === genre) &&
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-wrapper">
      <Navbar />
      <Sidebar />
      <Hero />

      {/* The Floating Bridge Search */}
      <div className="search-container">
        <div className="search-glass">
          <div className="search-glow"></div>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <main className="main-content">
        {/* Genre Section - NOW WITH SPARKLE BACKGROUND */}
        <section className="content-section sparkle-bg">
          <div className="dynamic-glow"></div> {/* Animated light effect */}
          
          <div className="section-header">
            <span className="line"></span>
            <h2 className="section-title">Browse <span className="text-gradient">Genres</span></h2>
            <span className="line"></span>
          </div>
          
          <div className="genre-scroller">
            {genres.map((g, i) => (
              <GenreCard
                key={i}
                genre={g}
                active={genre === g}
                onClick={() => setGenre(g)}
              />
            ))}
          </div>
        </section>

        {/* Books Grid Section */}
        <section className="content-section">
          <div className="grid-info">
            <p className="results-count">{filtered.length} amazing books found</p>
          </div>
          
          <div className="book-grid">
            {filtered.length > 0 ? (
              filtered.map((b, i) => (
                <div key={i} className="reveal-item" style={{ "--delay": `${i * 0.1}s` }}>
                  <BookCard book={b} />
                </div>
              ))
            ) : (
              <div className="no-results glass-card">
                <p>No books found for "{search}"</p>
                <button onClick={() => setSearch("")} className="btn-secondary small">Clear Search</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}