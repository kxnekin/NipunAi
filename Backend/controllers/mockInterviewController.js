// ================== mockInterviewController.js ================== //

// 🎤 Transcribe audio using Whisper or fallback
exports.transcribeAudio = async (req, res) => {
  try {
    const audio = req.file;
    if (!audio) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
    const formData = new FormData();
    formData.append("file", audio.buffer, "recording.webm");
    formData.append("model", "whisper-1");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    const data = await openaiRes.json();
    res.json({ transcript: data.text || "Transcription failed." });
  } catch (error) {
    console.error("❌ Transcription Error:", error.message);
    res.json({ transcript: "[Error during transcription]" });
  }
};

// 🤖 Generate interview feedback using Gemini
exports.generateFeedback = async (req, res) => {
  try {
    const prompt = req.body?.prompt || "No prompt received.";
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    res.json({ text });
  } catch (error) {
    console.error("❌ Feedback generation error:", error.message);
    res.json({ text: "[Feedback unavailable — please try again later.]" });
  }
};

// 🚫 Temporary "blocked" notice route
exports.blockedNotice = (req, res) => {
  res.json({ message: "This feature is currently unavailable. Please try again later." });
};
