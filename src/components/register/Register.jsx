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
        {
          // Accept all status codes as valid so we handle them in then
          validateStatus: () => true,
        }
      );

      const { status, message } = response.data;

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
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Register</h2>

        <form className="login-form" onSubmit={handleRegister}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="userEmail"
            placeholder="Email Address"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="passWord"
            placeholder="Password"
            value={formData.passWord}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="custom-dropdown">
            <select
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">👑 Admin</option>
              <option value="Author">✍️ Author</option>
              <option value="Content Reviewer">🕵️ Content Reviewer</option>
              <option value="Retailer">🏪 Retailer</option>
            </select>
          </div>

          <button type="submit" className="login-btn">
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
