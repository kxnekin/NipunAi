import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-home-wrapper">
      <nav className="admin-navbar">
        <div className="admin-logo">🛠️ Admin Dashboard</div>
        <div className="admin-nav-links">
          <button onClick={() => navigate("/admin-dashboard/create")} className="admin-nav-button">
            Create Job Card
          </button>
          <button onClick={() => navigate("/admin-dashboard/view")} className="admin-nav-button">
            View Job Cards
          </button>
          <button onClick={() => navigate("/admin-dashboard/roadmaps")} className="admin-nav-button">
            Roadmaps
          </button>
        </div>
      </nav>

      <div className="admin-cards-container">
        <div className="admin-card" onClick={() => navigate("/admin-dashboard/create")}>
          <h2>➕ Add Job Card</h2>
          <p>Create and publish new job postings for users.</p>
        </div>

        <div className="admin-card" onClick={() => navigate("/admin-dashboard/view")}>
          <h2>📋 View Job Cards</h2>
          <p>View all existing job cards posted by admin.</p>
        </div>

        <div className="admin-card" onClick={() => navigate("/admin-dashboard/roadmaps")}>
          <h2>🧭 Roadmaps & Prep</h2>
          <p>Manage preparation resources and roadmaps for students.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
