/* File: frontend/src/pages/StudentCompanyResourcesView.js */

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/StudentRoadmapsView.css"; // Reusing the same CSS

function StudentCompanyResourcesView() { // 1. CHANGED
  const [resources, setResources] = useState([]); // 2. CHANGED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => { // 3. CHANGED
      try {
        setLoading(true);
        // 4. CHANGED: API endpoint
        const res = await axios.get("http://localhost:5000/api/company-resources");
        setResources(res.data); // 5. CHANGED
        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch resources:", err); // 6. CHANGED
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources(); // 7. CHANGED
  }, []); 

  if (loading) {
    return (
      <div className="roadmap-view-container">
        {/* 8. CHANGED: Text */}
        <p className="loading-text">Loading company resources...</p>
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
      <h2 className="page-title">🏢 Company-wise Resources</h2>
      <p>Company-specific preparation materials and interview questions.</p>

      {/* 10. CHANGED: State check and text */}
      {resources.length === 0 ? (
        <p>No company resources have been uploaded by the admin yet.</p>
      ) : (
        <div className="roadmap-list">
          {/* 11. CHANGED: Map over resources */}
          {resources.map((resource) => (
            <div className="roadmap-card" key={resource._id}>
              <h3>📘 {resource.title}</h3>
              <a
                href={`http://localhost:5000${resource.fileUrl}`}
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

export default StudentCompanyResourcesView; // 12. CHANGED