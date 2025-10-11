import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../landing/NavBar";
import Footer from "../landing/Footer";
import Landing from "../landing/Landing";
import Login from "../login/Login";
import Dashboard from "../adminDashboard/Dashboard";
import Register from "../register/Register";

function AppRoutes() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
