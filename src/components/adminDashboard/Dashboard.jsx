import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`/dashboard/${path}`);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          <li onClick={() => navigateTo("student-info")}>📚 Student Info</li>
          <li onClick={() => navigateTo("profile-creation")}>👤 Profile Creation</li>
          <li onClick={() => navigateTo("event-creation")}>🏠 Event Creation</li>
          <li onClick={() => navigateTo("event")}>📊 Event</li>
          <li onClick={() => navigateTo("staff-creation")}>👨‍🏫 Staff Creation</li>
          <li onClick={() => navigateTo("staff-list")}>🗂️ Staff Info</li>
          <li onClick={() => navigateTo("alumni-details")}>🎓 Alumni Details</li>
          <li onClick={() => navigateTo("attendance-history")}>📅 Attendance History</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome to Dashboard!</h1>
        <p>Select an option from the sidebar</p>
      </main>
    </div>
  );
}

export default Dashboard;
