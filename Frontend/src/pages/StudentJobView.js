import React, { useEffect, useState } from "react";
import axios from "axios";
// ✅ Import the new, beautiful CSS file
import "../styles/StudentJobView.css"; 

const StudentJobView = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // This logic is all correct (no changes needed)
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

  // This logic is all correct (no changes needed)
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

  // The return() is updated with new "beautiful" class names
  return (
    <div className="jobs-dashboard-content"> {/* Changed container class */}
      <div className="jobs-page-header">
        <h1>🚀 Job Opportunities</h1>
        <p>Browse and apply using your resume</p>
      </div>

      {loading ? (
        <p className="loading-message">Loading amazing jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="loading-message">No jobs available right now!</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card-beautiful"> {/* Changed card class */}
              <div className="job-card-header-beautiful">
                <h3 className="job-title-beautiful">{job.title}</h3>
                <span className="job-location-beautiful">
                  {job.location || "Remote"}
                </span>
              </div>
              <p className="job-company-beautiful">{job.company}</p>

              <div className="job-details-beautiful">
                <p>
                  <strong>💰 CTC:</strong> {job.ctc}
                </p>
                {job.eligibility && (
                  <p>
                    <strong>🎓 Eligibility:</strong> {job.eligibility}
                  </p>
                )}
                {job.deadline && (
                  <p>
                    <strong>⏰ Deadline:</strong>{" "}
                    {new Date(job.deadline).toLocaleDateString()}
                  </p>
                )}
                <p className="job-description-beautiful">{job.description}</p>
              </div>

              <button
                // Use the new class, but keep all your logic
                className={`job-apply-button-beautiful ${
                  appliedJobs.has(job._id) ? "applied" : ""
                }`}
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