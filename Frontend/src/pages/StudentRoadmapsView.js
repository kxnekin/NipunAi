/* Updated: studentroadmapview.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/StudentRoadmapsView.css";

function StudentRoadmapsView() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/roadmaps");
        setRoadmaps(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch roadmaps:", err);
        setError("Failed to load roadmaps. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div className="roadmap-view-container">
        <p className="loading-text">Loading roadmaps...</p>
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
      <h2 className="page-title">🗺️ Available Roadmaps</h2>
      <p>Follow these structured learning paths to guide your preparation.</p>

      {roadmaps.length === 0 ? (
        <p>No roadmaps have been uploaded by the admin yet.</p>
      ) : (
        <div className="roadmap-list">
          {roadmaps.map((roadmap) => (
            <div className="roadmap-card" key={roadmap._id}>
              <h3>📘 {roadmap.title}</h3>
              <a
                // --- THIS IS THE FIX ---
                // 1. Changed roadmap.filePath to roadmap.fileUrl
                // 2. Removed the extra "/uploads/" since fileUrl already has it
                href={`http://localhost:5000${roadmap.fileUrl}`}
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

export default StudentRoadmapsView;