import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewJobCards = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicants, setSelectedApplicants] = useState(null);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      setJobs(jobs.filter((job) => job._id !== id));
      alert("Job deleted successfully");
    } catch (err) {
      console.error("Error deleting job:", err);
      alert("Failed to delete job");
    }
  };

  const handleViewApplicants = async (jobId) => {
    if (selectedApplicants?.jobId === jobId) {
      setSelectedApplicants(null);
      return;
    }

    setApplicantsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`);
      setSelectedApplicants({ jobId, applicants: res.data });
    } catch (err) {
      console.error("Error fetching applicants:", err);
      alert("Failed to fetch applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleSendToCompany = async (jobId, jobTitle) => {
    const companyEmail = prompt(`Enter company email address for "${jobTitle}":`);
    if (!companyEmail) return;

    const customMessage = prompt('Optional: Add a custom message for the company:') || '';

    try {
      const response = await axios.post(
        `http://localhost:5000/api/applications/job/${jobId}/send-to-company`,
        { companyEmail, customMessage }
      );

      if (response.data.success) {
        alert(`✅ Applications sent successfully to ${companyEmail}\n\nApplicants: ${response.data.applicantsCount}`);
        
        // Optional: Show email content for testing
        console.log("Email Content:", response.data.emailContent);
      }
    } catch (err) {
      console.error('Send to company error:', err);
      alert('❌ Failed to send applications: ' + (err.response?.data?.error || 'Please try again'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.heading}>📋 All Job Cards</h2>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <div style={styles.jobListScroll}>
            {jobs.map((job) => (
              <div key={job._id} style={styles.card}>
                <h3 style={styles.title}>{job.title}</h3>
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>CTC:</strong> {job.ctc}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Description:</strong> {job.description}
                </p>
                <p>
                  <strong>Eligibility:</strong> {job.eligibility}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "N/A"}
                </p>

                <div style={styles.buttonsContainer}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(job._id)}
                  >
                    ❌ Delete
                  </button>

                  <button
                    style={styles.viewApplicantsButton}
                    onClick={() => handleViewApplicants(job._id)}
                  >
                    👀 View Applicants
                  </button>

                  <button
                    style={styles.emailButton}
                    onClick={() => handleSendToCompany(job._id, job.title)}
                  >
                    📧 Send to Company
                  </button>
                </div>

                {selectedApplicants?.jobId === job._id && (
                  <div style={styles.applicantsContainer}>
                    <h4>Applicants:</h4>
                    {applicantsLoading ? (
                      <p>Loading applicants...</p>
                    ) : selectedApplicants.applicants.length === 0 ? (
                      <p>No applicants yet.</p>
                    ) : (
                      <ul>
                        {selectedApplicants.applicants.map((application) => (
                          <li key={application._id} style={styles.applicantItem}>
                            <strong>{application.student.name}</strong> 
                            <br />Email: {application.student.email}
                            <br />USN: {application.student.usn || 'N/A'}
                            <br />Branch: {application.student.branch || 'N/A'}
                            <br />CGPA: {application.student.cgpa || 'N/A'}
                            <br />Phone: {application.student.phone || 'N/A'}
                            <br />Applied: {new Date(application.appliedAt).toLocaleDateString()}
                            <br />
                            <a 
                              href={`http://localhost:5000/api/resume/download/${application.student.email}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={styles.resumeLink}
                            >
                              📄 View Resume
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "20px",
    background: "#1e1e2f",
    color: "white",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  panel: {
    width: "95%",
    height: "90vh",
    background: "#27293d",
    borderRadius: "15px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
    color: "#fff",
    flexShrink: 0,
  },
  jobListScroll: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "20px",
    padding: "10px",
    flex: 1,
    overflowY: "auto",
  },
  card: {
    background: "#2b2b3c",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 0 12px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#4cafef",
  },
  buttonsContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
    paddingTop: "15px",
  },
  deleteButton: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#e74c3c",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1,
  },
  viewApplicantsButton: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#3498db",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1,
  },
  emailButton: {
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#27ae60",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    flex: 1,
  },
  applicantsContainer: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#3b3b50",
    borderRadius: "8px",
  },
  applicantItem: {
    marginBottom: '15px',
    padding: '10px',
    background: '#4a4a5f',
    borderRadius: '5px',
    fontSize: '14px',
  },
  resumeLink: {
    color: '#4cafef',
    textDecoration: 'none',
    fontWeight: 'bold',
    marginTop: '5px',
    display: 'inline-block',
  },
};

export default ViewJobCards;