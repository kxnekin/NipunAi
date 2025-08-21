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
            View Job Cards
          </button>
          <button onClick={() => navigate("/admin-dashboard/view")} className="admin-nav-button">
            View road maps
          </button>
          
          <button onClick={() => navigate("/admin-dashboard/fundamentals")} className="admin-nav-button">
            View CoreSub Resources
          </button>
          <button onClick={() => navigate("/admin-dashboard/core-subjects")} className="admin-nav-button">
            Viewcompany wise resources
          </button>
          
        </div>
      </nav>

      <div className="admin-cards-container">
        <div className="admin-card" onClick={() => navigate("/admin-dashboard/create")}>
          <h2>➕ Add Job Card</h2>
          <p>Create and publish new job postings for users.</p>
        </div>

       

        <div className="admin-card" onClick={() => navigate("/admin-dashboard/roadmaps")}>
          <h2>🧭 Roadmaps & Prep</h2>
          <p>Manage preparation resources and roadmaps for students.</p>
        </div>

        

        <div className="admin-card" onClick={() => navigate("/admin-dashboard/core-subjects")}>
          <h2>📖 Core Subjects</h2>
          <p>Upload resources for CN, DBMS, OS, SE, and more.</p>
        </div>

        <div className="admin-card" onClick={() => navigate("/admin-dashboard/company-resources")}>
          <h2>🏢 Company Resources</h2>
          <p>Post company-specific interview questions and prep guides.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
