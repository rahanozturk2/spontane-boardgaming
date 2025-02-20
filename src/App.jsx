import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Açıklamalar from "./pages/Açıklamalar";
import Login from "./pages/Login";
import Kullanici from "./pages/Kullanici";

function App() {
  return (
    <Router>
      <Sidebar /> {/* Sol Sidebar */}
      <Navbar /> {/* Üst Menü */}
      {/* 🔴 Bütün Routes bileşenini kaydırmak için yeni div ekledik */}
      <div style={{ marginLeft: "80px", padding: "80px 20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aciklamalar" element={<Açıklamalar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kullanici" element={<Kullanici />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // ✅ Sadece bir tane export default olmalı!
