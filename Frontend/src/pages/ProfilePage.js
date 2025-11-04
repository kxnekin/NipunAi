import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, UploadCloud, Briefcase, FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    branch: "",
    usn: "",
  });
  const [resume, setResume] = useState(null);
  const [workExp, setWorkExp] = useState([{ company: "", role: "", description: "" }]);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    const email = localStorage.getItem("studentEmail");
    const branch = localStorage.getItem("studentBranch");
    const usn = localStorage.getItem("studentUSN");

    setStudent({
      name: name || "Not Available",
      email: email || "Not Available",
      branch: branch || "Not Available",
      usn: usn || "Not Available",
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
          setResume(URL.createObjectURL(blob));
        })
        .catch(() => console.log("No resume found."));

      axios
        .get(`http://localhost:5000/api/workexp?email=${email}`)
        .then((res) => {
          if (res.data && res.data.length > 0) setWorkExp(res.data);
        })
        .catch(() => console.log("No work experience found."));
    }
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const email = student.email;
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
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading resume.");
    }
  };

  const handleWorkExpChange = (index, field, value) => {
    const updated = [...workExp];
    updated[index][field] = value;
    setWorkExp(updated);
  };

  const addExperience = () => {
    setWorkExp([...workExp, { company: "", role: "", description: "" }]);
  };

  // ✅ Updated deleteExperience function (auto-saves changes)
  const deleteExperience = async (index) => {
    const updated = workExp.filter((_, i) => i !== index);
    setWorkExp(updated);

    const email = student.email;
    if (!email) {
      alert("You must be logged in to delete work experience.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/workexp/save", {
        email,
        experiences: updated,
      });
      alert("🗑️ Work experience deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting work experience.");
    }
  };

  const saveWorkExperience = async () => {
    const email = student.email;
    if (!email) {
      alert("You must be logged in to save work experience.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/workexp/save", {
        email,
        experiences: workExp,
      });
      alert("✅ Work experience saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving work experience.");
    }
  };

  return (
    <div className="profile-wrapper">
      <button className="back-button" onClick={() => navigate("/student-dashboard")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your personal details, resume, and work experience.</p>
      </div>

      {/* --- NEW LAYOUT GRID WRAPPER --- */}
      <div className="profile-layout-grid">
        
        {/* --- Student Info (Grid Item 1) --- */}
        <div className="profile-card">
          <FileText size={32} className="profile-icon" />
          <h2>Student Information</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Branch:</strong> {student.branch}</p>
            <p><strong>USN:</strong> {student.usn}</p>
          </div>
        </div>

        {/* --- Resume Section (Grid Item 2) --- */}
        <div className="profile-card">
          <UploadCloud size={32} className="profile-icon" />
          <h2>Resume Upload</h2>
          {/* REMOVED style={{ color: "white" }} */}
          <label htmlFor="resumeUpload" className="file-upload-label">
            <UploadCloud size={20} />
            <span>Click to select your resume (PDF)</span>
          </label>
          <input
            type="file"
            id="resumeUpload"
            style={{ display: "none" }}
            accept="application/pdf"
            onChange={handleResumeUpload}
          />
          {resume && (
            <a href={resume} target="_blank" rel="noopener noreferrer" className="resume-link">
              View Uploaded Resume
            </a>
          )}
        </div>

        {/* --- Work Experience Section (Grid Item 3 - Full Width) --- */}
        {/* ADDED class "profile-card-full-width" */}
        <div className="profile-card profile-card-full-width">
          <Briefcase size={32} className="profile-icon" />
          <h2>Work Experience</h2>

          {workExp.map((exp, index) => (
            <div key={index} className="work-exp-card">
              <div className="work-exp-header">
                <h4>Experience {index + 1}</h4>
                <button
                  className="delete-btn"
                  onClick={() => deleteExperience(index)}
                  title="Delete this experience"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Company Name"
                value={exp.company}
                onChange={(e) => handleWorkExpChange(index, "company", e.target.value)}
              />
              <input
                type="text"
                placeholder="Job Role"
                value={exp.role}
                onChange={(e) => handleWorkExpChange(index, "role", e.target.value)}
              />
              <textarea
                placeholder="Describe your experience..."
                value={exp.description}
                onChange={(e) => handleWorkExpChange(index, "description", e.target.value)}
              ></textarea>
            </div>
          ))}

          <div className="work-exp-actions">
            <button className="add-btn" onClick={addExperience}>+ Add Experience</button>
            <button className="save-btn" onClick={saveWorkExperience}>💾 Save</button>
          </div>
        </div>
      </div> {/* --- End of profile-layout-grid --- */}
    </div>
  );
}

export default ProfilePage;