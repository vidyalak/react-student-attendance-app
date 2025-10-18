import React from "react";
import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <p>© 2025 Student Attendance App. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy" className="footer-link">
            Privacy
          </a>
          <a href="/terms" className="footer-link">
            Terms
          </a>
          <a href="/contact" className="footer-link">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
