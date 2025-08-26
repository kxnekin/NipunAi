import React from "react";
import { useNavigate } from "react-router-dom";

export default function InterviewLanding() {
  const nav = useNavigate();

  return (
    <div className="ai-landing">
      <style>{`
        .ai-landing {
          min-height: 100vh;
          background:
            radial-gradient(1200px 600px at 10% -20%, #e3f2ff 0%, transparent 60%),
            radial-gradient(900px 500px at 90% 10%, #ffe7f0 0%, transparent 60%),
            linear-gradient(180deg, #0f172a 0%, #111827 100%);
          display:flex; align-items:center; justify-content:center; padding:32px;
          color:#e5e7eb; font-family:Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial;
        }
        .card {
          width:100%; max-width:980px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.08);
          box-shadow:0 20px 60px rgba(0,0,0,0.35);
          backdrop-filter:blur(14px);
          border-radius:22px; padding:30px;
        }
        .head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:8px}
        .badge{display:inline-flex;align-items:center;gap:10px}
        .logo{
          display:inline-flex;align-items:center;justify-content:center;
          width:46px;height:46px;border-radius:12px;
          background:linear-gradient(135deg,#60a5fa 0%,#e879f9 100%);color:#fff;font-size:22px;
          box-shadow:0 8px 24px rgba(96,165,250,0.25);
        }
        .title{font-size:28px;font-weight:800;color:#f9fafb}
        .sub{color:#cbd5e1;margin:8px 0 20px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .opt{
          background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12);
          border-radius:18px; padding:22px; text-align:left; color:#e5e7eb; cursor:pointer; transition:160ms;
        }
        .opt:hover{transform:translateY(-2px); background:rgba(255,255,255,0.12)}
        .opttitle{font-size:20px;font-weight:800;color:#f9fafb}
        .optdesc{margin-top:6px;color:#cbd5e1}
        .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
        .pill{padding:8px 12px;border-radius:999px;border:1px dashed rgba(255,255,255,0.25);color:#cbd5e1;font-size:13px}
      `}</style>

      <div className="card">
        <div className="head">
          <div className="badge">
            <div className="logo">🧠</div>
            <div className="title">AI Interview Prep</div>
          </div>
        </div>
        <div className="sub">Pick a track and practice with voice questions, strict evaluation, and actionable feedback.</div>

        <div className="grid">
          <button className="opt" onClick={() => nav("/interview/session?type=hr")}>
            <div className="opttitle">HR Questions</div>
            <div className="optdesc">Behavioral (STAR), communication, real examples</div>
          </button>

          <button className="opt" onClick={() => nav("/interview/session?type=tech")}>
            <div className="opttitle">Technical Questions</div>
            <div className="optdesc">CS fundamentals, complexity & tradeoffs, crisp explanations</div>
          </button>
        </div>

        <div className="row">
          <span className="pill">Mic + Camera required</span>
          <span className="pill">High-Accuracy Speech mode available</span>
          <span className="pill">Works best on Chrome</span>
        </div>
      </div>
    </div>
  );
}
