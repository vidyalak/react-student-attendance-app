import React from "react";
import "../css/landing.css";

function Landing() {
  return (
    <main className="landing container">
      <h2>Welcome to the Dashboard 🎓</h2>
      <p>
        This is the student dashboard. Use the navigation bar above to explore 
        different sections like Home, About, Gallery, and Login.
      </p>
      <button className="get-started-btn">Get Started</button>
    </main>
  );
}

export default Landing;
