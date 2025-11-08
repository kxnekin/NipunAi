import React, { useState, useEffect } from "react";
import axios from "axios";
// You can create a new CSS file or reuse the existing roadmap one
import "../styles/StudentRoadmapsView.css"; 

function StudentCoreSubjectsView() { // 1. CHANGED
  const [subjects, setSubjects] = useState([]); // 2. CHANGED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch subjects when the component mounts
    const fetchSubjects = async () => { // 3. CHANGED
      try {
        setLoading(true);
        // 4. CHANGED: API endpoint
        const res = await axios.get("http://localhost:5000/api/subjects");
        setSubjects(res.data); // 5. CHANGED
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch subjects:", err); // 6. CHANGED
        setError("Failed to load subjects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects(); // 7. CHANGED
  }, []); // The empty array means this effect runs once on mount

  // --- Render Logic ---

  if (loading) {
    return (
      <div className="roadmap-view-container">
        {/* 8. CHANGED: Text */}
        <p className="loading-text">Loading subjects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roadmap-view-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="roadmap-view-container">
      {/* 9. CHANGED: Titles */}
      <h2 className="page-title">📖 Core Subjects</h2>
      <p>Review these core subject resources to build a strong foundation.</p>

      {/* 10. CHANGED: State check and text */}
      {subjects.length === 0 ? (
        <p>No core subjects have been uploaded by the admin yet.</p>
      ) : (
        <div className="roadmap-list">
          {/* 11. CHANGED: Map over subjects */}
          {subjects.map((subject) => (
            <div className="roadmap-card" key={subject._id}>
              <h3>📘 {subject.title}</h3>
              <a
                // This link is built correctly from your API
                href={`http://localhost:5000${subject.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-pdf-link"
              >
                View PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCoreSubjectsView; // 12. CHANGED