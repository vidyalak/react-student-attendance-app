import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // ✅ Safely get user info
  const role = localStorage.getItem("role") || "";
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";
  const userName = localStorage.getItem("userName") || "";

  console.log("Dashboard Info:", { userName, firstName, lastName, role });

  const handleSidebarClick = (path) => navigate(path);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          {role === "ADMIN" ? (
            <>
              <li onClick={() => handleSidebarClick("/dashboard/student-info")}>📚 Student Info</li>
              <li onClick={() => handleSidebarClick("/dashboard/profile-creation")}>👤 Profile Creation</li>
              <li onClick={() => handleSidebarClick("/dashboard/event-creation")}>🏠 Event Creation</li>
              <li onClick={() => handleSidebarClick("/dashboard/event")}>📊 Event</li>
              <li onClick={() => handleSidebarClick("/dashboard/staff-creation")}>👨‍🏫 Staff Creation</li>
              <li onClick={() => handleSidebarClick("/dashboard/staff-list")}>🗂️ Staff List</li>
              <li onClick={() => handleSidebarClick("/dashboard/alumni-details")}>🎓 Alumni Details</li>
              <li onClick={() => handleSidebarClick("/dashboard/attendance-history")}>📅 Attendance History</li>
            </>
          ) : (
            <li onClick={() => handleSidebarClick("/dashboard/my-attendance")}>📝 My Attendance Info</li>
          )}
        </ul>
      </aside>

      <main className="dashboard-content">
        <Outlet />
        {!window.location.pathname.includes("dashboard/") && (
          <>
            <h1>Welcome {firstName} {lastName}!</h1>
            <p>Role: {role}</p>
            <p>Select an option from the sidebar</p>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
