import React, { useEffect, useRef, useState } from "react";
import "./QuestionDisplay.css";

const QuestionDisplay = ({
  question,
  questionNumber,
  totalQuestions,
  onNextQuestion,
  autoPlay = false,
  transcript = "",
  onAutoFail = () => {}
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(150); // 2:30
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const utteranceRef = useRef(null);
  const timerRef = useRef(null);
  const shouldStartRef = useRef(false); // ✅ start-timer-after-reset flag

  /* --------------------------- Voice playback --------------------------- */
  const playQuestion = () => {
    if (!question) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopQuestion = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  /* ------------------------------ Timer API ----------------------------- */
  const startTimer = () => {
    if (!isTimerRunning && timeLeft > 0) setIsTimerRunning(true);
  };
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(150);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const getTimerColor = () => (timeLeft > 60 ? "green" : timeLeft > 30 ? "orange" : "red");

  /* --------------------- Interval (ticks when running) ------------------- */
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  /* --------------- On question change: reset, then start ---------------- */
  useEffect(() => {
    // Clear any running interval and speech, reset time
    clearInterval(timerRef.current);
    window.speechSynthesis.cancel();

    setIsTimerRunning(false);
    shouldStartRef.current = true;       // ✅ tell the next effect to start the timer
    setTimeLeft(150);                     // triggers the effect below
  }, [question]);

  // When timeLeft lands on the reset value, start the timer (and auto-play if needed)
  useEffect(() => {
    if (shouldStartRef.current && timeLeft === 150) {
      shouldStartRef.current = false;
      setIsTimerRunning(true);            // ✅ start after reset actually applied
      if (autoPlay && question) playQuestion();
    }
  }, [timeLeft, autoPlay, question]);

  /* --------- Time-out: auto fail (score 0) and go to next question ------ */
  useEffect(() => {
    if (timeLeft === 0) {
      onAutoFail({ score: 0, question });
      const t = setTimeout(() => onNextQuestion(), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft, onAutoFail, onNextQuestion, question]);

  /* ------------------------------- UI ----------------------------------- */
  return (
    <div className="question-display">
      <div className="progress-header">
        <span className="progress-info">Question {questionNumber} of {totalQuestions}</span>
        <div className={`timer ${getTimerColor()}`}>
          ⏱ {formatTime(timeLeft)}
          <div className="timer-controls">
            {isTimerRunning ? (
              <button className="timer-btn" onClick={pauseTimer} title="Pause timer">⏸</button>
            ) : (
              <button className="timer-btn" onClick={startTimer} title="Start timer">▶</button>
            )}
            <button className="timer-btn" onClick={resetTimer} title="Reset timer">🔄</button>
          </div>
        </div>
      </div>

      <div className="question-card">
        <p className="question-text">{question}</p>

        <div className="audio-controls">
          <button
            className="audio-btn play"
            onClick={() => { playQuestion(); startTimer(); }}
            disabled={isPlaying}
          >
            {isPlaying ? "🔊 Playing..." : "▶ Play Question"}
          </button>
          <button className="audio-btn stop" onClick={stopQuestion}>⏹ Stop</button>
        </div>

        <div className="transcript-section">
          <h4 className="transcript-title">Live Transcript</h4>
          <div className={`transcript-box ${transcript ? "active" : ""}`}>
            {transcript ? transcript : "Speak your answer... I will transcribe in real time."}
          </div>
        </div>
      </div>

      <div className="navigation-controls">
        <button className="nav-btn prev-btn" onClick={() => alert("Previous coming soon")}>← Previous</button>
        <span className="question-counter">{questionNumber}/{totalQuestions}</span>
        <button className="nav-btn next-btn" onClick={onNextQuestion}>Next →</button>
      </div>

      {timeLeft === 0 && (
        <div className="time-up-alert">⏰ Time's up! Moving to next question...</div>
      )}
    </div>
  );
};

export default QuestionDisplay;
