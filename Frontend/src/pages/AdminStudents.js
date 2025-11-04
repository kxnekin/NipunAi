import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminStudents.css";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/students");
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // ✅ Filter by name (case-insensitive)
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-students-wrapper">
      <h1>👥 Registered Students ({filteredStudents.length})</h1>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search student by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="student-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student, index) => (
            <div key={index} className="student-card">
              <h3>{student.name}</h3>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Branch:</strong> {student.branch}</p>
              <p><strong>USN:</strong> {student.usn}</p>
            </div>
          ))
        ) : (
          <p>No students found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
