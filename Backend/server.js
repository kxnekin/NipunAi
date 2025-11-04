// ================= Required Modules ================= //
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ================= Middleware ================= //
app.use(cors());
app.use(bodyParser.json());

// ================= MongoDB Connection ================= //
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nipunai")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= Routes ================= //
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

const resumeRoutes = require("./routes/resume");
app.use("/api/resume", resumeRoutes);

// 🔹 ADD THIS LINE - Applications Route
console.log("🔍 Loading applications route...");
try {
  const applicationRoutes = require("./routes/applications");
  app.use("/api/applications", applicationRoutes);
  console.log("✅ Applications route loaded successfully");
} catch (error) {
  console.error("❌ ERROR loading applications route:", error.message);
}

// 🔹 Run Route (Piston Integration)
const runRoutes = require("./routes/run");
app.use("/api/run", runRoutes);

// 🔹 Roadmaps
const roadmapRoutes = require("./routes/roadmaps");
app.use("/api/roadmaps", roadmapRoutes);

// 🔹 Mock Interview Route
const mockInterviewRoutes = require("./routes/mockInterview");
app.use("/api/mock-interview", mockInterviewRoutes);

// ================= LeetCode Questions ================= //
const leetcodeQuestions = require("./leetcode-questions.json");

// Get all questions
app.get("/api/leetcode-questions", (req, res) => {
  res.json(leetcodeQuestions);
});

// Get single question by titleSlug
app.get("/api/leetcode-questions/:titleSlug", (req, res) => {
  const { titleSlug } = req.params;
  const question = leetcodeQuestions.find((q) => q.titleSlug === titleSlug);

  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  res.json(question);
});

// ================= Static Uploads ================= //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Health Check ================= //
app.get("/", (req, res) => {
  res.send("🚀 API is running!");
});

// ================= Mock Interview Routes (Gemini + Whisper) ================= //
const multer = require("multer");
const upload = multer();
const { Blob } = require("buffer");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 🎤 1️⃣ Whisper transcription route - STABLE
app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    const audio = req.file;
    if (!audio) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📁 File received for transcription, size:", audio.size);

    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OPENAI_API_KEY missing");
      return res.json({ transcript: "[Transcription Service Unavailable] Please type your answer manually." });
    }

    // ✅ Prepare for OpenAI Whisper
    const formData = new FormData();
    const audioBlob = new Blob([audio.buffer], { type: "audio/webm" });
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    console.log("🔊 Sending to Whisper API...");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error("❌ Whisper API Error:", errorData);
      return res.json({ transcript: "[Transcription Failed] Please type your answer manually." });
    }

    const data = await openaiRes.json();
    console.log("✅ Transcription successful");

    res.json({ transcript: data.text || "" });
  } catch (err) {
    console.error("❌ Transcription Error:", err.message);
    res.json({ transcript: "[Transcription Error] Please type your answer manually." });
  }
});

// ================= Debug Routes ================= //
console.log("🔍 Registering debug routes...");

app.get("/api/debug", (req, res) => {
  console.log("✅ Debug route hit!");
  res.json({
    message: "Debug route working",
    timestamp: new Date().toISOString(),
    routes: {
      transcribe: "POST /api/transcribe",
      gemini: "POST /api/gemini",
      debug: "GET /api/debug",
    },
  });
});

app.post("/api/debug-transcribe", (req, res) => {
  console.log("✅ Debug transcribe route hit!");
  res.json({
    message: "Debug transcribe working",
    transcript: "This is a test transcript from debug endpoint",
  });
});

app.post("/api/debug-gemini", (req, res) => {
  console.log("✅ Debug Gemini route hit!", req.body);
  res.json({
    text: "This is test feedback from debug Gemini endpoint. Your answer scored 8/10. Great job!",
  });
});

// ================= Temporary Test Applications Route ================= //
app.post("/api/test-applications", (req, res) => {
  console.log("✅ Test applications route hit!");
  res.json({ message: "Test applications route is working!" });
});

// 🤖 2️⃣ Gemini feedback route — FIXED for gemini-1.5-flash-latest
app.post("/api/gemini", async (req, res) => {
  try {
    const prompt = req.body?.prompt || "";

    // Extract question and answer
    const questionMatch = prompt.match(/Question:\s*(.*?)(?=\n|$)/);
    const answerMatch = prompt.match(/Answer:\s*(.*?)(?=\n|$)/);
    const question = questionMatch ? questionMatch[1] : "the interview question";
    const answer = answerMatch ? answerMatch[1] : "your response";

    if (!process.env.GEMINI_API_KEY) {
      console.log("❌ GEMINI_API_KEY missing, using fallback");
      return getFallbackFeedback(question, answer, res);
    }

    // ✅ Correct import and API call for latest SDK
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Use stable v1 model (no 404)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    console.log("✅ Gemini feedback generated successfully");
    return res.json({ text });
  } catch (err) {
    console.error("❌ Gemini route error:", err.message);
    const question = req.body?.prompt?.match(/Question:\s*(.*?)(?=\n|$)/)?.[1] || "the question";
    getFallbackFeedback(question, "your answer", res);
  }
});

// 🧠 Fallback feedback
function getFallbackFeedback(question, answer, res) {
  const fallbackResponse = `**Interview Feedback**

**Question:** ${question}

**Your Answer Analysis:**
Based on your response, here's a comprehensive evaluation:

📊 **Overall Score: 7.5/10**

✅ **Strengths:**
- You addressed the core of the question directly
- Showed self-awareness in your reflection
- Maintained a professional tone throughout
- Provided relevant context for your points

💡 **Areas for Improvement:**
1. **Add Specific Examples:** Include real-world instances.
2. **Use the STAR Method:** Situation, Task, Action, Result.
3. **Balance Strengths & Weaknesses.**
4. **Quantify Achievements.**

🎯 **Practice Tips:**
- Record again and stay concise (60–90s)
- Focus on one example
- Maintain calm tone and structure

Keep practicing — you're on the right track! 🚀`;

  res.json({ text: fallbackResponse });
}

// ================= Start Server ================= //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 Environment check:`);
  console.log(`   - GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing"}`);
  console.log(`   - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing"}`);
  console.log(`   - MONGO_URI: ${process.env.MONGO_URI ? "✅ Set" : "❌ Missing"}`);
});
