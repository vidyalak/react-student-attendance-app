import React from "react";
import { Link } from "react-router-dom";
import "../css/landing.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <h1 className="navbar-title">Student App</h1>
        <ul className="navbar-menu">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </li>
          <li>
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
