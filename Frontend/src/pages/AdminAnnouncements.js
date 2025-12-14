import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react"; // ✅ Delete icon
import "../styles/AdminAnnouncements.css";

function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please fill in both fields before posting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/announcements", {
        title,
        message,
      });

      alert("✅ Announcement posted successfully!");
      setTitle("");
      setMessage("");
      fetchAnnouncements();
    } catch (err) {
      console.error("Error posting announcement:", err);
      alert("❌ Failed to post announcement.");
    }
  };

  // ✅ Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      alert("🗑️ Announcement deleted!");
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert("❌ Failed to delete announcement.");
    }
  };

  return (
    <div className="admin-announcements">
      <h1>📢 Post New Announcement</h1>

      <form onSubmit={handleSubmit} className="announcement-form">
        <input
          type="text"
          placeholder="Enter announcement title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Type your message here..."
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit">🚀 Announce</button>
      </form>

      <h2>📋 Previous Announcements</h2>
      <div className="announcements-list">
        {announcements.length === 0 ? (
          <p>No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a._id} className="announcement-item">
              <div className="announcement-header">
                <h3>{a.title}</h3>
                {/* ✅ Delete Button */}
                <Trash2
                  className="delete-icon"
                  size={20}
                  onClick={() => handleDelete(a._id)}
                />
              </div>
              <p>{a.message}</p>
              <small>{new Date(a.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminAnnouncements;
