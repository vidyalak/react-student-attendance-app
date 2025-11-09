import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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

          {/* ✅ Hide Login when logged in */}
          {!isLoggedIn && (
            <li><Link to="/login" className="nav-link">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
