/* File: frontend/src/pages/AdminCoreSubjects.js */

import React, { useState, useEffect } from "react";
import axios from "axios";
// You can create a new CSS file or reuse the old one
import "../styles/AdminRoadmap.css"; 

function AdminCoreSubjects() { // 1. CHANGED
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]); // 2. CHANGED
  const [loading, setLoading] = useState(false);

  // 1. Fetch all subjects
  const fetchSubjects = async () => { // 3. CHANGED
    try {
      // 4. CHANGED: API endpoint
      const res = await axios.get("http://localhost:5000/api/subjects"); 
      setSubjects(res.data); // 5. CHANGED
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSubjects(); // 6. CHANGED
  }, []);

  // 2. Handle the file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("⚠ Please select a PDF");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      setLoading(true);
      // 7. CHANGED: API endpoint
      await axios.post("http://localhost:5000/api/subjects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Upload successful!");
      setTitle("");
      setFile(null);
      e.target.reset(); 
      fetchSubjects(); // 8. CHANGED
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle deleting a subject
  const deleteSubject = async (id) => { // 9. CHANGED
    // 10. CHANGED: Confirm message
    if (!window.confirm("🗑 Delete this subject permanently?")) return;

    try {
      // 11. CHANGED: API endpoint
      await axios.delete(`http://localhost:5000/api/subjects/${id}`);
      
      // 12. CHANGED: Update state
      setSubjects(subjects.filter((item) => item._id !== id));
      alert("✅ Deleted Successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ Delete failed!");
    }
  };

  return (
    <div className="admin-container">
      {/* 13. CHANGED: Title */}
      <h2 className="admin-title">📚 Core Subject Manager</h2>

      {/* Upload Card */}
      <div className="upload-card">
        {/* 14. CHANGED: Title */}
        <h3>Upload New Subject PDF</h3>
        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
            required
          />
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
      </div>

      {/* List Card */}
      <div className="list-card">
        {/* 15. CHANGED: Title */}
        <h3>Uploaded Subjects</h3>

        {/* 16. CHANGED: State check */}
        {subjects.length === 0 ? (
          <p className="empty-text">No Subjects uploaded yet.</p>
        ) : (
          <ul className="roadmap-list">
            {/* 17. CHANGED: Map over subjects */}
            {subjects.map((map) => ( 
              <li key={map._id} className="roadmap-row">
                <span className="pdf-title">📘 {map.title}</span>

                <div className="action-buttons">
                  <a
                    href={`http://localhost:5000${map.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    View
                  </a>

                  <button
                    className="delete-btn"
                    // 18. CHANGED: Call deleteSubject
                    onClick={() => deleteSubject(map._id)} 
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminCoreSubjects; // 19. CHANGED