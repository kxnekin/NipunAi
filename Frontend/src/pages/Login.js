import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import authImage from "../images/image.png"; // ✅ Correct import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const backendUrl = "http://localhost:5000/api/auth";

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful!");
        localStorage.setItem("studentName", data.name);
        localStorage.setItem("studentEmail", data.email);
        localStorage.setItem("studentRole", data.role);

        if (data.usn) localStorage.setItem("studentUSN", data.usn);
        if (data.branch) localStorage.setItem("studentBranch", data.branch);

        navigate(data.role === "admin" ? "/admin-dashboard" : "/student-dashboard");
      } else {
        setMessage(data.message || "Invalid email or password");
      }
    } catch {
      setMessage("Error during login");
    }
    setLoading(false);
  };

  return (
    <div className="split-auth-page">
      <div className="auth-box"> {/* ✅ Added wrapper for compact box */}

        {/* Left Image Panel */}
        <div className="auth-left">
          <img
            src={authImage}
            alt="Illustration"
            className="auth-illustration"
          />
          
        </div>

        {/* Right Form Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-title">Sign in to your account</h2>
            <p className="auth-subtitle">Access your personalized dashboard</p>

            <div className="auth-form">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="input-group password-group">
                <label>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                className="btn primary-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {message && (
                <p
                  className={`auth-message ${
                    message.includes("success") ? "success" : "error"
                  }`}
                >
                  {message}
                </p>
              )}

              <p className="auth-footer">
                Don’t have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div> {/* End of auth-box */}
    </div>
  );
};

export default Login;
