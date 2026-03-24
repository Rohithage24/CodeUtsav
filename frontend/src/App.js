import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/LoginModal";
import Community from "./pages/Community"; // New Import
import WhatNext from "./pages/WhatNext"; // New Import

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/community" element={<Community />} />
      <Route path="/what-next" element={<WhatNext />} /> {/* New Route */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/LoginModal" element={<Login />} />
    </Routes>
  );
}

export default App;