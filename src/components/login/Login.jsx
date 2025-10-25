import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Auto-fill username if coming from Register
  useEffect(() => {
    const savedUserName = localStorage.getItem("userName");
    // ✅ Only set if not null or "null"
    if (savedUserName && savedUserName !== "null") {
      setUserName(savedUserName);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { userName, passWord },
        { auth: { username: userName, password: passWord } }
      );

      if (response.status === 200) {
        setMessage("✅ Login successful!");

        // ✅ Safely read user info from localStorage
        const role = localStorage.getItem("role") || "";
        const firstName = localStorage.getItem("firstName") || "";
        const lastName = localStorage.getItem("lastName") || "";
        const username = localStorage.getItem("userName") || "";

        console.log("Login Info:", { username, firstName, lastName, role });

        // Store again for dashboard use
        localStorage.setItem("role", role);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("userName", username);

        // Redirect to dashboard
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 401) {
        setMessage("❌ Invalid username or password");
      } else {
        setMessage("⚠️ Error connecting to server");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back 👋</h2>
          <p>Log in to manage students efficiently</p>
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
            <span
              className="redirect-link"
              onClick={() => navigate("/register")}
            >
              Register Here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
