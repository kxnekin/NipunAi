import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Briefcase,
  Code,
  Mic,
  User,
  Settings,
  LogOut,
  Upload,
  View,
  ScanSearch,
} from "lucide-react";
import "../styles/StudentDashboard.css";

const features = [
  {
    icon: <Briefcase size={40} className="feature-icon-inner" />,
    title: "Job Apply",
    description: "Find and apply for jobs",
    key: "job",
  },
  {
    icon: <Code size={40} className="feature-icon-inner" />,
    title: "Coding and Resources",
    description: "Sharpen coding skills",
    key: "coding",
  },
  {
    icon: <Mic size={40} className="feature-icon-inner" />,
    title: "AI Interview Prep",
    description: "Practice mock interviews with AI",
    key: "interview",
  },
];

const sidebarNavItems = [
  {
    icon: <LayoutDashboard size={24} />,
    label: "Dashboard",
    key: "dashboard",
  },
  {
    icon: <ScanSearch size={24} />,
    label: "Resume Optimizer",
    key: "optimizer",
  },
  {
    icon: <User size={24} />,
    label: "Profile",
    key: "profile",
  },
  {
    icon: <Settings size={24} />,
    label: "Settings",
    key: "settings",
  },
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
  const [activeNav, setActiveNav] = useState("dashboard");

  const navigate = useNavigate();

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
          const blob = new Blob([res.data], {
            type: res.headers["content-type"],
          });
          const fileUrl = URL.createObjectURL(blob);
          setResume(fileUrl);
          localStorage.setItem("studentResume", fileUrl);
        })
        .catch(() => console.log("No resume found for user."));
    }
  }, []);

  const handleFeatureExplore = (key) => {
    if (key === "job") navigate("/jobs");
    else if (key === "coding") navigate("/coding");
    else if (key === "interview") navigate("/interview");
    else alert("Feature under development!");
  };

  const handleSidebarNav = (key) => {
    setActiveNav(key);
    if (key === "dashboard") navigate("/student-dashboard");
    else if (key === "optimizer") navigate("/resume-optimizer");
    else if (key === "profile") navigate("/profile");
    else if (key === "settings") alert("Settings page under development!");
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

  return (
    <div className="dashboard-wrapper">
      <input
        type="file"
        id="resumeUpload"
        style={{ display: "none" }}
        onChange={handleResumeUpload}
        accept="application/pdf"
      />

      {/* ========== Sidebar ========== */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>MIND MATES</h2>
        </div>
        <div className="sidebar-nav">
          {sidebarNavItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar-nav-item ${
                activeNav === item.key ? "active" : ""
              }`}
              onClick={() => handleSidebarNav(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========== Dashboard Main ========== */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-welcome">
            <h1>Welcome back, {student.name}!</h1>
            <p>Here's what's new for you today.</p>
          </div>

          <div className="header-profile">
            <div className="profile-icon-wrapper" onClick={toggleProfileMenu}>
              <User size={24} />
            </div>

            {showProfileMenu && (
              <div className="profile-menu">
                <div
                  className="profile-menu-item"
                  onClick={() => handleProfileOptionClick("upload")}
                >
                  <Upload size={16} />
                  <span>Upload Resume</span>
                </div>
                <div
                  className="profile-menu-item"
                  onClick={() => handleProfileOptionClick("view")}
                >
                  <View size={16} />
                  <span>View Resume</span>
                </div>
                <div
                  className="profile-menu-item logout"
                  onClick={() => handleProfileOptionClick("logout")}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========== Dashboard Content ========== */}
        <div className="dashboard-content">
          <div className="content-grid">
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-card-avatar">
                  <User size={32} />
                </div>
                <div className="profile-card-info">
                  <h2>{student.name}</h2>
                  <p>{student.email}</p>
                </div>
              </div>
              <div className="profile-card-details">
                <p>
                  <b>USN:</b> {student.usn}
                </p>
                <p>
                  <b>Branch:</b> {student.branch}
                </p>
                <div className="profile-card-resume">
                  {resume ? (
                    <a href={resume} target="_blank" rel="noopener noreferrer">
                      View Uploaded Resume
                    </a>
                  ) : (
                    <p>No resume uploaded</p>
                  )}
                </div>
              </div>
            </div>

            <div className="placeholder-card">
              <h3>My Activity</h3>
              <p>Your recent job applications will appear here.</p>
            </div>
          </div>

          {/* ======= Features ======= */}
          <h2 className="features-title">Explore Features</h2>
          <div className="features">
            {features.map((feature, idx) => (
              <div className="feature" key={idx}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <button
                  className="feature-button"
                  onClick={() => handleFeatureExplore(feature.key)}
                >
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
