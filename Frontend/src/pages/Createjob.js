import React, { useState } from "react";
import axios from "axios";
import "../styles/CreateJob.css"; // We will create this new CSS file

function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    ctc: "",
    location: "",
    description: "",
    eligibility: "",
    deadline: "", // Renamed from 'date' for clarity
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/jobs", formData);
      alert("✅ Job posted successfully!");
      // Clear the form
      setFormData({
        title: "",
        company: "",
        ctc: "",
        location: "",
        description: "",
        eligibility: "",
        deadline: "",
      });
    } catch (err) {
      alert("❌ Failed to post job.");
    }
  };

  return (
    // This wrapper fits inside your main dashboard layout
    <div className="admin-page-content">
      {/* A standard header, just like the student pages */}
      <div className="admin-page-header">
        <h1>Post a New Job</h1>
        <p>Fill out the form below to publish a new job opportunity for students.</p>
      </div>

      {/* The main form card */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="create-job-form">
          {/* Form fields are now in a responsive grid */}
          <div className="form-grid">
            {/* Job Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Job Title
              </label>
              <input
                className="form-input"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            {/* Company Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="company">
                Company Name
              </label>
              <input
                className="form-input"
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g., Infosys"
                required
              />
            </div>

            {/* CTC */}
            <div className="form-group">
              <label className="form-label" htmlFor="ctc">
                CTC (e.g., ₹6 LPA)
              </label>
              <input
                className="form-input"
                type="text"
                id="ctc"
                name="ctc"
                value={formData.ctc}
                onChange={handleChange}
                placeholder="e.g., ₹6 LPA"
              />
            </div>

            {/* Job Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Job Location
              </label>
              <input
                className="form-input"
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bangalore / Remote"
              />
            </div>

            {/* Job Description (Full Width) */}
            <div className="form-group full-span">
              <label className="form-label" htmlFor="description">
                Job Description
              </label>
              <textarea
                className="form-textarea"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job role, responsibilities, etc."
              />
            </div>

            {/* Eligibility (Full Width) */}
            <div className="form-group full-span">
              <label className="form-label" htmlFor="eligibility">
                Eligibility Criteria
              </label>
              <textarea
                className="form-textarea"
                id="eligibility"
                name="eligibility"
                rows="3"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="e.g., B.Tech CSE, 2025 batch, 7+ CGPA"
              />
            </div>

            {/* Application Deadline */}
            <div className="form-group">
              <label className="form-label" htmlFor="deadline">
                Application Deadline
              </label>
              <input
                className="form-input"
                type="date"
                id="deadline"
                name="deadline" // Renamed from 'date'
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            {/* Empty group for alignment (optional) */}
            <div className="form-group"></div>

            {/* Submit Button (Full Width) */}
            <div className="form-group full-span">
              <button type="submit" className="form-submit-button">
                🚀 Post Job
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;