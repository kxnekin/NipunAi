import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const messages = [
    "⚡ One-Click Job Apply",
    "🤖 AI-Powered Interview Prep",
    "💻 Coding Platform",
    "📊 Personalized Dashboard"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🚀 Nipun AI</div>
        <div className="nav-links">
          <button onClick={() => navigate("/login")} className="nav-button">Login</button>
          <button onClick={() => navigate("/signup")} className="nav-button">Signup</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="animated-text-container">
          <span key={index} className="animated-text">
            {messages[index]}
          </span>
        </div>

        <h1>Your trusted AI setu from learning to earning</h1>
        <p>Transforming grasping skills to grabbing jobs</p>

        <div className="button-group">
          <button onClick={() => navigate("/signup")}>Get Started</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>

        <div className="footer-message">
          Made with 💡 for every learner with a dream
        </div>
      </div>
    </div>
  );
}

export default Home;
