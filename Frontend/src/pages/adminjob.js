import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash2, FileDown } from "lucide-react";
import "../styles/AdminDashboard.css";

function AdminJob() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/profile/all")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/profile/delete/${email}`);
      setStudents(students.filter((s) => s.email !== email));
      alert("✅ Student deleted successfully!");
    } catch (err) {
      alert("❌ Failed to delete student.");
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-dashboard-header">
        <h1>👨‍💼 Admin Panel — Student Details</h1>
        <p>Manage all registered students and their resumes.</p>
      </div>

      <div className="admin-dashboard-content">
        {students.length === 0 ? (
          <p className="no-data">No students found.</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Branch</th>
                <th>Email</th>
                <th>USN</th>
                <th>Work Experience</th>
                <th>About</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => (
                <tr key={idx}>
                  <td>{s.name}</td>
                  <td>{s.branch}</td>
                  <td>{s.email}</td>
                  <td>{s.usn}</td>
                  <td>{s.workExperience || "—"}</td>
                  <td>{s.details || "—"}</td>
                  <td>
                    {s.resumeUrl ? (
                      <a
                        href={`http://localhost:5000/${s.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye size={18} /> View
                      </a>
                    ) : (
                      "No Resume"
                    )}
                  </td>
                  <td>
                    {s.resumeUrl && (
                      <a
                        href={`http://localhost:5000/${s.resumeUrl}`}
                        download
                        className="download-icon"
                      >
                        <FileDown size={18} />
                      </a>
                    )}
                    <button
                      className="delete-icon"
                      onClick={() => handleDelete(s.email)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminJob;
