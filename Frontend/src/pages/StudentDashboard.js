// src/pages/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import "../styles/StudentDashboard.css";

const features = [
  {
    icon: '💼',
    title: 'One-click Job Apply',
    description: 'Apply instantly to campus jobs using your uploaded resume.',
  },
  {
    icon: '🧠',
    title: 'AI-Powered Interview Prep',
    description: 'Train for HR & personal interviews with our smart AI assistant.',
  },
  {
    icon: '💻',
    title: 'Coding Platform',
    description: 'Practice coding and get instant feedback & improvement tips.',
  },
  {
    icon: '📊',
    title: 'Personalised Dashboard',
    description: 'Track your placement progress with real-time stats.',
  },
];

function StudentDashboard() {
  const [student, setStudent] = useState({
    name: 'Student',
    usn: 'Not Available',
    branch: 'Computer Science',
    profilePic: 'https://via.placeholder.com/100',
  });

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    const email = localStorage.getItem('studentEmail');

    setStudent(prev => ({
      ...prev,
      name: name || 'Student',
      usn: email || 'Not Available',
    }));
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">Nipun AI</div>
        <ul className="nav-links">
          <li><a href="#apply">Job Apply</a></li>
          <li><a href="#interview">Interview Prep</a></li>
          <li><a href="#coding">Coding</a></li>
          <li><a href="#dashboard">Dashboard</a></li>
        </ul>
      </nav>

      <div className="dashboard-container">
        {/* Profile Section */}
        <div className="profile-section">
          <img
            src={student.profilePic}
            alt={`${student.name}'s profile`}
            className="profile-pic"
          />
          <div className="profile-info">
            <h2>Welcome, {student.name}!</h2>
            <p><strong>Email (USN):</strong> {student.usn}</p>
            <p><strong>Branch:</strong> {student.branch}</p>
          </div>
        </div>

        <h1 className="dashboard-title">Your Dashboard</h1>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-description">{feature.description}</p>
              <button className="explore-button">Explore</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
