import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import GenreCard from "../components/GenreCard";
import BookCard from "../components/BookCard";
import Footer from "../components/Footer";
import TrendingSection from "../components/TrendingSection";

export default function Home() {
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [dynamicGenres, setDynamicGenres] = useState(["All"]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books/all");
        const json = await response.json();
        
        // Accessing 'data' from your API output { success: true, data: [...] }
        const booksList = json.data || [];
        setBooks(booksList);

        // --- DYNAMIC GENRE EXTRACTION ---
        const extractedGenres = booksList.flatMap(b => 
          Array.isArray(b.genre) ? b.genre : []
        );
        
        // Create unique list and format them (e.g., capitalize)
        const uniqueGenres = ["All", ...new Set(extractedGenres)];
        setDynamicGenres(uniqueGenres);

        setLoading(false);
      } catch (error) {
        console.error("API Fetch Error:", error);
        setBooks([]);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter logic using the nested API data
  const filtered = books.filter((b) => {
    const bookGenres = Array.isArray(b.genre) ? b.genre : [];
    
    const matchesGenre = 
      genre === "All" || 
      bookGenres.some(g => g.toLowerCase() === genre.toLowerCase());

    const matchesSearch = 
      b.author?.toLowerCase().includes(search.toLowerCase()) ||
      b.title?.toLowerCase().includes(search.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  return (
    <div className="home-wrapper">
      <Navbar />
      <Sidebar />
      <Hero />

      {/* Floating Search */}
      <div className="search-container">
        <div className="search-glass">
          <div className="search-glow"></div>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by author or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <main className="main-content">
        {/* Genre Section - Now Dynamic from API */}
        <section className="content-section sparkle-bg">
          <div className="dynamic-glow"></div>
          <div className="section-header">
            <span className="line"></span>
            <h2 className="section-title">Browse <span className="text-gradient">Genres</span></h2>
            <span className="line"></span>
          </div>
          
          <div className="genre-scroller">
            {dynamicGenres.map((g, i) => (
              <GenreCard
                key={i}
                genre={g}
                active={genre === g}
                onClick={() => setGenre(g)}
              />
            ))}
          </div>
        </section>

        {/* Books Grid */}
        <section className="content-section">
          <div className="grid-info">
            <p className="results-count">
              {loading ? "Reading the stars..." : `${filtered.length} celestial books found`}
            </p>
          </div>
          
          <div className="book-grid">
            {loading ? (
              <div className="loading-spinner">✨ Summoning library...</div>
            ) : filtered.length > 0 ? (
              filtered.map((b, i) => (
                <div key={b._id} className="reveal-item" style={{ "--delay": `${i * 0.1}s` }}>
                  <BookCard book={b} />
                </div>
              ))
            ) : (
              <div className="no-results glass-card">
                <p>No books found for "{search}"</p>
                <button onClick={() => setSearch("")} className="btn-secondary small">Reset Search</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <TrendingSection />
      <Footer />
    </div>
  );
}