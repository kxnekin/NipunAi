// src/pages/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import '../styles/StudentDashboard.css';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '💼',
    title: 'Job Apply',
    description: 'Find and apply for jobs',
    key: 'job',
  },
  {
    icon: '💻',
    title: 'Coding Practice',
    description: 'Improve coding with guided practice',
    key: 'coding',
  },
  {
    icon: '🧠',
    title: 'AI Interview Prep',
    description: 'Prepare for interviews with AI tools',
    key: 'interview',
  },
];

function StudentDashboard() {
  const [student, setStudent] = useState({
    name: 'Student',
    usn: 'Not Available',
    branch: 'Computer Science',
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('studentName');
    const email = localStorage.getItem('studentEmail');
    const usn = localStorage.getItem('studentUSN');
    const branch = localStorage.getItem('studentBranch');

    setStudent(prev => ({
      ...prev,
      name: name || 'Student',
      usn: usn || email || 'Not Available',
      branch: branch || 'Computer Science',
    }));
  }, []);

  const handleExplore = (key) => {
    if (key === 'job') navigate('/jobs');
    else alert('Feature under development!');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileOptionClick = (option) => {
    switch (option) {
      case 'upload':
        alert('Upload Resume clicked!');
        break;
      case 'view':
        alert('View Profile clicked!');
        break;
      case 'edit':
        alert('Edit Profile clicked!');
        break;
      case 'logout':
        alert('Logout clicked!');
        break;
      default:
        break;
    }
    setShowProfileMenu(false);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-icon">🏠</div>

        <div className="sidebar-icon profile-icon-wrapper" onClick={toggleProfileMenu}>
          👤
          {showProfileMenu && (
            <div className="profile-menu">
              <div onClick={() => handleProfileOptionClick('upload')}>📄 Upload Resume</div>

              <div onClick={() => handleProfileOptionClick('logout')}>🚪 Logout</div>
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
            <p>{student.usn}</p>
            <p>{student.branch}</p>
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat">
              <h3>5</h3>
              <p>Applied Jobs</p>
            </div>
            <div className="stat">
              <h3>2</h3>
              <p>Tests Given</p>
            </div>
            <div className="stat">
              <h3>1</h3>
              <p>Interview Calls</p>
            </div>
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
