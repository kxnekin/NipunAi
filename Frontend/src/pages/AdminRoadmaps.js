import React, { useState, useEffect } from "react";
import axios from "axios";
// Assuming you have a CSS file for styling
import "../styles/AdminRoadmap.css"; 

function AdminRoadmaps() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all roadmaps from your GET / endpoint
  const fetchRoadmaps = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/roadmaps");
      setRoadmaps(res.data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  // Run fetchRoadmaps once when the component mounts
  useEffect(() => {
    fetchRoadmaps();
  }, []);

  // 2. Handle the file upload to your POST / endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("⚠ Please select a PDF");

    // Use FormData to send a file and text
    const formData = new FormData();
    formData.append("title", title); // Matches req.body.title
    formData.append("file", file);   // Matches upload.single("file")

    try {
      setLoading(true);
      // POST to the API
      await axios.post("http://localhost:5000/api/roadmaps", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Upload successful!");
      setTitle("");
      setFile(null);
      // Clear the file input visually
      e.target.reset(); 
      // Refresh the list
      fetchRoadmaps(); 
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle deleting a roadmap from your DELETE /:id endpoint
  const deleteRoadmap = async (id) => {
    if (!window.confirm("🗑 Delete this roadmap permanently?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/roadmaps/${id}`);
      
      // Update UI optimistically by filtering the deleted item
      setRoadmaps(roadmaps.filter((item) => item._id !== id));
      alert("✅ Deleted Successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ Delete failed!");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">🎯 Roadmap Manager</h2>

      {/* Upload Card */}
      <div className="upload-card">
        <h3>Upload New Roadmap PDF</h3>
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
        <h3>Uploaded Roadmaps</h3>

        {roadmaps.length === 0 ? (
          <p className="empty-text">No Roadmaps uploaded yet.</p>
        ) : (
          <ul className="roadmap-list">
            {roadmaps.map((map) => (
              <li key={map._id} className="roadmap-row">
                <span className="pdf-title">📘 {map.title}</span>

                <div className="action-buttons">
                  <a
                    // This creates the correct URL based on your server settings
                    href={`http://localhost:5000${map.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    View
                  </a>

                  <button
                    className="delete-btn"
                    onClick={() => deleteRoadmap(map._id)}
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

export default AdminRoadmaps;