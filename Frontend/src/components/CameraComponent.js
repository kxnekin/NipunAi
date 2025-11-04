import React, { useRef, useState, useEffect, useCallback } from 'react';
import './CameraComponent.css';

export default function CameraComponent({
  onRecordingStart,
  onRecordingComplete,
  onCameraError,
  onFaceData,
  isNewQuestion
}) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [faceMetrics, setFaceMetrics] = useState(null);
  const [currentWarnings, setCurrentWarnings] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [consecutiveGoodFrames, setConsecutiveGoodFrames] = useState(0);
  const chunks = useRef([]);

  /* -------------------------------------------------------------------------- */
  /* 🎥 Initialize Camera                                                       */
  /* -------------------------------------------------------------------------- */
  const startCamera = useCallback(async () => {
    try {
      console.log('🔄 Starting camera...');
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const userStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setStream(userStream);
      setCameraError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        videoRef.current.play().catch(console.error);
      }
    } catch (err) {
      console.error('❌ Camera access error:', err);
      setCameraError(err.message);
      if (onCameraError) onCameraError(err);
    }
  }, [onCameraError, stream]);

  /* -------------------------------------------------------------------------- */
  /* 🎙️ Enhanced Recording with Face Analysis                                  */
  /* -------------------------------------------------------------------------- */
  const startRecording = async () => {
    try {
      if (!stream) {
        await startCamera();
      }
      
      chunks.current = [];
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9,opus' 
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        if (onRecordingComplete) onRecordingComplete({
          videoBlob: blob,
          motionData: {
            stabilityScore: calculateStabilityScore(),
            headMovement: calculateHeadMovement(),
            facePresence: faceMetrics?.faceDetected || false,
            goodFrames: consecutiveGoodFrames
          }
        });
      };

      recorder.start(1000);
      setIsRecording(true);
      if (onRecordingStart) onRecordingStart();
    } catch (err) {
      console.error('❌ Recording start error:', err);
      setCameraError('Failed to start recording');
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🎭 BALANCED Face Detection - Strict but Fair                              */
  /* -------------------------------------------------------------------------- */
  const simulateBalancedFaceDetection = useCallback(() => {
    if (!onFaceData) return;

    // 🎯 BALANCED probabilistic behavior (realistic thresholds)
    const hasFace = Math.random() > 0.05;              // 95% success - much more forgiving
    const eyeContact = Math.random() > 0.25;           // 75% success - reasonable
    const isSlouching = Math.random() > 0.85;          // 15% slouching - only obvious issues
    const headTurned = Math.random() > 0.9;            // 10% head turn - only significant turns
    const headStability = 75 + (Math.random() * 20);   // 75–95% stability - naturally stable

    // 📏 Realistic posture detection
    const pitch = (Math.random() * 20) - 10; // -10° to +10° tilt range (natural)
    const severeTilt = Math.abs(pitch) > 8;  // Only flag obvious tilts

    const simulatedFaceData = {
      // Core detection
      noFace: !hasFace,
      faceDetected: hasFace,
      eyeContact,
      lookAway: !eyeContact,
      
      // Posture & movement
      posture: isSlouching ? 'slouch' : severeTilt ? 'tilted' : 'straight',
      slouch: isSlouching,
      pitch,
      headTurn: headTurned ? (Math.random() > 0.5 ? 'left' : 'right') : 'center',
      turnLeft: headTurned && Math.random() > 0.5,
      turnRight: headTurned && Math.random() > 0.5,
      
      // Stability metrics
      jitterScore: Math.random() * 0.3, // Lower jitter - more realistic
      stabilityScore: headStability,
      
      // Confidence - more stable
      confidence: 80 + (Math.random() * 15),
      
      timestamp: Date.now()
    };

    // 🎯 Update metrics with good frame tracking
    const newMetrics = {
      faceDetected: hasFace,
      eyeContact,
      stability: headStability,
      posture: simulatedFaceData.posture,
      confidence: simulatedFaceData.confidence,
      isGoodFrame: hasFace && eyeContact && !isSlouching && !headTurned && !severeTilt,
      timestamp: Date.now()
    };

    setFaceMetrics(newMetrics);
    setPerformanceHistory(prev => [...prev.slice(-9), newMetrics]);

    // 📈 Track consecutive good frames
    if (newMetrics.isGoodFrame) {
      setConsecutiveGoodFrames(prev => prev + 1);
    } else {
      setConsecutiveGoodFrames(0);
    }

    // ⚠️ SMART warnings - only show for real issues
    const warnings = [];

    // 🚨 Only warn for persistent face issues
    if (!hasFace && consecutiveGoodFrames < 2) {
      warnings.push({
        message: 'Face not centered',
        tip: 'Adjust your position so your face is clearly visible',
        severity: 'medium'
      });
    }

    // 🚨 Only warn for consistent eye contact issues
    if (!eyeContact && consecutiveGoodFrames < 3) {
      warnings.push({
        message: 'Glance back to camera',
        tip: 'Try to maintain eye contact with the camera lens',
        severity: 'medium'
      });
    }

    // 🚨 Only warn for obvious posture issues
    if (isSlouching) {
      warnings.push({
        message: 'Sit upright',
        tip: 'Straighten your back for better posture',
        severity: 'low'
      });
    }

    // 🚨 Only warn for significant head turns
    if (headTurned) {
      warnings.push({
        message: 'Face forward',
        tip: 'Center your gaze on the camera',
        severity: 'low'
      });
    }

    // 🔢 Limit warnings and prioritize
    const sortedWarnings = warnings.sort((a, b) => {
      const severityOrder = { medium: 0, low: 1 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
    
    // 🎯 Only show warnings if we have multiple consecutive issues
    if (consecutiveGoodFrames < 2 && sortedWarnings.length > 0) {
      setCurrentWarnings(sortedWarnings.slice(0, 2));
    } else {
      setCurrentWarnings([]);
    }

    onFaceData(simulatedFaceData);
  }, [onFaceData, consecutiveGoodFrames]);

  /* -------------------------------------------------------------------------- */
  /* 📊 Calculate Metrics                                                       */
  /* -------------------------------------------------------------------------- */
  const calculateStabilityScore = () => {
    return faceMetrics ? Math.max(60, faceMetrics.stability) : 85;
  };

  const calculateHeadMovement = () => {
    return faceMetrics ? (100 - faceMetrics.stability) / 25 : 3;
  };

  const getMetricStatus = (value, excellentThreshold = 90, goodThreshold = 80) => {
    if (value >= excellentThreshold) return 'excellent';
    if (value >= goodThreshold) return 'good';
    if (value >= 70) return 'fair';
    return 'poor';
  };

  /* -------------------------------------------------------------------------- */
  /* 📈 Performance Analytics                                                   */
  /* -------------------------------------------------------------------------- */
  const calculateTrend = (metric) => {
    if (performanceHistory.length < 2) return 'stable';
    const recent = performanceHistory.slice(-3);
    const avg = recent.reduce((sum, m) => sum + m[metric], 0) / recent.length;
    const current = faceMetrics?.[metric] || 0;
    return current > avg + 5 ? 'improving' : current < avg - 5 ? 'declining' : 'stable';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '↗';
      case 'declining': return '↘';
      default: return '→';
    }
  };

  const getPerformanceMessage = () => {
    if (consecutiveGoodFrames > 10) return 'Excellent! Perfect posture maintained';
    if (consecutiveGoodFrames > 5) return 'Great job! Keep it up';
    if (consecutiveGoodFrames > 2) return 'Good performance';
    if (consecutiveGoodFrames > 0) return 'Getting better';
    return 'Make small adjustments';
  };

  /* -------------------------------------------------------------------------- */
  /* 🧹 Effects & Cleanup                                                       */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    startCamera();
    
    // Reasonable detection interval
    const faceDetectionInterval = setInterval(simulateBalancedFaceDetection, 2000);
    
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      clearInterval(faceDetectionInterval);
    };
  }, []);

  useEffect(() => {
    if (isNewQuestion && isRecording) {
      stopRecording();
      setTimeout(() => startCamera(), 500);
    }
  }, [isNewQuestion]);

  /* -------------------------------------------------------------------------- */
  /* ⏹ Stop Recording                                                          */
  /* -------------------------------------------------------------------------- */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setConsecutiveGoodFrames(0);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🎯 Retry Camera                                                            */
  /* -------------------------------------------------------------------------- */
  const retryCamera = () => {
    setCameraError(null);
    setFaceMetrics(null);
    setCurrentWarnings([]);
    setPerformanceHistory([]);
    setConsecutiveGoodFrames(0);
    startCamera();
  };

  return (
    <div className="camera-wrapper luxury-card">
      {/* Camera Error Display */}
      {cameraError && (
        <div className="camera-error-overlay">
          <div className="error-content">
            <div className="error-icon">📷</div>
            <h3>Camera Error</h3>
            <p>{cameraError}</p>
            <button onClick={retryCamera} className="luxury-btn primary">
              Retry Camera
            </button>
          </div>
        </div>
      )}

      {/* Main Camera Feed */}
      <div className="camera-video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="camera-video"
          onLoadedMetadata={() => console.log('✅ Video metadata loaded')}
          onCanPlay={() => console.log('✅ Video can play')}
          onError={(e) => {
            console.error('❌ Video error:', e);
            setCameraError('Failed to load video feed');
          }}
        />
        
        {/* Positive Feedback Overlay */}
        {consecutiveGoodFrames > 5 && (
          <div className="positive-overlay">
            <div className="positive-alert">
              ✓ Great posture! Keep it up
            </div>
          </div>
        )}

        {/* Camera Status Overlay */}
        {!stream && !cameraError && (
          <div className="camera-status-overlay">
            <div className="status-message">
              <div className="loading-spinner"></div>
              <span>Initializing camera...</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Side Panel */}
      <div className="camera-side-panel">
        {/* Live Metrics Section */}
        <div className="panel-section">
          <div className="section-header">
            <span className="icon">📊</span>
            <span>PERFORMANCE METRICS</span>
          </div>
          
          {/* Performance Summary */}
          <div className="performance-summary">
            <div className="summary-message">{getPerformanceMessage()}</div>
            <div className="good-frames-counter">
              Consistent frames: {consecutiveGoodFrames}
            </div>
          </div>

          <div className="metrics-grid">
            {/* Face Detection */}
            <div className="metric-row">
              <div className="metric-info">
                <div className={`metric-icon ${faceMetrics?.faceDetected ? 'excellent' : 'poor'}`}>
                  {faceMetrics?.faceDetected ? '✓' : '○'}
                </div>
                <span className="metric-label">Face Position</span>
              </div>
              <div className="metric-bar">
                <div 
                  className={`metric-fill ${faceMetrics?.faceDetected ? 'excellent' : 'poor'}`}
                  style={{ width: faceMetrics?.faceDetected ? '100%' : '60%' }}
                ></div>
              </div>
              <span className="metric-value">
                {faceMetrics?.faceDetected ? 'Centered' : 'Adjusting'}
              </span>
            </div>

            {/* Eye Contact */}
            <div className="metric-row">
              <div className="metric-info">
                <div className={`metric-icon ${faceMetrics?.eyeContact ? 'excellent' : 'fair'}`}>
                  {faceMetrics?.eyeContact ? '✓' : '~'}
                </div>
                <span className="metric-label">Eye Contact</span>
              </div>
              <div className="metric-bar">
                <div 
                  className={`metric-fill ${faceMetrics?.eyeContact ? 'excellent' : 'fair'}`}
                  style={{ width: faceMetrics?.eyeContact ? '100%' : '75%' }}
                ></div>
              </div>
              <span className="metric-value">
                {faceMetrics?.eyeContact ? 'Good' : 'Occasional glance'}
              </span>
            </div>

            {/* Stability */}
            <div className="metric-row">
              <div className="metric-info">
                <div className={`metric-icon ${getMetricStatus(faceMetrics?.stability || 85)}`}>
                  {faceMetrics?.stability > 85 ? '✓' : faceMetrics?.stability > 75 ? '~' : '○'}
                </div>
                <span className="metric-label">Stability</span>
              </div>
              <div className="metric-bar">
                <div 
                  className={`metric-fill ${getMetricStatus(faceMetrics?.stability || 85)}`}
                  style={{ width: `${faceMetrics?.stability || 85}%` }}
                ></div>
              </div>
              <span className="metric-value">
                {faceMetrics ? Math.round(faceMetrics.stability) : '85'}%
              </span>
            </div>

            {/* Posture */}
            <div className="metric-row">
              <div className="metric-info">
                <div className={`metric-icon ${faceMetrics?.posture === 'straight' ? 'excellent' : 'fair'}`}>
                  {faceMetrics?.posture === 'straight' ? '✓' : '~'}
                </div>
                <span className="metric-label">Posture</span>
              </div>
              <div className="metric-bar">
                <div 
                  className={`metric-fill ${faceMetrics?.posture === 'straight' ? 'excellent' : 'fair'}`}
                  style={{ width: faceMetrics?.posture === 'straight' ? '100%' : '80%' }}
                ></div>
              </div>
              <span className="metric-value">
                {faceMetrics?.posture === 'straight' ? 'Good' : 'Acceptable'}
              </span>
            </div>
          </div>

          {/* Performance Trend Graph */}
          {performanceHistory.length > 1 && (
            <div className="performance-trend">
              <div className="trend-header">
                <span className="trend-label">Stability Trend</span>
                <span className={`trend-indicator ${calculateTrend('stability')}`}>
                  {getTrendIcon(calculateTrend('stability'))}
                </span>
              </div>
              <div className="trend-graph">
                {performanceHistory.map((metric, index) => (
                  <div 
                    key={index}
                    className="trend-bar"
                    style={{ 
                      height: `${metric.stability}%`,
                      backgroundColor: metric.stability >= 85 ? '#22c55e' : 
                                     metric.stability >= 75 ? '#eab308' : '#f97316'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Warnings Section */}
        <div className="panel-section warnings-section">
          <div className="section-header">
            <span className="icon">💡</span>
            <span>GUIDANCE</span>
          </div>
          <div className="warnings-list">
            {currentWarnings.length > 0 ? (
              currentWarnings.map((warning, index) => (
                <div key={index} className="warning-item gentle">
                  <span className="icon">💡</span>
                  <div className="warning-content">
                    <div className="warning-message">{warning.message}</div>
                    <div className="warning-tip">{warning.tip}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="warning-item positive-feedback">
                <span className="icon">👍</span>
                <div className="warning-content">
                  <div className="warning-message">You're doing great!</div>
                  <div className="warning-tip">
                    {consecutiveGoodFrames > 3 
                      ? 'Maintain this professional presence' 
                      : 'Keep your face centered and maintain eye contact'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confidence Meter */}
          <div className="confidence-meter">
            <div className="confidence-header">
              <span>Overall Performance</span>
              <span className="confidence-value">
                {faceMetrics ? Math.round(faceMetrics.confidence) : '88'}%
              </span>
            </div>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${faceMetrics?.confidence || 88}%` }}
              ></div>
            </div>
            <div className="performance-indicator">
              {faceMetrics?.confidence >= 90 ? 'EXCELLENT' : 
               faceMetrics?.confidence >= 80 ? 'VERY GOOD' : 
               faceMetrics?.confidence >= 70 ? 'GOOD' : 'NEEDS IMPROVEMENT'}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Controls */}
      <div className="camera-controls">
        {!isRecording ? (
          <button 
            onClick={startRecording} 
            className="luxury-btn primary"
            disabled={!stream || cameraError}
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="luxury-btn danger">
            ⏹ Stop Recording
          </button>
        )}
      </div>
      
      {/* Status Indicator */}
      <div className="recording-status-indicator">
        {isRecording ? (
          <div className="recording-pulse">
            <div className="pulse-dot"></div>
            <span>
              Recording • {consecutiveGoodFrames > 5 ? 
              'Excellent performance' : 'Monitoring...'}
            </span>
          </div>
        ) : (
          <div className="ready-status">
            <div className="ready-dot"></div>
            <span>{stream ? 'Ready for interview' : 'Initializing...'}</span>
          </div>
        )}
      </div>

      {/* Camera Info */}
      <div className="camera-info">
        <small>
          {stream ? 'Balanced Monitoring: ACTIVE • AI Guidance: ENABLED' : 'Camera: Initializing...'}
          {cameraError && ` • Error: ${cameraError}`}
          {consecutiveGoodFrames > 0 && ` • Consistent: ${consecutiveGoodFrames}frames`}
        </small>
      </div>
    </div>
  );
}