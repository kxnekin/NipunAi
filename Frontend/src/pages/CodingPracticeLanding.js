import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CodingPractice.css";

function CodingPracticeLanding() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="coding-landing-wrapper">
      <h1 className="main-title">Coding Practice</h1>
      <p>Choose an option below:</p>

      <div className="options">
        {/* Fundamental Questions */}
        <div
          className="option-card"
          onClick={() => handleNavigation("/coding/fundamentals")}
        >
          📚
          <h2>Fundamental Questions</h2>
          <p>
            Practice from curated coding questions (Top 50 LeetCode + Admin
            posted)
          </p>
        </div>

        {/* Coding Playground */}
       <div
        className="option-card"
        onClick={() => handleNavigation("/coding/leetcode")}
      >
        💻
      <h2>Coding Playground</h2>
      <p>Pick a problem and solve it with a live coding editor</p>
      </div>

        {/* Admin Roadmaps */}
        <div
          className="option-card"
          onClick={() => handleNavigation("/coding/admin-roadmaps")}
        >
          🗺️
          <h2>Admin Roadmaps</h2>
          <p>Follow structured learning paths created by your admin</p>
        </div>

        {/* Core Subjects */}
        <div
          className="option-card"
          onClick={() => handleNavigation("/coding/core-subjects")}
        >
          📖
          <h2>Core Subjects</h2>
          <p>
            Learn CN, DBMS, OS, and other non-coding subjects with admin
            resources
          </p>
        </div>

        {/* Company-wise Resources */}
        <div
          className="option-card"
          onClick={() => handleNavigation("/coding/company-resources")}
        >
          🏢
          <h2>Company-wise Resources</h2>
          <p>
            Interview resources & questions sorted by company (added by Admin)
          </p>
        </div>
      </div>
    </div>
  );
}

export default CodingPracticeLanding;
