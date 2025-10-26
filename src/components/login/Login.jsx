import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Clear previous session on load
  useEffect(() => {
    localStorage.removeItem("userData");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("🔄 Logging in...");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { userName, passWord },
       {
          auth: { username: userName, password: passWord },
        }
      );

      if (response.status === 200) {
        // ✅ Save dynamic response in localStorage
        const { userName: uname, firstName, lastName, userEmail, userRole } = response.data;

        const userData = {
          userName: uname?.toUpperCase() || userName.toUpperCase(),
          firstName: firstName || "Guest",
          lastName: lastName || "",
          userEmail: userEmail || "",
          userRole: userRole?.toUpperCase() || "NORMALUSER",
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "❌ Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back 👋</h2>
          <p>Log in to access your dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder=" "
            />
            <label>Username</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <div className="login-links">
          <p className="link-text" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </p>
          <p className="link-text">
            Don’t have an account?{" "}
            <span className="redirect-link" onClick={() => navigate("/register")}>
              Register Here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
