import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminStudents.css";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students");
      setStudents(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
    }
  };

  // ✅ Filter students by name (case-insensitive)
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-students-wrapper">
      <h1>👥 Registered Students ({filteredStudents.length})</h1>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search student by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* 🧾 Student Cards */}
      <div className="student-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <div key={index} className="student-card">
              <div className="student-avatar">
                {student.name ? student.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="student-info">
                <h3>{student.name || "Unnamed"}</h3>
                <p>
                  <strong>Email:</strong> {student.email || "N/A"}
                </p>
                <p>
                  <strong>Branch:</strong> {student.branch || "N/A"}
                </p>
                <p>
                  <strong>USN:</strong> {student.usn || "N/A"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
