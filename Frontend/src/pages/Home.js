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
  const [typedCode, setTypedCode] = useState("");

  const codeSnippet = `class NipunAI {
  private:
    vector<string> skills;
    bool isLearning;
    const string motto = "Your AI Setu from Learning to Earning";

  public:
    NipunAI() : isLearning(true) {
        cout << "[SYSTEM] Welcome to Nipun AI!";
        cout << "\\n[INFO] AI learning initialized...";
    }

    void boostCareer() {
        cout << "[SUCCESS] Resume optimized, job applied!";
    }
};`;

  // Message switching
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Code typing animation
  useEffect(() => {
    let i = 0;
    setTypedCode("");
    const typingInterval = setInterval(() => {
      if (i < codeSnippet.length) {
        setTypedCode((prev) => prev + codeSnippet[i]);
        i++;
      } else {
        setTimeout(() => {
          setTypedCode("");
          i = 0;
        }, 1500);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  // Parallax movement for background
  useEffect(() => {
    const wrapper = document.querySelector(".home-wrapper");
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      wrapper.style.setProperty("--bgX", `${x}px`);
      wrapper.style.setProperty("--bgY", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="home-wrapper">
      {/* 🔮 Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <motion.h1
            className="gradient-heading"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Nipun AI
          </motion.h1>
        </div>

        <div className="nav-links">
          <motion.button
            onClick={() => navigate("/login")}
            className="nav-button"
            whileHover={{ scale: 1.1 }}
          >
            Login
          </motion.button>
          <motion.button
            onClick={() => navigate("/signup")}
            className="nav-button filled"
            whileHover={{ scale: 1.1 }}
          >
            Signup
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="tagline">
            PRACTISE CODING | PREPARE FOR INTERVIEWS | APPLY TO JOBS
          </p>
          <h1>
            NIPUN AI <br />
            <span className="highlight">YOUR SETU FROM LEARNING TO EARNING</span>
          </h1>
          <p className="subtext">
            Nipun AI helps you master coding, prepare for technical & HR
            interviews, and apply for jobs — all in one place. Harness the power
            of AI to grow your career effortlessly.
          </p>

          <motion.button
            onClick={() => navigate("/signup")}
            className="cta-btn"
            whileHover={{ scale: 1.05 }}
          >
            Start Your Learning Journey
          </motion.button>

          <div className="stats">
            <motion.div whileHover={{ scale: 1.1 }}>
              <h3>2+</h3>
              <p>Programming Languages</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <h3>HR & TECH</h3>
              <p>Mock Interviews</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <h3>SMART APPLY</h3>
              <p>Job Applications</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Code Animation Section */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="animated-text-above">
            <motion.span
              key={index}
              className="animated-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {messages[index]}
            </motion.span>
          </div>
          <div className="code-box">
            <div className="code-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="filename">NipunAI.cpp</span>
              <span className="live">● Live Coding</span>
            </div>
            <pre className="code-content">{typedCode}</pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
