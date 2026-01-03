import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../landing/NavBar";
import Footer from "../landing/Footer";
import Landing from "../landing/Landing";
import Login from "../login/Login";
import Dashboard from "../adminDashboard/Dashboard";
import Register from "../register/Register";
import StaffCreation from "../staff-details/StaffCreation";
import StaffList from "../staff-details/StaffList";
import StudentList from "../student-details/StudentList";
import Profile from "../profile-creation/Profile";

function AppRoutes() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="staff-creation" element={<StaffCreation />} />
            <Route path="staff-list" element={<StaffList />} />
            <Route path="student-info" element={<StudentList />} />
             <Route path="profile-creation" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
