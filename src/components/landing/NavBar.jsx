import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsLoggedIn(!!userData);
  }, []);

  return (
    <header className="navbar">
      <div className="nav-container">
        
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">StudentManage</span>
        </div>

        {/* Hamburger (Mobile) */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/">Dashboard</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/events">Events</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* Desktop Sign In Button */}
        {!isLoggedIn && (
          <Link to="/login" className="sign-in-btn desktop-only">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
