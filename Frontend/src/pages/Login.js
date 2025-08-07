import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);  // <-- New state
  const navigate = useNavigate();

  const backendUrl = 'http://localhost:5000/api/auth';

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Login successful!');
        console.log('User logged in:', data);

        if (data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setMessage(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setMessage('Error during login');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? 'text' : 'password'}  // <-- Toggle type
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ paddingRight: '80px' }} // to make space for button
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      {message && (
        <p style={{ color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}

      <p>
        Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;