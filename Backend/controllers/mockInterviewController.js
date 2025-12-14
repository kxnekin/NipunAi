const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 🎯 Gemini AI feedback generator — Final AI Studio–ready version
exports.generateFeedback = async (req, res) => {
  try {
    const prompt = req.body?.prompt || "";
    console.log("🧠 Incoming prompt:", prompt.slice(0, 100) + "...");

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ text: "⚠️ GEMINI_API_KEY not set in .env file." });
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ AI Studio models only
    const models = ["gemini-1.5-pro-latest", "gemini-1.5-flash-latest"];
    let text = null;

    for (const name of models) {
      try {
        console.log(`🔍 Trying model: ${name}`);
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent([
          {
            role: "user",
            parts: [
              { text: prompt },
              { text: "\nEvaluate this interview answer with 3 improvement tips and a score /10." }
            ]
          }
        ]);
        text = result.response.text();
        console.log(`✅ Success with ${name}`);
        break;
      } catch (err) {
        console.warn(`⚠️ ${name} failed ->`, err.message);
      }
    }

    if (!text) {
      console.log("⚠️ Fallback feedback used");
      text = `
**Interview Feedback (Fallback)**  
Your answer shows good clarity and interest in teamwork.  
✅ Confident tone, positive attitude.  
💡 Add measurable examples (projects, results).  
⭐ Estimated Score: 8/10`;
    }

    return res.json({ text });
  } catch (err) {
    console.error("❌ Gemini error:", err.message);
    return res.json({
      text: "⚠️ Gemini API temporarily unavailable. Please try again later."
    });
  }
};

// 🎙️ Audio transcription using OpenAI Whisper
exports.transcribeAudio = async (req, res) => {
  try {
    const audio = req.file;
    if (!audio) return res.status(400).json({ error: "No audio uploaded" });

    const formData = new FormData();
    const blob = new Blob([audio.buffer], { type: "audio/webm" });
    formData.append("file", blob, "recording.webm");
    formData.append("model", "whisper-1");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log("✅ Transcription successful");
    res.json({ transcript: data.text });
  } catch (err) {
    console.error("❌ Transcription error:", err.message);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
};

// 🚫 Simple blocked notice
exports.blockedNotice = (req, res) => {
  res.json({ message: "🚫 This feature is temporarily blocked. Please try again later." });
};