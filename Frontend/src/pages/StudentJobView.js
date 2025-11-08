import React, { useEffect, useState } from "react";
import axios from "axios";
// import "../styles/StudentJobView.css"

const StudentJobView = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleEasyApply = async (jobId) => {
    try {
      const studentEmail = localStorage.getItem("studentEmail");
      if (!studentEmail) return alert("Please login again!");

      const res = await axios.post("http://localhost:5000/api/applications", {
        jobId,
        studentEmail,
      });

      setAppliedJobs((prev) => new Set([...prev, jobId]));
      alert("✅ " + res.data.message);
    } catch (error) {
      if (error.response?.status === 409) {
        alert("You already applied!");
      } else if (error.response?.status === 400) {
        alert("Upload resume first!");
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="job-wrapper">
      <h1 className="job-title">🚀 Job Opportunities</h1>
      <p className="job-subtitle">
        Browse and apply using your resume
      </p>

      {loading ? (
        <p className="loading-text">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="no-jobs">No jobs available right now!</p>
      ) : (
        <div className="job-grid scrollable">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h2>{job.title}</h2>
                <span className="company">{job.company}</span>
              </div>

              <div className="job-info">
                <p><span>💰 CTC:</span> {job.ctc}</p>
                <p><span>📍 Location:</span> {job.location || "Remote"}</p>
                {job.eligibility && <p><span>🎓 Eligibility:</span> {job.eligibility}</p>}
                {job.deadline && <p><span>⏰ Deadline:</span> {new Date(job.deadline).toLocaleDateString()}</p>}
              </div>

              <p className="job-desc">{job.description}</p>

              <button
                className={`apply-btn ${appliedJobs.has(job._id) ? "applied" : ""}`}
                onClick={() => handleEasyApply(job._id)}
                disabled={appliedJobs.has(job._id)}
              >
                {appliedJobs.has(job._id) ? "✅ Applied" : "⚡ Easy Apply"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentJobView;
