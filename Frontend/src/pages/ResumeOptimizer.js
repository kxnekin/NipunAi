import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Wand2,
  Loader,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  UploadCloud,
  TrendingDown,
} from "lucide-react";
import "../styles/ResumeOptimizer.css";

// --- List of job roles for the dropdown ---
const fresherRoles = [
  { value: "", label: "Select a Target Role...", disabled: true },
  { value: "frontend-developer", label: "Frontend Developer" },
  { value: "backend-developer", label: "Backend Developer" },
  { value: "full-stack-developer", label: "Full Stack Developer" },
  { value: "java-developer", label: "Java Developer" },
  { value: "python-developer", label: "Python Developer" },
  { value: "data-analyst", label: "Data Analyst" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "digital-marketing", label: "Digital Marketing Specialist" },
  { value: "ui-ux-designer", label: "UI/UX Designer" },
  { value: "devops-engineer", label: "DevOps Engineer (Junior)" },
];

// Loading spinner
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <Loader className="icon" size={48} />
    <p>Analyzing your resume... this may take a moment.</p>
  </div>
);

const getScoreColor = (score) => {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
};

const AnalysisResults = ({ results }) => {
  if (!results) return null;

  const score = results.score || 0;

  return (
    <div className="results-wrapper">
      <div className="results-score-card">
        <h3>Overall Score for Target Role</h3>
        <div className={`score-circle ${getScoreColor(score)}`}>
          {score}
          <span>/ 100</span>
        </div>
        <p>
          This score reflects how well your resume matches the keywords and
          qualifications for your target role.
        </p>
      </div>

      <div className="results-grid">
        {/* Missing Keywords */}
        <div className="result-card keywords-missing">
          <div className="card-header">
            <XCircle className="card-icon" size={24} />
            <h3>Missing Keywords</h3>
          </div>
          <p>Add these keywords to get past ATS filters:</p>
          <ul>
            {results.missing_keywords?.length
              ? results.missing_keywords.map((keyword, i) => (
                  <li key={i}>{keyword}</li>
                ))
              : <li>None detected 🎉</li>}
          </ul>
        </div>

        {/* Strong Points */}
        <div className="result-card keywords-matched">
          <div className="card-header">
            <CheckCircle className="card-icon" size={24} />
            <h3>Strong Points</h3>
          </div>
          <p>These are your most relevant skills and experiences:</p>
          <ul>
            {results.strong_points?.length
              ? results.strong_points.map((point, i) => <li key={i}>{point}</li>)
              : <li>No strong points detected yet.</li>}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="result-card suggestions">
          <div className="card-header">
            <Lightbulb className="card-icon" size={24} />
            <h3>Actionable Suggestions</h3>
          </div>
          <p>Follow these tips to improve your resume:</p>
          <ul>
            {results.suggestions?.length
              ? results.suggestions.map((tip, i) => <li key={i}>{tip}</li>)
              : <li>No suggestions available.</li>}
          </ul>
        </div>

        {/* Unnecessary Points */}
        <div className="result-card keywords-unnecessary">
          <div className="card-header">
            <TrendingDown className="card-icon" size={24} />
            <h3>Points to Remove</h3>
          </div>
          <p>Consider removing these weak or irrelevant points:</p>
          <ul>
            {results.unnecessary_points?.length
              ? results.unnecessary_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))
              : <li>None found ✅</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

function ResumeOptimizer() {
  const [targetRole, setTargetRole] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setError(null);
    } else if (file) {
      setError("Please upload a PDF file only.");
      setResumeFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!targetRole) {
      setError("Please select a target job role from the dropdown.");
      return;
    }
    if (!resumeFile) {
      setError("Please upload a resume (PDF) to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("targetRole", targetRole);
    formData.append("resume", resumeFile);

    try {
      // ✅ Updated endpoint
      const response = await axios.post(
        "http://localhost:5000/api/resume-optimizer/optimize",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setAnalysis(response.data);
    } catch (err) {
      console.error("❌ Error analyzing resume:", err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.error ||
        "Failed to analyze resume. Please try again later.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="optimizer-wrapper">
      <button
        className="back-button"
        onClick={() => navigate("/student-dashboard")}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="optimizer-header">
        <h1>Resume Optimizer</h1>
        <p>Get an AI-powered analysis of your resume for any job title.</p>
      </div>

      <div className="optimizer-input-card">
        <Wand2 size={28} className="wand-icon" />
        <h2>Analyze Your Resume</h2>

        <div className="input-group">
          <label htmlFor="targetRole">1. Select Your Target Role</label>
          <select
            id="targetRole"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            {fresherRoles.map((role) => (
              <option
                key={role.value}
                value={role.value}
                disabled={role.disabled}
              >
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="resumeUpload">2. Upload Your Resume (PDF)</label>
          <label htmlFor="resumeUpload" className="file-upload-label">
            <UploadCloud size={20} />
            <span>
              {resumeFile ? resumeFile.name : "Click to select a PDF file"}
            </span>
          </label>
          <input
            type="file"
            id="resumeUpload"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </div>

        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze My Resume"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {isLoading && <LoadingSpinner />}
      {!isLoading && analysis && <AnalysisResults results={analysis} />}
    </div>
  );
}

export default ResumeOptimizer;