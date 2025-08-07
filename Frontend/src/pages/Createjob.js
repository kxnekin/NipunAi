import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    ctc: '',            // ✅ Added CTC field in state
    location: '',
    description: '',
    eligibility: '',
    deadline: '',
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/jobs', jobData);

      if (response.status === 200 || response.status === 201) {
        alert('Job posted successfully!');
        navigate('/admin-dashboard');
      } else {
        alert('Failed to post job.');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Something went wrong while posting the job.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Post a New Job</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={jobData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={jobData.company}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="ctc"
          placeholder="CTC (e.g., ₹6 LPA)"
          value={jobData.ctc}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="location"
          placeholder="Job Location"
          value={jobData.location}
          onChange={handleChange}
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={jobData.description}
          onChange={handleChange}
          style={styles.textarea}
          required
        />
        <textarea
          name="eligibility"
          placeholder="Eligibility Criteria"
          value={jobData.eligibility}
          onChange={handleChange}
          style={styles.textarea}
        />
        <input
          type="date"
          name="deadline"
          placeholder="Application Deadline"
          value={jobData.deadline}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Post Job</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '60px auto',
    background: '#1e1e2f',
    padding: '30px',
    borderRadius: '12px',
    color: 'white',
    boxShadow: '0 0 12px rgba(255, 255, 255, 0.1)',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '26px',
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px 15px',
    margin: '10px 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2b2b3c',
    color: 'white',
    fontSize: '16px',
  },
  textarea: {
    padding: '12px 15px',
    margin: '10px 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2b2b3c',
    color: 'white',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical',
  },
  button: {
    marginTop: '20px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#4caf50',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default CreateJob;
