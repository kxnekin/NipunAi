import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("studentEmail");

  useEffect(() => {
    if (!email) {
      setError("Please log in to view your applications.");
      setLoading(false);
      return;
    }

    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications/student", {
          headers: { "user-email": email },
        });

        setApplications(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
        setError("Failed to load applications.");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [email]);

  if (loading) {
    return (
      <div className="my-applications">
        <p>Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-applications">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-applications">
      <h1>📋 My Job Applications</h1>

      {applications.length === 0 ? (
        <p className="no-apps">You haven’t applied for any jobs yet.</p>
      ) : (
        <div className="applications-grid">
          {applications.map((app) => (
            <div key={app.id || app._id} className="application-card">
              <h2>{app.jobTitle || "Job Title Not Found"}</h2>
              <p><b>Company:</b> {app.companyName || "N/A"}</p>
              <p><b>Status:</b> {app.status || "Pending"}</p>
              {app.ctc && <p><b>CTC:</b> {app.ctc}</p>}
              {app.location && <p><b>Location:</b> {app.location}</p>}
              {app.jobDescription && (
                <p className="description">
                  {app.jobDescription.length > 120
                    ? app.jobDescription.slice(0, 120) + "..."
                    : app.jobDescription}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
