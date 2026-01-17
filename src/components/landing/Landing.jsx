import React from "react";
import "../css/landing.css";
import heroImg from "../assets/landing/hero.jpeg";

const Landing = () => {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-text">
          <h1>
            All-in-One <br />
            Student <span>Management</span> <br />
            System
          </h1>

          <p>
            Manage students, track progress, and streamline
            communication — all in one easy platform.
          </p>

          <button className="cta-btn">Get Started</button>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="Students illustration" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h4>Student Profiles</h4>
          <p>Manage detailed student information.</p>
        </div>

        <div className="feature-card">
          <h4>Course Management</h4>
          <p>Organize and assign courses.</p>
        </div>

        <div className="feature-card">
          <h4>Attendance Tracking</h4>
          <p>Track student attendance easily.</p>
        </div>

        <div className="feature-card">
          <h4>Grades & Reports</h4>
          <p>Generate and view reports.</p>
        </div>
      </section>
    </main>
  );
};

export default Landing;
