import React, { useState } from "react";
import "../styles/Signup.css";
import authImage from "../images/image.png"; // same image as login

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [usn, setUsn] = useState("");
  const [branch, setBranch] = useState("");

  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = "http://localhost:5000/api/auth";

  const sendOtp = async () => {
    if (!email || !firstName || !lastName || !usn || !branch) {
      setMessage("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep("otp");
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch {
      setMessage("Error sending OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp || !password) {
      setMessage("Please enter OTP and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          password,
          role: "student",
          name: `${firstName} ${lastName}`,
          usn,
          branch,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup complete! You can now login.");
        setStep("complete");

        localStorage.setItem("studentName", `${firstName} ${lastName}`);
        localStorage.setItem("studentEmail", email);
        localStorage.setItem("studentRole", "student");
        localStorage.setItem("studentUSN", usn);
        localStorage.setItem("studentBranch", branch);
      } else {
        setMessage(data.message || "OTP verification failed");
      }
    } catch {
      setMessage("Error verifying OTP");
    }
    setLoading(false);
  };

  return (
    <div className="split-auth-page">
      <div className="auth-box">
        {/* Left Image Side */}
        <div className="auth-left">
          <img
            src={authImage}
            alt="Illustration"
            className="auth-illustration"
          />
          
        </div>

        {/* Right Form Side */}
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Sign up to access your dashboard</p>

            {/* Step 1: Email & Details */}
            {step === "email" && (
              <div className="auth-form fade-in">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="USN"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  className="btn primary-btn"
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <div className="auth-form fade-in">
                <p className="info-text">
                  OTP sent to <strong>{email}</strong>
                </p>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  className="btn primary-btn"
                  onClick={verifyOtp}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Signup"}
                </button>
                <button
                  className="btn secondary-btn"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setMessage("");
                  }}
                >
                  Change Email
                </button>
              </div>
            )}

            {/* Step 3: Complete */}
            {step === "complete" && (
              <div className="auth-form fade-in">
                <p className="auth-message success">{message}</p>
                <a href="/login" className="auth-link">
                  Go to Login →
                </a>
              </div>
            )}

            {/* Message */}
            {message && step !== "complete" && (
              <p
                className={`auth-message ${
                  message.includes("✅") ? "success" : "error"
                }`}
              >
                {message}
              </p>
            )}

            {/* Footer */}
            {step !== "complete" && (
              <p className="auth-footer">
                Already have an account?{" "}
                <a href="/login" className="auth-link">
                  Log in
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
