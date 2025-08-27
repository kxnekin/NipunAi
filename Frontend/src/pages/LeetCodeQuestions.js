// src/pages/LeetCodeQuestions.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/fundamentals.css";

const LeetCodeQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch from backend when page loads
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leetcode-questions");
        if (!res.ok) throw new Error("Failed to fetch questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>⏳ Loading questions...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>❌ {error}</div>;
  if (!questions || questions.length === 0)
    return <div style={{ padding: "20px" }}>❌ No questions available</div>;

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
              navigate(`/coding/playground/${q.titleSlug}`, { state: q })
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
