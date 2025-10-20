import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    passWord: "",
    firstName: "",
    lastName: "",
    userEmail: "",
    userRole: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.passWord !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.userRole) {
      setError("User role is required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login/register",
        formData,
        { validateStatus: () => true }
      );

      if (response.status === 200) {
        setShowPopup(true);
      } else if (response.status === 400) {
        setError(response.data);
      } else {
        setError("Unexpected server response.");
      }
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  const handlePopupOk = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account 📝</h2>
          <p className="register-subtitle">Fill in your details to register</p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          {/* First Name */}
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder=" " // same as First Name
            />
            <label>First Name</label>
          </div>

          {/* Last Name */}
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Last Name</label>
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Email Address</label>
          </div>

          {/* Username */}
          <div className="input-group">
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Username</label>
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type="password"
              name="passWord"
              value={formData.passWord}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Confirm Password</label>
          </div>

          {/* Select Role */}
          <div className="input-group select-role-userRole">
            <select
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="ADMIN">👑 Admin</option>
              <option value="NORMALUSER">🕵️ User</option>
            </select>
            <label>Select Role</label>
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p className="redirect-text">
          Already have an account?{" "}
          <span className="redirect-link" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="tick-circle">✔</div>
            <h3>Registered Successfully!</h3>
            <button className="ok-btn" onClick={handlePopupOk}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
