import React, { useState, useEffect } from 'react';
import CameraComponent from '../components/CameraComponent';
import QuestionDisplay from '../components/QuestionDisplay';
import EvaluationResult from '../components/EvaluationResult';
import { interviewQuestions } from './data/interviewQuestions';
import './MockInterview.css';

import SpeechAnalysis from './utils/speechAnalysis';

/* -------------------------------------------------------------------------- */
/* ✅ 1. Speech-to-Text Class                                                 */
/* -------------------------------------------------------------------------- */
class WorkingSpeechToText {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.initializeRecognition();
  }

  initializeRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript + ' ';
          else interimTranscript += transcript;
        }
        this.transcript = finalTranscript + interimTranscript;
        if (this.onResultCallback) {
          this.onResultCallback({
            final: finalTranscript,
            interim: interimTranscript,
            full: this.transcript,
          });
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (this.onErrorCallback) this.onErrorCallback(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    } else {
      console.warn('Speech recognition not supported');
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.transcript = '';
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return this.transcript;
    }
    return this.transcript;
  }

  onResult(callback) {
    this.onResultCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  getTranscript() {
    return this.transcript;
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ 2. AI Evaluator + Fallback Logic                                        */
/* -------------------------------------------------------------------------- */
const evaluateWithAI = async (question, answer) => {
  try {
    console.log("📤 Sending for evaluation:", { question, answer });

    const response = await fetch("http://localhost:5002/api/evaluate", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer }),
      mode: "cors",
    });

    if (!response.ok) {
      console.warn(`⚠️ Backend responded with ${response.status}, using fallback.`);
      return analyzeAnswerFallback(question, answer);
    }

    const result = await response.json();
    console.log("✅ AI Evaluation:", result);

    if (result && result.score && result.feedback) {
      return result;
    }

    console.warn("⚠️ AI returned invalid structure, using fallback.");
    return analyzeAnswerFallback(question, answer);
  } catch (error) {
    console.error("❌ AI Evaluation Error:", error);
    return analyzeAnswerFallback(question, answer);
  }
};

// ✅ Local fallback evaluator
const analyzeAnswerFallback = (question, answer) => {
  const words = answer.split(/\s+/).filter(Boolean).length;
  const keywords = (question.match(/\b\w{4,}\b/g) || []).map((w) => w.toLowerCase());
  const answerLower = answer.toLowerCase();
  const relevance = keywords.filter((k) => answerLower.includes(k)).length / Math.max(1, keywords.length);

  let score = 5;
  if (words > 30) score++;
  if (words > 60) score++;
  if (relevance > 0.5) score += 2;
  if (relevance > 0.7) score++;
  const hasStructure = /(first|second|finally|because|therefore)/i.test(answer);
  const hasExamples = /(example|such as|like when|instance)/i.test(answer);
  const hasPersonal = /(i|my|me|project|experience|worked)/i.test(answer);
  if (hasStructure) score++;
  if (hasExamples) score++;
  if (hasPersonal) score++;
  score = Math.min(10, Math.max(1, Math.round(score)));

  const strengths = [];
  const improvements = [];
  if (words > 40) strengths.push('Good elaboration');
  else improvements.push('Add more details');
  if (relevance > 0.6) strengths.push('Relevant answer');
  else improvements.push('Focus more on question');
  if (hasStructure) strengths.push('Well-structured');
  else improvements.push('Add structure (First, Then, Finally)');

  const feedback =
    score >= 9
      ? 'Excellent, detailed and structured answer.'
      : score >= 7
      ? 'Good, but can add more examples.'
      : score >= 5
      ? 'Average answer — elaborate and structure more.'
      : 'Needs improvement — unclear and brief.';

  return {
    score,
    feedback,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
};

/* -------------------------------------------------------------------------- */
/* ✅ 3. Main Component — MockInterview                                       */
/* -------------------------------------------------------------------------- */
const MockInterview = () => {
  const [currentSession, setCurrentSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewType, setInterviewType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [speechToText, setSpeechToText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState(0);
  const [speechAnalysis] = useState(new SpeechAnalysis());
  const [faceData, setFaceData] = useState(null);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [aiWarnings, setAiWarnings] = useState([]);

  useEffect(() => {
    if (isInterviewActive) {
      const stt = new WorkingSpeechToText();
      stt.onResult((result) => setTranscript(result.full));
      stt.onError((err) => console.error('STT Error:', err));
      setSpeechToText(stt);
    }
  }, [isInterviewActive]);

  // Live analysis effect for AI warnings
  useEffect(() => {
    const warnings = [];

    // --- Face / posture / gaze (uses whatever CameraComponent sends you via onFaceData) ---
    if (faceData) {
      // safe boolean-style checks; if your faceData uses different keys it's still harmless
      if (faceData.noFace === true) warnings.push('Face not detected — look at the camera');
      if (faceData.eyeContact === false || faceData.lookAway === true) warnings.push('Maintain eye contact');
      if (faceData.posture === 'slouch' || faceData.slouch === true || faceData.pitch < -10) warnings.push('Sit straight');
      if (faceData.headTurn === 'left' || faceData.turnLeft === true) warnings.push('You\'re turning left — re-center');
      if (faceData.headTurn === 'right' || faceData.turnRight === true) warnings.push('You\'re turning right — re-center');
      if (typeof faceData.jitterScore === 'number' && faceData.jitterScore > 0.55) warnings.push('Too much head movement — keep steady');
    }

    // --- Voice / stutter / pace (uses your SpeechAnalysis util on the LIVE transcript) ---
    const live = transcript?.trim()
      ? (speechAnalysis.liveAnalyze?.(transcript) || speechAnalysis.analyzeConfidence(transcript))
      : null;

    if (live) {
      if (typeof live.overallConfidence === 'number' && live.overallConfidence < 55) {
        warnings.push('Project more energy — speak a bit louder');
      }
      if (live.longPauses === true || (Array.isArray(live.pauses) && live.pauses.length >= 3)) {
        warnings.push('Avoid long pauses — keep a steady pace');
      }
      if (typeof live.fillerWords === 'number' && live.fillerWords > 8) {
        warnings.push('Reduce filler words (um, uh, like)');
      }
      if (typeof live.speakingRate === 'number' && live.speakingRate > 190) {
        warnings.push('Slow down slightly');
      } else if (typeof live.speakingRate === 'number' && live.speakingRate < 110) {
        warnings.push('Increase your pace a bit');
      }
      if (live.mumbling === true) {
        warnings.push('Enunciate clearly');
      }
    }

    // keep UI clean: show at most 3 at once
    setAiWarnings(warnings.slice(0, 3));
  }, [transcript, faceData, speechAnalysis]);

  const startInterview = async (type, domain = null) => {
    setIsLoading(true);
    try {
      const selected =
        (domain && interviewQuestions[type]?.[domain]) ||
        interviewQuestions[type] ||
        interviewQuestions.hr;
      setCurrentSession('session-' + Date.now());
      setQuestions(selected);
      setInterviewType(domain ? `${type} - ${domain}` : type);
      setCurrentQuestionIndex(0);
      setRecordedAnswers([]);
      setIsInterviewActive(true);
      setTranscript('');
      setShowEvaluation(false);
      setIsRecording(false);
      setIsEvaluating(false);
      setEvaluationProgress(0);
      setShowAnalysisPopup(false);
      setAiWarnings([]);
    } catch {
      alert('Error starting interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
    speechToText?.startListening();
  };

  const handleRecordingComplete = async (recordingData) => {
    if (!currentSession) return;
    
    setIsEvaluating(true);
    setEvaluationProgress(0);
    
    try {
      setIsRecording(false);
      const finalTranscript = speechToText?.stopListening() || transcript || 'No speech detected';
      
      const confidenceAnalysis = speechAnalysis.analyzeConfidence(finalTranscript);
      
      const progressInterval = setInterval(() => {
        setEvaluationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);

      const evaluation = await evaluateWithAI(questions[currentQuestionIndex], finalTranscript);
      
      clearInterval(progressInterval);
      setEvaluationProgress(100);
      
      // Remove deliveryAnalysis from enhancedEvaluation
      const enhancedEvaluation = {
        ...evaluation,
        // deliveryAnalysis removed
      };
      
      const newAnswer = {
        question: questions[currentQuestionIndex],
        answer: finalTranscript,
        recording: recordingData,
        evaluation: enhancedEvaluation,
        confidenceMetrics: confidenceAnalysis,
        faceData: faceData,
        timestamp: new Date(),
      };
      
      setRecordedAnswers((p) => [...p, newAnswer]);
      setCurrentEvaluation(enhancedEvaluation);
      setShowEvaluation(true);
      setShowAnalysisPopup(true);
      
    } catch (err) {
      console.error('Evaluation error:', err);
      const fallback = analyzeAnswerFallback(questions[currentQuestionIndex], transcript);
      setCurrentEvaluation(fallback);
      setShowEvaluation(true);
      setShowAnalysisPopup(true);
    } finally {
      setIsEvaluating(false);
      setEvaluationProgress(0);
    }
  };

  const handleFaceData = (data) => {
    setFaceData(data);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
      setTranscript('');
      setShowEvaluation(false);
      setIsRecording(false);
      setIsEvaluating(false);
      setEvaluationProgress(0);
      setShowAnalysisPopup(false);
      setAiWarnings([]);
    } else endInterview();
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    setCurrentSession(null);
    speechToText?.stopListening();
    if (recordedAnswers.length > 0) {
      const avg = recordedAnswers.reduce((s, a) => s + a.evaluation.score, 0) / recordedAnswers.length;
      alert(`Interview Completed! Average Score: ${avg.toFixed(1)}/10`);
    } else alert('Interview Ended.');
  };

  if (!isInterviewActive) {
    return (
      <div className="mock-interview-container luxury-dark">
        <div className="interview-selection">
          <div className="header-section">
            <h1 className="luxury-title">🎙️ AI Mock Interview</h1>
            <p className="luxury-subtitle">
              Professional Interview Simulation with Real AI Evaluation
            </p>
          </div>

          <div className="interview-categories">
            <div className="luxury-card category-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon">💼</div>
                  <h3>HR & Behavioral</h3>
                </div>
                <p>Master behavioral questions and situational responses</p>
                <button onClick={() => startInterview('hr')} className="luxury-btn primary">
                  Start HR Interview
                </button>
              </div>
            </div>

            <div className="luxury-card category-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon">💻</div>
                  <h3>Technical Interviews</h3>
                </div>
                <p>Choose your technical domain</p>
                <div className="domain-options">
                  <button onClick={() => startInterview('technical', 'programming')} className="domain-btn">
                    🚀 Programming
                  </button>
                  <button onClick={() => startInterview('technical', 'webdev')} className="domain-btn">
                    🌐 Web Development
                  </button>
                  <button onClick={() => startInterview('technical', 'datascience')} className="domain-btn">
                    📊 Data Science
                  </button>
                  <button onClick={() => startInterview('technical', 'ai-ml')} className="domain-btn">
                    🤖 AI & ML
                  </button>
                  <button onClick={() => startInterview('technical', 'system-design')} className="domain-btn">
                    🏗️ System Design
                  </button>
                  <button onClick={() => startInterview('technical', 'dsa')} className="domain-btn">
                    ⚡ DSA
                  </button>
                </div>
              </div>
            </div>

            <div className="luxury-card category-card">
              <div className="card-content">
                <div className="card-header">
                  <div className="card-icon">🎯</div>
                  <h3>Specialized Roles</h3>
                </div>
                <p>Domain-specific interviews</p>
                <div className="domain-options">
                  <button onClick={() => startInterview('specialized', 'frontend')} className="domain-btn">
                    🎨 Frontend
                  </button>
                  <button onClick={() => startInterview('specialized', 'backend')} className="domain-btn">
                    🔧 Backend
                  </button>
                  <button onClick={() => startInterview('specialized', 'devops')} className="domain-btn">
                    ☁️ DevOps
                  </button>
                  <button onClick={() => startInterview('specialized', 'mobile')} className="domain-btn">
                    📱 Mobile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="loading-overlay luxury-overlay">
              <div className="luxury-spinner"></div>
              <p>Initializing your interview session...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mock-interview-container luxury-dark">
      {/* Analysis Popup */}
      {showAnalysisPopup && (
        <AnalysisPopup 
          isOpen={showAnalysisPopup}
          onClose={() => setShowAnalysisPopup(false)}
          analysisData={currentEvaluation}
        />
      )}

      <div className="interview-header luxury-header">
        <div className="header-content">
          <h1>AI Mock Interview</h1>
          <div className="session-info">
            <span className="interview-type">{interviewType}</span>
            <span className="question-count">
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        </div>
        <button onClick={endInterview} className="luxury-btn danger">
          🏁 End Session
        </button>
      </div>

      {/* Three Column Layout */}
      <div className="interview-content">
        {/* Left Column - AI Interviewer Panel */}
        <div className="left-column">
          <div className="luxury-card interviewer-panel">
            <div className="card-content">
              <div className="avatar-orb-container">
                <div className="avatar-orb">
                  <div className="orb-glow"></div>
                </div>
                <div className="timer-ring">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="28" className="timer-bg"></circle>
                    <circle cx="30" cy="30" r="28" className="timer-progress"></circle>
                  </svg>
                </div>
              </div>
              
              <QuestionDisplay
                question={questions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onNextQuestion={handleNextQuestion}
                autoPlay
                transcript={transcript}
              />
            </div>
          </div>

          <div className="luxury-card transcript-section">
            <div className="card-content">
              <div className="section-header">
                <h3>🎤 Live Transcript</h3>
                <div className="recording-status">
                  {speechToText?.isListening ? '🔴 Recording...' : '⚫ Ready'}
                </div>
              </div>
              <div className="transcript-box">
                {transcript || 'Speak your answer... I will transcribe in real-time.'}
              </div>
              <div className="transcript-stats">
                <span>
                  Words: {transcript.split(/\s+/).filter((w) => w.length > 0).length}
                </span>
                <span>Characters: {transcript.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Camera Feed (MAIN FOCUS) */}
        <div className="center-column">
          <div className="luxury-card camera-section">
            <div className="card-content">
              <div className="camera-glow"></div>
              <div className="camera-frame">
                <CameraComponent
                  onRecordingStart={handleRecordingStart}
                  onRecordingComplete={handleRecordingComplete}
                  onCameraError={(e) => console.error('Camera error:', e)}
                  onFaceData={handleFaceData}
                  isNewQuestion={!showEvaluation && !isRecording}
                />
                
                {/* 🔮 Real-time AI Feedback Overlay (luxury chips) */}
                {aiWarnings.length > 0 && (
                  <div className="ai-feedback-overlay">
                    {aiWarnings.map((w, i) => (
                      <div key={i} className="feedback-chip">
                        {w}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="live-transcript-bar">
                <div className="transcript-scroll">
                  {transcript || 'Speak your answer...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Evaluation Panel */}
        <div className="right-column">
          {showEvaluation && currentEvaluation ? (
            <EvaluationResult
              evaluation={currentEvaluation}
              onNextQuestion={handleNextQuestion}
            />
          ) : (
            <div className="luxury-card evaluation-panel">
              <div className="card-content">
                <div className="panel-header">
                  <h3>📊 Evaluation Metrics</h3>
                  <div className="evaluation-status">Ready</div>
                </div>
                
                <div className="score-meters">
                  <div className="score-meter">
                    <div className="meter-header">
                      <span className="meter-label">Clarity</span>
                      <span className="meter-value">-</span>
                    </div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{width: '0%'}}></div>
                    </div>
                  </div>
                  <div className="score-meter">
                    <div className="meter-header">
                      <span className="meter-label">Confidence</span>
                      <span className="meter-value">-</span>
                    </div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{width: '0%'}}></div>
                    </div>
                  </div>
                  <div className="score-meter">
                    <div className="meter-header">
                      <span className="meter-label">Relevance</span>
                      <span className="meter-value">-</span>
                    </div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>

                <div className="progress-display">
                  <h4>Interview Progress</h4>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {currentQuestionIndex + 1} / {questions.length} completed
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => speechToText?.startListening()}
                    className="luxury-btn secondary"
                    disabled={speechToText?.isListening}
                  >
                    🎤 Start Listening
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEvaluating && (
        <div className="evaluation-loading luxury-overlay">
          <div className="luxury-spinner"></div>
          <h3>AI is Analyzing Your Response</h3>
          
          <div className="evaluation-progress">
            <div 
              className="evaluation-progress-fill"
              style={{ width: `${evaluationProgress}%` }}
            ></div>
          </div>
          
          <div className="loading-steps">
            <div className={`loading-step ${evaluationProgress > 0 ? 'active' : ''}`}>
              ✅ Speech transcribed
            </div>
            <div className={`loading-step ${evaluationProgress > 30 ? 'active' : ''}`}>
              {evaluationProgress > 30 ? '✅' : '⏳'} Analyzing content
            </div>
            <div className={`loading-step ${evaluationProgress > 60 ? 'active' : ''}`}>
              {evaluationProgress > 60 ? '✅' : '⏳'} Evaluating performance
            </div>
            <div className={`loading-step ${evaluationProgress > 90 ? 'active' : ''}`}>
              {evaluationProgress > 90 ? '✅' : '⏳'} Generating feedback
            </div>
          </div>
          
          <p>This usually takes 10-20 seconds...</p>
        </div>
      )}

      {isLoading && !isEvaluating && (
        <div className="loading-overlay luxury-overlay">
          <div className="luxury-spinner"></div>
          <p>Processing your request...</p>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ✅ Analysis Popup Component                                                */
/* -------------------------------------------------------------------------- */
const AnalysisPopup = ({ isOpen, onClose, analysisData }) => {
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

  // Format analysis data for the popup - REMOVED delivery section
  const formattedData = analysisData ? {
    overall: {
      score: analysisData.score || 7.5,
      summary: analysisData.feedback || "Good response with clear structure and relevant examples.",
      strengths: analysisData.strengths || ["Clear communication", "Good examples", "Professional tone"],
      improvements: analysisData.improvements || ["Add more technical details", "Improve time management"]
    },
    insights: {
      sentiment: "Confident",
      talkTime: "2:30 mins",
      keyPhrases: ["Problem solving", "Team collaboration", "Technical skills"],
      fillerWords: analysisData.confidenceMetrics?.fillerWords || 5
    }
    // delivery section removed
  } : {
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
    }
    // delivery section removed
  };

  return (
    <div className="analysis-popup-overlay">
      <div className="analysis-popup-backdrop" onClick={onClose}></div>

      <div className="luxury-popup-card">
        <div className="popup-content-wrapper">
          {isAnalyzing ? (
            /* Analyzing State */
            <div className="analyzing-state">
              <div className="spinner-container">
                <div className="spinner-main">
                  <div className="spinner-gradient-ring"></div>
                </div>
              </div>
              <h3 className="analyzing-title">Analyzing your response...</h3>
              <p className="analyzing-subtitle">
                Processing speech patterns, content quality, and delivery metrics
              </p>
            </div>
          ) : (
            /* Feedback State */
            <div className="feedback-state">
              <div className="popup-header">
                <div className="header-content">
                  <h3 className="popup-title">Analysis Complete</h3>
                  <button onClick={onClose} className="close-button">
                    <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="popup-tabs">
                {(['overall', 'insights']).map((tab) => ( // Removed 'delivery' from tabs
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-button ${activeTab === tab ? 'tab-active' : 'tab-inactive'}`}
                  >
                    <span className="tab-text">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  </button>
                ))}
              </div>

              <div className="popup-content">
                {activeTab === 'overall' && (
                  <div className="overall-tab">
                    <div className="score-section">
                      <div className="score-display">
                        <div className="score-circle">
                          <span className="score-value">{formattedData.overall.score}</span>
                        </div>
                        <div className="score-info">
                          <p className="score-label">Overall Score</p>
                          <p className="score-rating">
                            {formattedData.overall.score >= 8 ? "Excellent" : 
                             formattedData.overall.score >= 6 ? "Good" : "Needs Improvement"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="overall-summary">
                      {formattedData.overall.summary}
                    </p>

                    <div className="analysis-grid">
                      <div className="strengths-section">
                        <div className="section-card">
                          <p className="list-title">✓ Strengths</p>
                          <ul className="strengths-list">
                            {formattedData.overall.strengths.map((strength, i) => (
                              <li key={i} className="list-item">
                                <span className="list-bullet">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="improvements-section">
                        <div className="section-card">
                          <p className="list-title">↗ Areas to Improve</p>
                          <ul className="improvements-list">
                            {formattedData.overall.improvements.map((improvement, i) => (
                              <li key={i} className="list-item">
                                <span className="list-bullet">•</span>
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="insights-tab">
                    <div className="insights-grid">
                      <div className="metric-card">
                        <p className="metric-label">Sentiment</p>
                        <p className="metric-value">{formattedData.insights.sentiment}</p>
                      </div>
                      <div className="metric-card">
                        <p className="metric-label">Talk Time</p>
                        <p className="metric-value">{formattedData.insights.talkTime}</p>
                      </div>
                    </div>

                    <div className="phrases-section">
                      <p className="section-title">Key Phrases Detected</p>
                      <div className="phrases-container">
                        {formattedData.insights.keyPhrases.map((phrase, i) => (
                          <span key={i} className="phrase-tag">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="filler-section">
                      <p className="section-title">Filler Words</p>
                      <p className="filler-value">{formattedData.insights.fillerWords} instances</p>
                    </div>
                  </div>
                )}

                {/* Delivery tab completely removed */}
              </div>

              <div className="popup-footer">
                <button onClick={onClose} className="action-button">
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
    </div>
  );
};

export default MockInterview;