import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// 3D Flip Variants
const bookFlipVariants = {
  initial: {
    rotateY: -110, // Starts "closed" or tucked back
    opacity: 0,
    transformPerspective: 2000,
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: [0.645, 0.045, 0.355, 1.000], // Smooth cubic-bezier
    }
  },
  exit: {
    rotateY: 110,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    }
  }
};

export default function WhatNext() {
  return (
    <div className="home-wrapper" style={{ overflow: 'hidden', perspective: '2000px' }}>
      <Navbar />
      <Sidebar />

      <motion.main 
        className="main-content"
        variants={bookFlipVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ originX: 0 }} // This is the "Spine" hinge
      >
        <section className="content-section sparkle-bg" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <div className="glass-card what-next-card">
            <div className="book-spine-accent"></div> {/* Visual spine detail */}
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-gradient" style={{ fontSize: '3.5rem' }}>The Next Chapter</h1>
              <p className="description-text">
                Your journey doesn't end here. Based on your recent explorers, 
                the stars suggest a path toward <strong>Deep Work</strong>.
              </p>
              
              <div className="stats-preview">
                <div className="stat-item">
                  <span className="stat-label">Mood Match</span>
                  <span className="stat-value">98%</span>
                </div>
              </div>

              <button className="post-btn" style={{ marginTop: '30px', width: '100%' }}>
                Turn the Page ✦
              </button>
            </motion.div>
          </div>
          
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}