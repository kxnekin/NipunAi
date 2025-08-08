// src/pages/Signup.js
import React, { useState } from 'react';
import '../styles/home.css';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email', 'otp', 'complete'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [usn, setUsn] = useState('');
  const [branch, setBranch] = useState('');


  const backendUrl = 'http://localhost:5000/api/auth';

  const sendOtp = async () => {
    if (!email || !firstName || !lastName) {
      setMessage('Please enter your first name, last name, and email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setStep('otp');
      } else {
        setMessage(data.message || 'Failed to send OTP');
      }
    } catch {
      setMessage('Error sending OTP');
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp || !password) {
      setMessage('Please enter OTP and password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          password,
          role: 'student',
          name: `${firstName} ${lastName}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('OTP verified! Signup complete.');
        setStep('complete');

        // ✅ Store student data locally
        localStorage.setItem('studentName', `${firstName} ${lastName}`);
        localStorage.setItem('studentEmail', email);
        localStorage.setItem('studentRole', 'student');
        localStorage.setItem('studentUSN', usn);
        localStorage.setItem('studentBranch', branch);

      } else {
        setMessage(data.message || 'OTP verification failed');
      }
    } catch {
      setMessage('Error verifying OTP');
    }
    setLoading(false);
  };

  return (
    <div className="signup-wrapper">
      <div className="auth-container">
        <h2 className="title">Create your account</h2>

        {step === 'email' && (
          <>
            <label htmlFor="firstName" className="input-label">First Name</label>
            <input
              id="firstName"
              type="text"
              className="input-field"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />

            <label htmlFor="lastName" className="input-label">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="input-field"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <label htmlFor="usn" className="input-label">USN</label>
            <input
              id="usn"
              type="text"
              className="input-field"
              placeholder="e.g., 1JT21CS001"
              value={usn}
              onChange={(e) => setUsn(e.target.value)}
            />

            <label htmlFor="branch" className="input-label">Branch</label>
            <input
              id="branch"
              type="text"
              className="input-field"
              placeholder="e.g., Computer Science"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />


            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="btn primary-btn" onClick={sendOtp} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <p className="info-text">OTP sent to <strong>{email}</strong></p>

            <label htmlFor="otp" className="input-label">Enter OTP</label>
            <input
              id="otp"
              type="text"
              className="input-field"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoFocus
            />

            <label htmlFor="password" className="input-label">Create Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn primary-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP & Signup'}
            </button>

            <button
              className="btn link-btn"
              onClick={() => {
                setStep('email');
                setOtp('');
                setMessage('');
              }}
            >
              Change Email
            </button>
          </>
        )}

        {step === 'complete' && (
          <div className="complete-message">
            <p className="success-text">{message}</p>
            <p>
              You can now <a href="/login" className="link">login</a>.
            </p>
          </div>
        )}

        {message && step !== 'complete' && (
          <p className="error-text">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
