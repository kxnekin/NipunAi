import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/JobsPage.css"; // Make sure you have this CSS file

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // The state for handling applications has been removed.

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => {
        setJobs(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch jobs", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // The handleApply function has been removed.
  // A simple placeholder function is used instead.
  const handlePlaceholderClick = () => {
    alert("Application feature is currently disabled.");
  };

  return (
    <div className="jobs-page-container">
      <h1 className="job-heading">Availabl</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="job-list-scroll">
          <ul className="job-list">
            {jobs.map((job) => (
              <li key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>CTC:</strong> {job.ctc}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Skills:</strong> {job.skills || 'Not specified'}</p>
                
                {/* The button is now simplified and doesn't track any state */}
                <button
                  className="apply-button"
                  onClick={handlePlaceholderClick}
                >
                  Apply 
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default JobsPage;