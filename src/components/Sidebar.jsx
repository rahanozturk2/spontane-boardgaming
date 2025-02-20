import React from "react";

function Sidebar() {
  return (
    <div style={{
      position: "fixed",
      left: 0,
      top: 0,
      height: "100vh",
      width: "60px",
      background: "linear-gradient(to top, #222, #111)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
      writingMode: "vertical-lr",
      transform: "rotate(180deg)",
      transformOrigin: "center",
      whiteSpace: "nowrap",
      borderLeft: "5px solid white",
      letterSpacing: "25px" /* 🔴 Boşlukları artırdık */
    }}>
      Spontane-Boardgaming
    </div>
  );
}

export default Sidebar;
