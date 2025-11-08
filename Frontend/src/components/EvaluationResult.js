import React from 'react';
import './EvaluationResult.css';

const EvaluationResult = ({ evaluation, onNextQuestion }) => {
  if (!evaluation) return null;

  const { score, feedback, strengths, improvements, deliveryAnalysis } = evaluation;

  const getScoreColor = (score) => {
    if (score >= 9) return '#10b981';
    if (score >= 7) return '#3b82f6';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 9) return 'Excellent!';
    if (score >= 7) return 'Good job!';
    if (score >= 5) return 'Not bad!';
    return 'Needs improvement';
  };

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 80) return 'High';
    if (confidence >= 60) return 'Medium';
    return 'Low';
  };

  // Performance analytics data
  const performanceData = [
    { label: 'Content Quality', value: score * 10, max: 100 },
    { label: 'Delivery', value: deliveryAnalysis?.confidence || 75, max: 100 },
    { label: 'Body Language', value: deliveryAnalysis?.motionStability || 80, max: 100 },
    { label: 'Engagement', value: deliveryAnalysis?.facePresence ? 90 : 60, max: 100 }
  ];

  return (
    <div className="evaluation-result luxury-card">
      <div className="evaluation-header">
        <h3>📊 AI Evaluation</h3>
        <div className="score-display" style={{ color: getScoreColor(score) }}>
          <span className="score">{score}/10</span>
          <span className="score-message">{getScoreMessage(score)}</span>
        </div>
      </div>

      <div className="evaluation-content">
        {/* Performance Radar Chart */}
        <div className="performance-radar luxury-subcard">
          <h4>🎯 Performance Analytics</h4>
          <div className="radar-chart">
            {performanceData.map((item, index) => (
              <div key={index} className="radar-item">
                <div className="radar-label">{item.label}</div>
                <div className="radar-bar">
                  <div 
                    className="radar-fill"
                    style={{ 
                      width: `${item.value}%`,
                      background: `linear-gradient(90deg, 
                        ${getScoreColor(item.value / 10)}, 
                        ${getScoreColor(item.value / 10)}77)`
                    }}
                  ></div>
                </div>
                <div className="radar-value">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="feedback-section">
          <h4>💡 Detailed Feedback</h4>
          <p className="feedback-text">{feedback}</p>
        </div>

        {deliveryAnalysis && (
          <div className="delivery-analysis luxury-subcard">
            <h4>🎙️ Delivery Analysis</h4>

            <div className="analysis-item">
              <strong>🗣️ Speech Confidence:</strong>{' '}
              <span className={`confidence-badge ${
                deliveryAnalysis.confidence >= 80 ? 'high' :
                deliveryAnalysis.confidence >= 60 ? 'medium' : 'low'
              }`}>
                {getConfidenceLevel(deliveryAnalysis.confidence)} ({deliveryAnalysis.confidence}%)
              </span>
              <div className="confidence-visual">
                <div 
                  className="confidence-meter-fill"
                  style={{ width: `${deliveryAnalysis.confidence}%` }}
                ></div>
              </div>
              <p className="analysis-feedback">
                {deliveryAnalysis.confidenceFeedback?.feedback}
              </p>
            </div>

            <div className="analysis-item">
              <strong>🎯 Body Language:</strong>
              <div className="status-indicators">
                <div className={`status-indicator ${
                  deliveryAnalysis.motionStability >= 80 ? 'status-good' :
                  deliveryAnalysis.motionStability >= 60 ? 'status-warning' : 'status-bad'
                }`}>
                  Stability: {deliveryAnalysis.motionStability}/100
                </div>
                <div className={`status-indicator ${
                  deliveryAnalysis.facePresence ? 'status-good' : 'status-bad'
                }`}>
                  Eye Contact: {deliveryAnalysis.facePresence ? 'Good' : 'Poor'}
                </div>
              </div>
            </div>

            {deliveryAnalysis.confidenceFeedback?.suggestions && (
              <div className="analysis-item">
                <strong>💡 Delivery Suggestions:</strong>
                <ul className="suggestions-list">
                  {deliveryAnalysis.confidenceFeedback.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="details-grid">
          <div className="strengths-section">
            <h4>✅ Your Strengths</h4>
            <ul>
              {strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>

          <div className="improvements-section">
            <h4>🎯 Areas to Improve</h4>
            <ul>
              {improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="evaluation-actions">
          <button onClick={onNextQuestion} className="luxury-btn primary next-btn">
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationResult;