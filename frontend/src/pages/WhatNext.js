import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function WhatNext() {
  const [input, setInput] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getGeminiRecommendation = async () => {
    if (!input.trim()) return;
    setLoading(true);
    
    try {
      const prompt = `User likes these books/themes: "${input}". 
      Recommend 1 perfect book. Return ONLY a JSON object with this exact structure: 
      { "title": "Book Title", "author": "Author Name", "reason": "Short explanation why", "vibe": "One word vibe" }`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAwTcYKcFeMkQeYXSjTiZVo7QdyX-buKvA`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Remove any potential markdown formatting from Gemini
      const cleanJson = textResponse.replace(/```json|```/g, "").trim();
      setRecommendation(JSON.parse(cleanJson));
    } catch (error) {
      console.error("Gemini Error:", error);
      alert("The stars are clouded right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <Navbar />
      <Sidebar />

      {/* FIXED: motion.main now wraps the ENTIRE content area */}
      <motion.main 
        className="main-content"
        initial={{ rotateY: -30, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: 30, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: 0, perspective: "2000px" }}
      >
        <section className="content-section sparkle-bg what-next-container">
          <div className="glass-card prediction-box">
            <h2 className="text-gradient">Consult the <span className="text-glow">Archivist</span></h2>
            <p className="subtitle">Tell us what you've read recently or the specific vibes you're craving.</p>

            <div className="input-group">
              <textarea 
                placeholder="Ex: I loved the stoicism in 'Meditations' and want something similarly life-changing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                className="post-btn manifest-btn" 
                onClick={getGeminiRecommendation}
                disabled={loading}
              >
                {loading ? "Reading the Constellations..." : "Manifest My Next Read ✦"}
              </button>
            </div>

            <AnimatePresence>
              {recommendation && (
                <motion.div 
                  className="result-card"
                  initial={{ y: 50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <div className="result-badge">{recommendation.vibe}</div>
                  <h3>{recommendation.title}</h3>
                  <p className="author">by {recommendation.author}</p>
                  <div className="ai-reasoning">
                    <strong>The Archivist's Note:</strong>
                    <p>{recommendation.reason}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}