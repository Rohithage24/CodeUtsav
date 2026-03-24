import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import GlobalBackground from "./components/GlobalBackground";
import Home from "./pages/Home";
import WhatNext from "./pages/WhatNext";
import Community from "./pages/Community";

function App() {
  const location = useLocation();

  return (
    <div className="app-root">
      {/* 1. This stays fixed globally */}
      <GlobalBackground />

      <div className="ui-layer" style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/what-next" element={<WhatNext />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}