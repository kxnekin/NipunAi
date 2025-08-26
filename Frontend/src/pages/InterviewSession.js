import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { speak, createRecognizer } from "./utils/speech";
import { hrQuestions, techQuestions } from "./data/interviewQuestions";

const FILLERS = ["um","uh","like","you know","actually","basically","literally","kind of","sort of","kinda"];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function InterviewSession() {
  const query = useQuery();
  const type = query.get("type") === "tech" ? "tech" : "hr";
  const questions = type === "tech" ? techQuestions : hrQuestions;

  // state
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [highAccuracy, setHighAccuracy] = useState(false); // 🔥 toggle

  const videoRef = useRef(null);
  const recRef = useRef(null);
  const mediaRecorderRef = useRef(null); // for High-Accuracy audio
  const audioChunksRef = useRef([]);
  const nav = useNavigate();

  // CAMERA PREVIEW: video only (no audio) → no echo
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.muted = true; }
      } catch {}
    })();
  }, []);

  // Browser STT recognizer (fallback mode)
  useEffect(() => {
    const rec = createRecognizer({
      onResult: (text) => setAnswer(text),
      onEnd: () => setListening(false),
    });
    if (!rec) setSupported(false);
    recRef.current = rec;
  }, []);

  const question = questions[idx];
  const progress = Math.round(((idx + 1) / questions.length) * 100);

  // ---- High-Accuracy recorder helpers ----
  async function startHighAccRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("audio", blob, "answer.webm");
      try {
        const { data } = await axios.post("http://localhost:5000/api/interview/transcribe", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setAnswer(data.text || "");
      } catch {
        alert("Transcription failed. Check backend & OPENAI_API_KEY.");
      }
    };

    mediaRecorder.start();
  }

  function stopHighAccRecording() {
    try { mediaRecorderRef.current?.stop(); } catch {}
    mediaRecorderRef.current = null;
  }

  // Listen (browser STT OR High-Accuracy)
  function startListening() {
    if (isSpeaking) return;
    setAnswer("");
    if (highAccuracy) {
      startHighAccRecording().then(() => setListening(true));
      return;
    }
    try { window.speechSynthesis.cancel(); } catch {}
    try { recRef.current?.start(); setListening(true); } catch { setListening(false); }
  }

  function stopListening() {
    setListening(false);
    if (highAccuracy) { stopHighAccRecording(); return; }
    try { recRef.current?.stop(); } catch {}
  }

  // STRICT evaluation
  function evaluate(q, a) {
    const txt = (a || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
    const words = txt.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount === 0) return { s: 0, fb: "No answer detected." };

    // CONTENT (0..60)
    const targets = (q.keywords || []).map(k => k.toLowerCase());
    const hitSet = new Set();
    for (const t of targets) {
      const need = t.split(/\s+/);                           // allow multiword keys
      const matched = need.every(w => txt.includes(w));      // all words present
      if (matched) hitSet.add(t);
    }
    const contentRaw = (hitSet.size / Math.max(1, targets.length)) * 60;

    // DELIVERY (0..20)
    const fillerCount = FILLERS.reduce((acc, f) => acc + (txt.split(f).length - 1), 0);
    let delivery = 20;
    if (fillerCount >= 1) delivery -= Math.min(12, fillerCount * 3); // stronger penalty
    if (/(very|really|actually|basically)\s+(very|really)/.test(txt)) delivery -= 2;

    // LENGTH & CONCISENESS (0..10 part of delivery)
    if (wordCount < 35) delivery -= 4;             // too short
    if (wordCount > 180) delivery -= 4;            // too long / waffling

    // STRUCTURE (0..20)
    let structure = 0;
    if (type === "hr") {
      const s = txt.includes("situation");
      const t = txt.includes("task");
      const a1 = txt.includes("action");
      const r = txt.includes("result");
      if (s) structure += 5; if (t) structure += 5; if (a1) structure += 5; if (r) structure += 5;
      if (r && /(\d+%|\d+\s+(?:users|customers|points|sales|revenue|bugs))/.test(txt)) structure += 2; // quantify result
      structure = Math.min(20, structure);
    } else {
      const def = /define|definition|is a|is an/.test(txt);
      const ex = /example|for instance|e\.g\./.test(txt);
      const cx = /complexity|time|space|big o|o\(/.test(txt);
      const tr = /tradeoff|vs\.|versus|compare/.test(txt);
      structure += def ? 5 : 0;
      structure += ex ? 5 : 0;
      structure += cx ? 5 : 0;
      structure += tr ? 5 : 0;
    }

    // OFF-TOPIC penalty if content too low
    let penalty = 0;
    if (contentRaw < 25) penalty += 10;
    if (contentRaw < 15) penalty += 10;

    const s = Math.max(0, Math.min(100, Math.round(contentRaw + delivery + structure - penalty)));

    // Feedback
    const missing = targets.filter(t => !hitSet.has(t)).slice(0, 4);
    const tips = [];
    if (missing.length) tips.push(`Cover these: ${missing.join(", ")}.`);
    if (!/example|for instance|e\.g\./.test(txt) && type === "tech") tips.push("Add a quick example + complexity.");
    if (type === "hr" && !txt.includes("result")) tips.push("End with the result and measurable impact (STAR).");
    if (fillerCount > 1) tips.push("Reduce filler words (um/uh/like).");
    if (wordCount < 35) tips.push("Answer feels short—add context and one example.");
    if (wordCount > 180) tips.push("Be concise—trim to the essence in ~90–120 words.");
    const fb = tips.length ? tips.join(" ") : "Concise, on-point, and well structured. Nice!";

    return { s, fb };
  }

  async function askQuestion() {
    setAnswer(""); setFeedback("");
    setIsSpeaking(true);
    stopListening();
    try { await speak(`Question ${idx + 1}. ${question.question}`); }
    finally {
      setTimeout(() => { setIsSpeaking(false); startListening(); }, 350);
    }
  }

  function submitAnswer() {
    stopListening();
    const { s, fb } = evaluate(question, answer);
    setScore(s);
    setFeedback(fb);
    setList(prev => [...prev, { q: question.question, a: answer, score: s, feedback: fb }]);
    setTotal(prev => prev + s);
  }

  async function nextQuestion() {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setScore(0); setFeedback(""); setAnswer("");
      await askQuestion();
    } else {
      setIsSpeaking(true);
      try { await speak("Interview finished. Great job!"); }
      finally { setIsSpeaking(false); }
    }
  }

  async function saveSession() {
    try {
      const email = localStorage.getItem("studentEmail") || "anonymous@example.com";
      await axios.post("http://localhost:5000/api/interview/sessions", {
        email, type, totalScore: total, items: list,
      });
      alert("Session saved!");
      nav("/student-dashboard");
    } catch {
      alert("Could not save session. Is backend running?");
    }
  }

  useEffect(() => { askQuestion(); /* auto start */ // eslint-disable-next-line
  }, [idx]);

  return (
    <div className="wrap">
      <style>{`
        .wrap{
          min-height:100vh;
          background:
            radial-gradient(1200px 600px at 10% -20%, #e3f2ff 0%, transparent 60%),
            radial-gradient(900px 500px at 90% 10%, #ffe7f0 0%, transparent 60%),
            linear-gradient(180deg, #0f172a 0%, #111827 100%);
          padding:28px; color:#e5e7eb; font-family:Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial;
          display:flex; align-items:center; justify-content:center;
        }
        .shell{width:100%; max-width:1180px; display:grid; grid-template-columns:0.95fr 1.2fr; gap:22px}
        .pane{background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08);
          border-radius:20px; padding:18px; backdrop-filter:blur(12px); box-shadow:0 16px 46px rgba(0,0,0,0.35)}
        .head{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px}
        .title{font-weight:800; color:#f9fafb; font-size:18px}
        .switch{display:flex; align-items:center; gap:8px; font-size:13px; color:#cbd5e1}
        .progress{height:8px; border-radius:999px; background:rgba(255,255,255,0.08); overflow:hidden; margin-bottom:12px}
        .bar{height:100%; background:linear-gradient(90deg,#60a5fa 0%,#e879f9 100%); width:0%; transition:width 260ms ease}
        .video{width:100%; aspect-ratio:4/3; background:#000; border-radius:14px; object-fit:cover; border:1px solid rgba(255,255,255,0.08)}
        .status{display:flex; gap:10px; flex-wrap:wrap; margin:10px 0 12px}
        .pill{padding:6px 10px; border-radius:999px; border:1px solid rgba(255,255,255,0.16); background:rgba(255,255,255,0.06); color:#cbd5e1; font-size:12px}
        .controls{display:flex; flex-wrap:wrap; gap:10px}
        .btn{padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.12); background:rgba(255,255,255,0.08); color:#f9fafb; cursor:pointer; transition:160ms}
        .btn:hover{transform:translateY(-1px); background:rgba(255,255,255,0.12)}
        .primary{background:linear-gradient(135deg,#60a5fa 0%,#e879f9 100%); border:none; color:white; box-shadow:0 10px 24px rgba(96,165,250,0.25)}
        .textarea{width:100%; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.14); background:rgba(0,0,0,0.2); color:#e5e7eb; min-height:140px; resize:vertical}
        .card{background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px; margin-top:10px}
        .muted{color:#94a3b8; font-size:13px}
        input[type="checkbox"]{transform:scale(1.2)}
      `}</style>

      <div className="shell">
        {/* LEFT */}
        <div className="pane">
          <div className="head">
            <div className="title">Interview — {type.toUpperCase()}</div>
            <label className="switch">
              <input type="checkbox" checked={highAccuracy} onChange={e=>setHighAccuracy(e.target.checked)} />
              High-Accuracy Speech
            </label>
          </div>

          <div className="progress"><div className="bar" style={{ width: `${progress}%` }} /></div>

          <video ref={videoRef} autoPlay playsInline muted className="video" />

          <div className="status">
            <span className="pill">Q {idx + 1} / {questions.length}</span>
            <span className="pill">Listening: <b>{listening ? "Yes" : "No"}</b></span>
            {isSpeaking && <span className="pill">Speaking question… 🔊</span>}
            {!supported && !highAccuracy && <span className="pill">Browser STT not supported — turn on High-Accuracy</span>}
          </div>

          <div className="controls">
            <button className="btn" onClick={() => askQuestion()}>🔁 Repeat</button>
            <button className="btn" onClick={() => { stopListening(); setTimeout(startListening,150); }} disabled={isSpeaking}>🎤 Start</button>
            <button className="btn" onClick={stopListening}>⏹ Stop</button>
            <button className="btn primary" onClick={submitAnswer}>✅ Evaluate</button>
            <button className="btn" onClick={nextQuestion}>➡️ Next</button>
            <button className="btn" onClick={saveSession} disabled={list.length === 0}>💾 Finish & Save</button>
          </div>

          <div className="card muted">Tip: Be crisp, include one example, and finish with impact. Fewer fillers = higher score.</div>
        </div>

        {/* RIGHT */}
        <div className="pane">
          <div className="title">{questions[idx].company} — {questions[idx].question}</div>

          <textarea
            className="textarea"
            placeholder="Your answer appears here (or type if mic not supported)…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="card">
            <div><b>Score (this answer):</b> {score}/100</div>
            <div><b>Total so far:</b> {total}</div>
            <div className="muted" style={{ marginTop: 6 }}>{feedback}</div>
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="title" style={{ marginBottom: 6 }}>Previous Answers</div>
            <ol>
              {list.map((it, i) => (
                <li key={i} style={{ margin: "10px 0" }}>
                  <div><b>Q{i+1}:</b> {it.q}</div>
                  <div><b>Ans:</b> {it.a}</div>
                  <div className="muted"><b>Score:</b> {it.score} — {it.feedback}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
