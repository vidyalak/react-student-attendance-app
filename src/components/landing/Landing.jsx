import React from "react";
import "../css/landing.css";

function Landing() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-content">
          <h2>Welcome to the Dashboard 🎓</h2>
          <p>
            Manage student attendance, view academic information, organize
            events, and more — all in one easy-to-use platform.
          </p>
          <button className="get-started-btn">Get Started</button>
        </div>
      </section>
    </main>
  );
}

export default Landing;
