import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from 'styled-components';

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
      const studentEmail = localStorage.getItem('studentEmail');
      
      if (!studentEmail) {
        alert("Please login again!");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/applications", 
        { 
          jobId, 
          studentEmail
        }
      );
      
      // Add to applied jobs set
      setAppliedJobs(prev => new Set([...prev, jobId]));
      alert("🎉 " + response.data.message);
      
    } catch (error) {
      if (error.response?.status === 409) {
        alert("You've already applied to this job!");
      } else if (error.response?.status === 400) {
        alert("Please upload your resume in dashboard first!");
      } else {
        alert("Oops! Something went wrong 😢");
      }
      console.error("Apply error:", error);
    }
  };

  if (loading) {
    return (
      <StyledWrapper>
        <div className="form">
          <p className="title">Loading Jobs...</p>
        </div>
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper>
      <div style={styles.container}>
        <div className="form">
          <p className="title">🚀 Available Jobs</p>
          <p className="message">One-click EasyApply with your resume</p>
          
          {jobs.length === 0 ? (
            <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.7)'}}>
              No jobs available right now. Check back later!
            </p>
          ) : (
            <div style={styles.jobList}>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} 
                  onApply={handleEasyApply}
                  isApplied={appliedJobs.has(job._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </StyledWrapper>
  );
};

// Job Card Component (same as your existing code)
const JobCard = ({ job, onApply, isApplied }) => {
  return (
    <div style={styles.jobCard}>
      <div style={styles.jobHeader}>
        <h3 style={styles.jobTitle}>{job.title}</h3>
        <div style={styles.companyChip}>{job.company}</div>
      </div>
      
      <div style={styles.jobDetails}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>💰 CTC:</span>
          <span style={styles.detailValue}>{job.ctc}</span>
        </div>
        
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>📍 Location:</span>
          <span style={styles.detailValue}>{job.location || "Remote"}</span>
        </div>
        
        {job.eligibility && (
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>🎓 Eligibility:</span>
            <span style={styles.detailValue}>{job.eligibility}</span>
          </div>
        )}
        
        {job.deadline && (
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>⏰ Deadline:</span>
            <span style={styles.detailValue}>
              {new Date(job.deadline).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
      
      <div style={styles.description}>
        {job.description}
      </div>
      
      <button 
        className="submit"
        onClick={() => onApply(job._id)}
        disabled={isApplied}
        style={{
          ...styles.easyApplyButton,
          backgroundColor: isApplied ? '#4CAF50' : '#00bfff',
          cursor: isApplied ? 'default' : 'pointer'
        }}
      >
        {isApplied ? '✅ Applied!' : '⚡ EasyApply'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  jobList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '70vh',
    overflowY: 'auto',
    padding: '10px',
  },
  jobCard: {
    background: '#2a2a2a',
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #333',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  jobTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#00bfff',
    margin: 0,
    flex: 1,
  },
  companyChip: {
    background: '#00bfff',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  jobDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '15px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
  },
  detailValue: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  description: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    lineHeight: '1.4',
    marginBottom: '15px',
    borderTop: '1px solid #333',
    paddingTop: '15px',
  },
  easyApplyButton: {
    width: '100%',
    marginTop: '10px',
  }
};

const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 500px;
    width: 100%;
    padding: 30px;
    border-radius: 20px;
    position: relative;
    background-color: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    max-height: 90vh;
    overflow: hidden;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00bfff;
    margin: 0;
  }

  .message {
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin: 0;
  }

  .submit {
    border: none;
    outline: none;
    padding: 12px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    background-color: #00bfff;
    cursor: pointer;
    font-weight: 600;
  }

  .submit:hover:not(:disabled) {
    background-color: #00bfff96;
  }

  .submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }
    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default StudentJobView;