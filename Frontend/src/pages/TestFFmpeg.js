import React, { useState } from "react";
import { transcodeVideo, extractAudio } from "./utils/ffmpeg";

export default function TestFFmpeg() {
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    try {
      if (!file) return alert("Upload a file first!");
      setLoading(true);
      const result = await transcodeVideo(file);
      setVideoURL(URL.createObjectURL(result));
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Conversion failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    try {
      if (!file) return alert("Upload a file first!");
      setLoading(true);
      const result = await extractAudio(file);
      setAudioURL(URL.createObjectURL(result));
      setError("");
    } catch (err) {
      console.error(err);
      setError("❌ Audio extraction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 30,
        textAlign: "center",
        color: "#fff",
        background: "#0d0d0d",
        minHeight: "100vh",
      }}
    >
      <h2>🎥 FFmpeg Test - NipunAI</h2>

      <input
        type="file"
        accept="video/*,audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ margin: "20px 0" }}
      />

      <div>
        <button
          onClick={handleConvert}
          style={{
            marginRight: 10,
            backgroundColor: "#4A90E2",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Convert to MP4
        </button>

        <button
          onClick={handleExtract}
          style={{
            backgroundColor: "#7B61FF",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Extract Audio (MP3)
        </button>
      </div>

      {loading && <p style={{ marginTop: 20 }}>⚙️ Processing... please wait</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {videoURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Converted Video</h3>
          <video controls src={videoURL} width="480" />
        </div>
      )}

      {audioURL && (
        <div style={{ marginTop: 20 }}>
          <h3>Extracted Audio</h3>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
}
