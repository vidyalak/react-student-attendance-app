import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom"; 
import "../css/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData) {
      setUserData(storedData);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSidebarClick = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!userData) {
    return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Loading user data...</h2>;
  }

  const { userName, firstName, lastName, userRole } = userData;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <ul>
          {userRole === "ADMIN" && (
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
          )}

          {userRole === "NORMALUSER" && (
            <li onClick={() => handleSidebarClick("/dashboard/my-attendance")}>📝 My Attendance Info</li>
          )}

          <li onClick={handleLogout} >
            🔒 Logout
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <Outlet />
         {location.pathname === "/dashboard" && (
        <div className="welcome-section">
          <h1>
            Welcome {firstName} {lastName} ({userName})! 👋
          </h1>
          <p>
            ROLE: <strong>{userRole}</strong>
          </p>
          <p>Select an option from the sidebar to get started 🚀</p>
        </div>
          )}
      </main>
    </div>
  );
}

export default Dashboard;
