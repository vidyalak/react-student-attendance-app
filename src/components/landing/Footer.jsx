import React from "react";
import "../css/landing.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© 2025 Student App. All Rights Reserved.</p>
      <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/contact">Contact</a>
      </div>
    </footer>
  );
}

export default Footer;
