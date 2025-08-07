// src/pages/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import "../styles/StudentDashboard.css";

const features = [
  {
    icon: '💼',
    title: 'One-click Job Apply',
    description: 'Apply instantly to campus jobs using your uploaded resume.',
    key: 'job',
  },
  {
    icon: '🧠',
    title: 'AI-Powered Interview Prep',
    description: 'Train for HR & personal interviews with our smart AI assistant.',
    key: 'interview',
  },
  {
    icon: '💻',
    title: 'Coding Platform',
    description: 'Practice coding and get instant feedback & improvement tips.',
    key: 'coding',
  },
  {
    icon: '📊',
    title: 'Personalised Dashboard',
    description: 'Track your placement progress with real-time stats.',
    key: 'dashboard',
  },
];

function StudentDashboard() {
  const [student, setStudent] = useState({
    name: 'Student',
    usn: 'Not Available',
    branch: 'Computer Science',
    profilePic: 'https://via.placeholder.com/100',
  });

  const [jobs, setJobs] = useState([]);
  const [showJobs, setShowJobs] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    const email = localStorage.getItem('studentEmail');

    setStudent(prev => ({
      ...prev,
      name: name || 'Student',
      usn: email || 'Not Available',
    }));

    // ✅ FIXED: Corrected fetch URL
    fetch("http://localhost:5000/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  const handleExplore = (key) => {
    if (key === 'job') {
      setShowJobs(true);
    } else {
      alert('Feature under development!');
    }
  };

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
              <button
                className="explore-button"
                onClick={() => handleExplore(feature.key)}
              >
                Explore
              </button>
            </div>
          ))}
        </div>

        {/* Jobs Section */}
        {showJobs && (
          <div className="jobs-section">
            <h2>Available Jobs</h2>
            {jobs.length === 0 ? (
              <p>No jobs posted yet by admin.</p>
            ) : (
              <ul className="job-list">
                {jobs.map((job, index) => (
                  <li key={index} className="job-card">
                    <h3>{job.title}</h3>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>CTC:</strong> {job.ctc}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Skills:</strong> {job.skills}</p>
                    <button className="apply-button">Apply Now</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
