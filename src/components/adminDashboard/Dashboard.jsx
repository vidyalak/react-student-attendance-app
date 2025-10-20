import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleSidebarClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          <li onClick={() => handleSidebarClick("/dashboard/student-info")}>
            📚 Student Info
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/profile-creation")}>
            👤 Profile Creation
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/event-creation")}>
            🏠 Event Creation
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/event")}>
            📊 Event
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/staff-creation")}>
            👨‍🏫 Staff Creation
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/staff-list")}>
            🗂️ Staff List
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/alumni-details")}>
            🎓 Alumni Details
          </li>
          <li onClick={() => handleSidebarClick("/dashboard/attendance-history")}>
            📅 Attendance History
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        {/* Nested route content will appear here */}
        <Outlet />

        {/* Default message when no route is selected */}
        {!window.location.pathname.includes("dashboard/") && (
          <>
            <h1>Welcome to Dashboard!</h1>
            <p>Select an option from the sidebar</p>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
