import React, { useEffect, useState } from "react";
import "../styles/JobsPage.css";

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="jobs-page-container">
      <h1 className="job-heading">Available Job Opportunities</h1>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="job-list-scroll">
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
        </div>
      )}
    </div>
  );
}

export default JobsPage;
