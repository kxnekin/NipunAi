// src/pages/LeetCodeQuestions.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/fundamentals.css"; // ✅ make sure this file has your CSS

const LeetCodeQuestions = ({ questions = [] }) => {
  const navigate = useNavigate();

  if (!questions || questions.length === 0) {
    return <div style={{ padding: "20px" }}>❌ No questions available</div>;
  }

  return (
    <div className="fundamentals-wrapper">
      <h1>LeetCode Questions</h1>
      <p>Select a question to start solving in the playground</p>

      <div className="questions-list">
        {questions.map((q) => (
          <div
            key={q.questionFrontendId}
            className="question-item"
            onClick={() =>
              navigate(`/coding/leetcode/${q.titleSlug}`, { state: q })
            }
          >
            <h3>
              {q.questionFrontendId}. {q.title}
            </h3>
            <p>
              <b>Difficulty:</b> {q.difficulty}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeetCodeQuestions;
