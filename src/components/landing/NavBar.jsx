import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <h1 className="navbar-title">🎓 Student Attendance</h1>
        
        {/* Hamburger for Mobile */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          <li><Link to="/gallery" className="nav-link">Gallery</Link></li>
          <li><Link to="/login" className="nav-link">Login</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
