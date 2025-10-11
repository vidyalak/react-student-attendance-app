import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/login.css";

function Login() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        userName,
        passWord,
      });

      if (response.status === 200) {
        setMessage("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Invalid username or password");
      } else {
        setMessage("Error connecting to server");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={passWord}
            onChange={(e) => setPassWord(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        {/* --- NEW SECTION --- */}
        <div className="login-links">
          <p
            className="link-text"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
          <p className="link-text">
            Don’t have an account?{" "}
            <span
              className="redirect-link"
              onClick={() => navigate("/register")}
            >
              Click to Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
