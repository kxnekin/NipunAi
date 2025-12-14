import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/JobsPage.css"; // Make sure this points to the new CSS file below
import { useNavigate } from "react-router-dom";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/jobs")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleApplyClick = (jobId) => {
    alert(`Applying for Job ID: ${jobId}. Feature currently disabled.`);
    // In a real application, you'd navigate or open a modal for the application process
    // navigate(`/apply/${jobId}`);
  };

  return (
    <div className="jobs-dashboard-content"> {/* Changed container class */}
      <div className="jobs-page-header">
        <h1>Explore Exciting Job Opportunities</h1>
        <p>Your next career move awaits. Discover roles that fit your skills and aspirations.</p>
      </div>

      {loading ? (
        <p className="loading-message">Loading amazing jobs...</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card-beautiful"> {/* Changed card class */}
              <div className="job-card-header-beautiful">
                <h3 className="job-title-beautiful">{job.title}</h3>
                <span className="job-location-beautiful">{job.location}</span>
              </div>
              <p className="job-company-beautiful">{job.company}</p>
              <div className="job-details-beautiful">
                <p><strong>CTC:</strong> {job.ctc}</p>
                <p className="job-description-beautiful">{job.description}</p>
                <p><strong>Skills:</strong> {job.skills || "Not specified"}</p>
              </div>
              <button
                className="job-apply-button-beautiful"
                onClick={() => handleApplyClick(job._id)}
              >
                Apply Now ✨
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobsPage;