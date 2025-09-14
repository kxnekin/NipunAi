import React, { useState } from "react";
import axios from "axios";

function AdminRoadmaps() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF to upload");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/roadmaps", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Roadmap uploaded successfully!");
      setTitle("");
      setFile(null);
    } catch (err) {
      console.error("❌ Failed to upload roadmap:", err);
      alert("❌ Failed to upload roadmap");
    }
  };

  return (
    <div className="upload-roadmap-wrapper">
      <h2>🧭 Upload Roadmap</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          placeholder="Enter roadmap title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload PDF</button>
      </form>
    </div>
  );
}

export default AdminRoadmaps;
