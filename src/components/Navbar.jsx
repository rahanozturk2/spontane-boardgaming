import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "#222", 
      color: "white", 
      padding: "15px 20px",
      display: "flex", 
      justifyContent: "flex-start", /* 🔴 SOLA DAYALI YAPILDI */
      alignItems: "center",
      zIndex: 1000
    }}>
      <ul style={{ 
        display: "flex", 
        listStyle: "none", 
        margin: "0", 
        padding: "0", 
        alignItems: "center"
      }}>
        <li style={{ padding: "0 15px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>Ana Sayfa</Link>
        </li>
        <li style={{ padding: "0 15px" }}>
          <Link to="/aciklamalar" style={{ color: "white", textDecoration: "none" }}>Açıklamalar</Link>
        </li>
        <li style={{ padding: "0 15px" }}>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Giriş</Link>
        </li>
        <li style={{ padding: "0 15px" }}>
          <Link to="/kullanici" style={{ color: "white", textDecoration: "none" }}>Kullanıcı</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
