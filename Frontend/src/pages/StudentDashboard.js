import React, { useEffect, useState } from "react";
import "../styles/StudentDashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const features = [
  { icon: "💼", title: "Job Apply", description: "Find and apply for jobs", key: "job" },
  { icon: "💻", title: "Coding and resources", description: "Sharpen coding skills", key: "coding" },
  { icon: "🧠", title: "AI Interview Prep", description: "Practice mock interviews with AI", key: "interview" },
];

function StudentDashboard() {
  const [student, setStudent] = useState({
    name: "Student",
    usn: "Not Available",
    branch: "Computer Science",
    email: "",
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [resume, setResume] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch student info + resume
  useEffect(() => {
    const name = localStorage.getItem("studentName");
    const email = localStorage.getItem("studentEmail");
    const usn = localStorage.getItem("studentUSN");
    const branch = localStorage.getItem("studentBranch");

    setStudent({
      name: name || "Student",
      usn: usn || "Not Available",
      email: email || "Not Available",
      branch: branch || "Computer Science",
    });

    if (email) {
      axios
        .get("http://localhost:5000/api/resume", {
          headers: { "user-email": email },
          responseType: "arraybuffer",
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: res.headers["content-type"] });
          const fileUrl = URL.createObjectURL(blob);
          setResume(fileUrl);
          localStorage.setItem("studentResume", fileUrl);
        })
        .catch(() => {}); // No resume yet
    }

    // ✅ Fetch latest announcements from backend (admin posted)
    axios
      .get("http://localhost:5000/api/announcements")
      .then((res) => setAnnouncements(res.data || []))
      .catch(() => setAnnouncements([]));
  }, []);

  const handleExplore = (key) => {
    if (key === "job") navigate("/student-jobs");
    else if (key === "coding") navigate("/coding");
    else if (key === "interview") navigate("/mock-interview");
    else alert("Feature under development!");
  };

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleProfileOptionClick = (option) => {
    switch (option) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        localStorage.clear();
        navigate("/login");
        break;
      default:
        break;
    }
    setShowProfileMenu(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const email = localStorage.getItem("studentEmail");
    if (!email) {
      alert("You must be logged in to upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post("http://localhost:5000/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "user-email": email,
        },
      });

      alert("✅ Resume uploaded successfully!");

      const res = await axios.get("http://localhost:5000/api/resume", {
        headers: { "user-email": email },
        responseType: "arraybuffer",
      });
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const fileUrl = URL.createObjectURL(blob);
      setResume(fileUrl);
      localStorage.setItem("studentResume", fileUrl);
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading resume.");
    }
  };

  const isSidebarItemActive = (path) => {
    const homePath = "/student-dashboard";
    if (path === homePath) {
      return location.pathname === homePath || location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <div className="dashboard-wrapper">
      <input
        type="file"
        id="resumeUpload"
        style={{ display: "none" }}
        onChange={handleResumeUpload}
        accept="application/pdf"
      />

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>Dashboard</h2>
        </div>
        <div className="sidebar-nav">
          <div
            className={`sidebar-nav-item ${isSidebarItemActive("/student-dashboard") ? "active" : ""}`}
            onClick={() => navigate("/student-dashboard")}
          >
            <span>🏠</span>
            <span>Home</span>
          </div>
          <div
            className={`sidebar-nav-item ${isSidebarItemActive("/my-applications") ? "active" : ""}`}
            onClick={() => navigate("/my-applications")}
          >
            <span>📋</span>
            <span>My Applications</span>
          </div>
          <div
            className={`sidebar-nav-item ${isSidebarItemActive("/resume-optimiser") ? "active" : ""}`}
            onClick={() => navigate("/resume-optimiser")}
          >
            <span>✨</span>
            <span>Resume Optimiser</span>
          </div>
          <div
            className={`sidebar-nav-item ${isSidebarItemActive("/profile") ? "active" : ""}`}
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            <span>Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-welcome">
            <h1>Welcome back, {student.name}!</h1>
            <p>Here’s your overview and the latest updates.</p>
          </div>
          <div className="header-profile">
            <div className="profile-icon-wrapper" onClick={toggleProfileMenu}>
              👤
              {showProfileMenu && (
                <div className="profile-menu">
                  <div className="profile-menu-item" onClick={() => handleProfileOptionClick("profile")}>
                    👤 Profile
                  </div>
                  <div className="profile-menu-item logout" onClick={() => handleProfileOptionClick("logout")}>
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="content-grid swapped-layout">
            {/* Left Side — Announcements */}
            <div className="announcement-card">
              <h3>📢 Important Announcements</h3>
              {announcements.length === 0 ? (
                <p>No new announcements right now.</p>
              ) : (
                <ul>
                  {announcements.map((a, i) => (
                    <li key={i}>
                      <strong>{a.title}</strong>
                      <p>{a.message}</p>
                      <span className="date">{new Date(a.createdAt).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Right Side — Profile */}
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-avatar">👤</div>
                <div className="profile-card-info">
                  <h2>{student.name}</h2>
                  <p>{student.email}</p>
                </div>
              </div>
              <div className="profile-card-details">
                <p><b>USN:</b> {student.usn}</p>
                <p><b>Branch:</b> {student.branch}</p>
              </div>
              <div className="profile-card-resume">
                {resume ? (
                  <a href={resume} target="_blank" rel="noopener noreferrer">
                    📄 View Uploaded Resume
                  </a>
                ) : (
                  <p>No resume uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <h2 className="features-title">Explore Features</h2>
          <div className="features">
            {features.map((feature, idx) => (
              <div className="feature" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button className="feature-button" onClick={() => handleExplore(feature.key)}>
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
