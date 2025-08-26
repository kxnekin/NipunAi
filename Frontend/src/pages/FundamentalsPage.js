import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/fundamentals.css";
import { fundamentalQuestions } from "./data/questions";

const FundamentalsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="fundamentals-wrapper">
      <h1>📘 Fundamental DSA Questions</h1>
      <p>These are must-solve questions for every coding interview.</p>

      <div className="questions-list">
        {fundamentalQuestions.map((q) => (
          <div
            key={q.id}
            className="question-item"
            onClick={() => navigate(`/coding-playground/${q.id}`)}
          >
            {q.id}. {q.title}.
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundamentalsPage;
