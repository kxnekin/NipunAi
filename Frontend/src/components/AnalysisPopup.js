import { useState, useEffect } from 'react';

export default function AnalysisPopup({ isOpen, onClose, analysisData }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [activeTab, setActiveTab] = useState('overall');

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Mock data structure - replace with your actual analysis data
  const mockAnalysisResult = analysisData || {
    overall: {
      score: 7.5,
      summary: "Good response with clear structure and relevant examples. Could improve on technical depth.",
      strengths: ["Clear communication", "Good examples", "Professional tone"],
      improvements: ["Add more technical details", "Improve time management", "More specific examples"]
    },
    insights: {
      sentiment: "Confident",
      talkTime: "2:30 mins",
      keyPhrases: ["Agile methodology", "Team collaboration", "Problem solving"],
      fillerWords: 8
    },
    delivery: {
      confidence: { value: 75, label: "Good", status: "excellent" },
      clarity: { value: 70, label: "Good", status: "excellent" },
      pace: { value: 65, label: "Fair", status: "good" },
      engagement: { value: 80, label: "Excellent", status: "excellent" }
    }
  };

  return (
    <div className="analysis-popup-overlay">
      <div className="analysis-popup-backdrop" onClick={onClose}></div>

      <div className="analysis-popup-card">
        {/* Top Glow */}
        <div className="popup-top-glow"></div>
        
        {/* Corner accents */}
        <div className="popup-corner popup-corner-tl"></div>
        <div className="popup-corner popup-corner-tr"></div>
        <div className="popup-corner popup-corner-bl"></div>
        <div className="popup-corner popup-corner-br"></div>

        {isAnalyzing ? (
          /* Analyzing State */
          <div className="analyzing-state">
            {/* Background ambient particles */}
            <div className="ambient-particles">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="particle" style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.5 + 0.3
                }}></div>
              ))}
            </div>
            
            {/* Enhanced Spinner */}
            <div className="spinner-container">
              <div className="spinner-outer-ring"></div>
              <div className="spinner-glow"></div>
              <div className="spinner-main">
                <div className="spinner-gradient-ring"></div>
                <div className="spinner-inner-ring">
                  <div className="spinner-inner-gradient"></div>
                </div>
              </div>
              
              {/* Light Particles */}
              <div className="spinner-particles">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="spinner-particle" style={{
                    transform: `rotate(${i * 45}deg) translateY(-50px)`,
                    animationDelay: `${i * 0.2}s`
                  }}></div>
                ))}
              </div>
              
              {/* Center orb */}
              <div className="spinner-center"></div>
            </div>

            <h3 className="analyzing-title">Analyzing your response...</h3>
            <p className="analyzing-subtitle">
              Processing speech patterns, content quality, and delivery metrics
            </p>
            
            {/* Progress dots */}
            <div className="progress-dots">
              {[0, 1, 2].map((i) => (
                <div key={i} className="progress-dot" style={{ animationDelay: `${i * 0.3}s` }}></div>
              ))}
            </div>
          </div>
        ) : (
          /* Feedback State */
          <div className="feedback-state">
            {/* Header */}
            <div className="popup-header">
              <div className="header-content">
                <h3 className="popup-title">Analysis Complete</h3>
                <button onClick={onClose} className="close-button">
                  <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Enhanced Tabs */}
              <div className="popup-tabs">
                {(['overall', 'insights', 'delivery']).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-button ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
                  >
                    {activeTab === tab && (
                      <>
                        <div className="tab-active-glow"></div>
                        <div className="tab-active-border"></div>
                      </>
                    )}
                    <span className="tab-text">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="popup-content">
              {activeTab === 'overall' && (
                <div className="overall-tab">
                  <div className="score-section">
                    <div className="score-circle">
                      <span className="score-value">{mockAnalysisResult.overall.score}</span>
                    </div>
                    <div className="score-info">
                      <p className="score-label">Overall Score</p>
                      <p className="score-rating">Above Average</p>
                    </div>
                  </div>

                  <p className="overall-summary">
                    {mockAnalysisResult.overall.summary}
                  </p>

                  <div className="analysis-lists">
                    <div className="strengths-section">
                      <p className="list-title strengths-title">✓ Strengths</p>
                      <ul className="strengths-list">
                        {mockAnalysisResult.overall.strengths.map((strength, i) => (
                          <li key={i} className="list-item">
                            <span className="list-bullet">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="improvements-section">
                      <p className="list-title improvements-title">↗ Areas to Improve</p>
                      <ul className="improvements-list">
                        {mockAnalysisResult.overall.improvements.map((improvement, i) => (
                          <li key={i} className="list-item">
                            <span className="list-bullet">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="insights-tab">
                  <div className="insights-grid">
                    <div className="insight-card">
                      <p className="insight-label">Sentiment</p>
                      <p className="insight-value">{mockAnalysisResult.insights.sentiment}</p>
                    </div>
                    <div className="insight-card">
                      <p className="insight-label">Talk Time</p>
                      <p className="insight-value">{mockAnalysisResult.insights.talkTime}</p>
                    </div>
                  </div>

                  <div className="key-phrases-card">
                    <p className="phrases-label">Key Phrases Detected</p>
                    <div className="phrases-container">
                      {mockAnalysisResult.insights.keyPhrases.map((phrase, i) => (
                        <span key={i} className="phrase-tag">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="filler-words-card">
                    <p className="filler-label">Filler Words</p>
                    <p className="filler-value">{mockAnalysisResult.insights.fillerWords} instances</p>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="delivery-tab">
                  {Object.entries(mockAnalysisResult.delivery).map(([key, data]) => (
                    <div key={key} className="delivery-metric">
                      <div className="metric-header">
                        <p className="metric-name">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </p>
                        <span className={`metric-status ${data.status}`}>
                          {data.label}
                        </span>
                      </div>
                      <div className="metric-progress-bar">
                        <div className="metric-progress-fill" style={{ width: `${data.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="popup-footer">
              <div className="footer-glow"></div>
              <button onClick={onClose} className="action-button">
                <div className="button-shine"></div>
                <div className="button-top-border"></div>
                <span className="button-text">
                  View Results
                  <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}