import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const messages = [
    "🤖 AI-Assisted Learning",
    "💼 Apply for Jobs Instantly",
    "🧠 Practice Coding Challenges",
    "🎯 Ace Technical & HR Interviews",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  const techLogos = [
    "apple.png",
    "google.png",
    "meta.png",
    "amazon.png",
    "microsoft.png",
    "netflix.png",
    "ibm.png",
    "tesla.png",
    "adobe.png",
    "nvidia.png",
    "intel.png",
    "oracle.png",
    "samsung.png",
    "spotify.png",
  ];

  const [positions, setPositions] = useState(
    techLogos.map(() => ({
      x: Math.random() * 80,
      y: Math.random() * 80,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => {
          let { x, y, dx, dy } = pos;
          x += dx;
          y += dy;
          if (x <= 0 || x >= 85) dx *= -1;
          if (y <= 0 || y >= 85) dy *= -1;
          return { x, y, dx, dy };
        })
      );
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="modern-home-wrapper">
      {/* Navbar */}
      <nav className="modern-navbar">
        <div className="logo">
          <motion.h1
            className="logo-heading"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Nipun AI
          </motion.h1>
        </div>

        <div className="nav-links">
          <motion.button
            onClick={() => navigate("/login")}
            className="modern-nav-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Login
          </motion.button>

          <motion.button
            onClick={() => navigate("/signup")}
            className="modern-nav-button filled-btn"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(100, 150, 255, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Learning
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        className="modern-hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Left Side */}
        <div className="hero-left">
          <motion.p className="modern-tagline">
            PRACTISE CODING | PREPARE FOR INTERVIEWS | APPLY TO JOBS
          </motion.p>
          <motion.h1>
            AI-Powered <br />
            <span className="modern-highlight">Learning to Earning SETU</span>
          </motion.h1>
          <motion.p className="modern-subtext">
            Nipun AI helps you master coding, prepare for technical & HR
            interviews, and apply for jobs — all in one place. Harness the power
            of AI to grow your career effortlessly.
          </motion.p>

          <motion.button
            onClick={() => navigate("/signup")}
            className="modern-cta-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Nipun AI Today
          </motion.button>

          <motion.div className="feature-showcase" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="feature-icon">✨</span>
            <motion.span
              key={index}
              className="feature-text"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {messages[index]}
            </motion.span>
          </motion.div>

          {/* Left decoration + mini bullet list to fill left area */}
          <div className="left-decor-row">
            <div className="left-decor-icons">
              <motion.div whileHover={{ scale: 1.15 }}>💻</motion.div>
              <motion.div whileHover={{ scale: 1.15 }}>🚀</motion.div>
              <motion.div whileHover={{ scale: 1.15 }}>📈</motion.div>
              <motion.div whileHover={{ scale: 1.15 }}>🧠</motion.div>
            </div>

            <ul className="left-bullets">
              <li>💡 Personalized Learning Paths</li>
              <li>🤖 AI Mock Interviews</li>
              <li>📊 Real-Time Skill Reports</li>
            </ul>
          </div>
        </div>

        {/* Right Visual */}
        <motion.div
          className="hero-right-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
        >
          <div className="logo-box-wrapper">
            <div className="logo-bounce-box wide-box">
              {techLogos.map((logo, idx) => (
                <img
                  key={idx}
                  src={`/logos/${logo}`}
                  alt={`${logo.split(".")[0]} logo`}
                  className="floating-logo-colored"
                  style={{
                    top: `${positions[idx].y}%`,
                    left: `${positions[idx].x}%`,
                  }}
                />
              ))}
            </div>

            <motion.p
              className="below-box-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Prepare for your dream job with{" "}
              <span className="nipun-highlight">Nipun AI</span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating glowing background */}
      <div className="animated-bg-blur" />
    </div>
  );
}

export default Home;
