import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateJob.css";

function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    ctc: "",
    location: "",
    description: "",
    eligibility: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/jobs", formData);
      alert("✅ Job posted successfully!");
      setFormData({
        title: "",
        company: "",
        ctc: "",
        location: "",
        description: "",
        eligibility: "",
        date: "",
      });
    } catch (err) {
      alert("❌ Failed to post job.");
    }
  };

  return (
    <div className="createjob-container">
      <div className="createjob-card">
        <h2 className="createjob-title">🚀 Post a New Job</h2>
        <form onSubmit={handleSubmit} className="createjob-form">
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Software Engineer"
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g., Infosys"
              required
            />
          </div>

          <div className="form-group">
            <label>CTC (e.g., ₹6 LPA)</label>
            <input
              type="text"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              placeholder="e.g., ₹6 LPA"
            />
          </div>

          <div className="form-group">
            <label>Job Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Bangalore"
            />
          </div>

          <div className="form-group full">
            <label>Job Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job role..."
            />
          </div>

          <div className="form-group full">
            <label>Eligibility Criteria</label>
            <textarea
              name="eligibility"
              rows="2"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="e.g., B.Tech CSE, 2025 batch"
            />
          </div>

          <div className="form-group">
            <label>Application Deadline</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
