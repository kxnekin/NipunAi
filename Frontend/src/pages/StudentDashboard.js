import React, { useEffect, useState } from "react";
import "../styles/StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const features = [
  { icon: "💼", title: "Job Apply", description: "Find and apply for jobs", key: "job" },
  { icon: "💻", title: "Coding Practice", description: "Sharpen coding skills", key: "coding" },
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

  const navigate = useNavigate();

  // ✅ On page load → fetch student info + resume
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
        .catch(() => {}); // no resume uploaded yet
    }
  }, []);

  const handleExplore = (key) => {
    if (key === "job") navigate("/jobs");
    else if (key === "coding") navigate("/coding"); // ✅ added navigation
    else alert("Feature under development!");
  };

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleProfileOptionClick = (option) => {
    switch (option) {
      case "upload":
        document.getElementById("resumeUpload").click();
        break;
      case "view":
        if (resume) window.open(resume, "_blank");
        else alert("No resume uploaded!");
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

  // ✅ Resume upload handler
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

      // Fetch again to show latest resume
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

  return (
    <div className="dashboard-wrapper">
      {/* Hidden file input */}
      <input
        type="file"
        id="resumeUpload"
        style={{ display: "none" }}
        onChange={handleResumeUpload}
        accept="application/pdf"
      />

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-icon">🏠</div>

        <div className="sidebar-icon profile-icon-wrapper" onClick={toggleProfileMenu}>
          👤
          {showProfileMenu && (
            <div className="profile-menu">
              <div onClick={() => handleProfileOptionClick("upload")}>📄 Upload Resume</div>
              <div onClick={() => handleProfileOptionClick("view")}>👀 View Resume</div>
              <div onClick={() => handleProfileOptionClick("logout")}>🚪 Logout</div>
            </div>
          )}
        </div>

        <div className="sidebar-icon">📋</div>
        <div className="sidebar-icon">⚙️</div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">
        <h1 className="main-title">Student Dashboard</h1>

        <div className="top-section">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-icon">👤</div>
            <h2>{student.name}</h2>
            <p><b>USN:</b> {student.usn}</p>
            <p><b>Email:</b> {student.email}</p>
            <p><b>Branch:</b> {student.branch}</p>

            {/* ✅ Show Resume only as a link */}
            {resume ? (
              <a href={resume} target="_blank" rel="noopener noreferrer">
                📄ViewResume
              </a>
            ) : (
              <p>No resume uploaded</p>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="features">
          {features.map((feature, idx) => (
            <div className="feature" key={idx}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <button onClick={() => handleExplore(feature.key)}>Explore</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
