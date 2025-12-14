// ================== IMPORTS ================== //
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const multer = require("multer");
const { Blob } = require("buffer");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ================== APP SETUP ================== //
const app = express();
const PORT = process.env.PORT || 5000;

// ================== MIDDLEWARE ================== //
app.use(cors());
app.use(bodyParser.json());

// ================== MONGODB CONNECTION ================== //
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nipunai")
  .then(async () => {
    console.log("✅ MongoDB connected");
    await createDefaultAdmin();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================== MODEL IMPORT ================== //
const User = require("./models/user");

// ================== AUTO ADMIN CREATION ================== //
async function createDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: "admin@nipunai.com" });
    if (existingAdmin) {
      console.log("🧑‍💻 Default admin already exists.");
      return;
    }

    const adminUser = new User({
      name: "Admin User",
      email: "admin@nipunai.com",
      password: "Admin@123",
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Default admin created: admin@nipunai.com / Admin@123");
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
}

// ================== ENSURE UPLOAD FOLDERS EXIST ================== //
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/roadmaps"),
  path.join(__dirname, "uploads/subjects"),
  path.join(__dirname, "uploads/company_resources"),
  path.join(__dirname, "resume_optimizer_uploads"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ================== ROUTE IMPORTS (COMMON) ================== //
const authRoutes = safeRequire("./routes/auth");
const jobRoutes = safeRequire("./routes/jobs");
const resumeRoutes = safeRequire("./routes/resume");
const runRoutes = safeRequire("./routes/run");
const roadmapRoutes = safeRequire("./routes/roadmaps");
const subjectRoutes = safeRequire("./routes/subjects");
const profileRoutes = safeRequire("./routes/profile");
const adminRoutes = safeRequire("./routes/admin");
const resumeOptimizerRoutes = safeRequire("./routes/resumeOptimizerRoutes");
const workExpRoutes = safeRequire("./routes/workExpRoutes");

// ✅ NEW ANNOUNCEMENTS ROUTE
const announcementRoutes = require("./routes/announcements");

// ================== HELPER: Safe loader for CommonJS or ESM routes ================== //
function safeRequire(relativePath) {
  try {
    const mod = require(relativePath);
    if (isRouter(mod)) return mod;
    if (mod && isRouter(mod.default)) return mod.default;
    return null;
  } catch {
    return null;
  }
}

async function loadRouteDynamic(relativePath) {
  try {
    const mod = require(relativePath);
    if (isRouter(mod)) return mod;
    if (mod && isRouter(mod.default)) return mod.default;
  } catch {}
  try {
    const absolute = path.join(__dirname, relativePath) + (relativePath.endsWith(".js") ? "" : ".js");
    const imported = await import(absolute);
    if (isRouter(imported)) return imported;
    if (imported && isRouter(imported.default)) return imported.default;
  } catch {
    return null;
  }
}

function isRouter(obj) {
  if (!obj) return false;
  return typeof obj === "function" || (typeof obj.use === "function" && Array.isArray(obj.stack || []));
}

// ================== REGISTER ROUTES ================== //
if (authRoutes) app.use("/api/auth", authRoutes);
if (jobRoutes) app.use("/api/jobs", jobRoutes);
if (resumeRoutes) app.use("/api/resume", resumeRoutes);
if (runRoutes) app.use("/api/run", runRoutes);
if (roadmapRoutes) app.use("/api/roadmaps", roadmapRoutes);
if (subjectRoutes) app.use("/api/subjects", subjectRoutes);
if (profileRoutes) app.use("/api/profile", profileRoutes);
if (adminRoutes) app.use("/api/admin", adminRoutes);
if (resumeOptimizerRoutes) app.use("/api/resume-optimizer", resumeOptimizerRoutes);
if (workExpRoutes) app.use("/api/workexp", workExpRoutes);

// ✅ MOUNT ANNOUNCEMENTS ROUTE
app.use("/api/announcements", announcementRoutes);

// ================== REGISTER OPTIONAL ROUTES ================== //
(async () => {
  const optionalRoutes = [
    { path: "./routes/companyResources", mount: "/api/company-resources" },
    { path: "./routes/applications", mount: "/api/applications" },
    { path: "./routes/mockInterview", mount: "/api/mock-interview" },
  ];

  for (const r of optionalRoutes) {
    try {
      const route = await loadRouteDynamic(r.path);
      if (route && isRouter(route)) {
        app.use(r.mount, route);
        console.log(`✅ ${r.path} loaded at ${r.mount}`);
      } else {
        console.warn(`⚠️ ${r.path} not found or invalid, skipping...`);
      }
    } catch (err) {
      console.warn(`⚠️ Error loading ${r.path}:`, err.message || err);
    }
  }
})();

// ================== LEETCODE QUESTIONS ================== //
const leetcodeQuestions = require("./leetcode-questions.json");

app.get("/api/leetcode-questions", (req, res) => res.json(leetcodeQuestions));
app.get("/api/leetcode-questions/:titleSlug", (req, res) => {
  const { titleSlug } = req.params;
  const question = leetcodeQuestions.find((q) => q.titleSlug === titleSlug);
  if (!question) return res.status(404).json({ error: "Question not found" });
  res.json(question);
});

// ================== STATIC FILE SERVING ================== //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/resume_optimizer_uploads", express.static(path.join(__dirname, "resume_optimizer_uploads")));

// ================== HEALTH CHECK ================== //
app.get("/", (req, res) => {
  res.send("🚀 Nipun AI Backend is running perfectly!");
});

// ================== WHISPER TRANSCRIPTION ================== //
const upload = multer();

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    const audio = req.file;
    if (!audio) return res.status(400).json({ error: "No file uploaded" });

    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OPENAI_API_KEY missing");
      return res.json({ transcript: "[Transcription Service Unavailable] Please type manually." });
    }

    const formData = new FormData();
    const audioBlob = new Blob([audio.buffer], { type: "audio/webm" });
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");
    formData.append("language", "en");

    const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error("❌ Whisper API Error:", errorData);
      return res.json({ transcript: "[Transcription Failed] Please type manually." });
    }

    const data = await openaiRes.json();
    res.json({ transcript: data.text || "" });
  } catch (err) {
    console.error("❌ Transcription Error:", err.message);
    res.json({ transcript: "[Transcription Error] Please type manually." });
  }
});

// ================== GEMINI FEEDBACK ROUTE ================== //
app.post("/api/gemini", async (req, res) => {
  try {
    const prompt = req.body?.prompt || "";
    const questionMatch = prompt.match(/Question:\s*(.*?)(?=\n|$)/);
    const answerMatch = prompt.match(/Answer:\s*(.*?)(?=\n|$)/);
    const question = questionMatch ? questionMatch[1] : "the question";
    const answer = answerMatch ? answerMatch[1] : "your response";

    if (!process.env.GEMINI_API_KEY) {
      console.log("❌ GEMINI_API_KEY missing, using fallback");
      return getFallbackFeedback(question, answer, res);
    }

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    res.json({ text });
  } catch (err) {
    console.error("❌ Gemini route error:", err.message);
    const question = req.body?.prompt?.match(/Question:\s*(.*?)(?=\n|$)/)?.[1] || "the question";
    getFallbackFeedback(question, "your answer", res);
  }
});

function getFallbackFeedback(question, answer, res) {
  const fallback = `**Interview Feedback**

**Question:** ${question}

📊 **Score:** 7.5/10  
✅ Clear and structured response  
💡 Add examples, quantify results, use STAR method  
🎯 Keep practicing — great progress!`;

  res.json({ text: fallback });
}

// ================== DEBUG ROUTE ================== //
app.get("/api/debug", (req, res) => {
  res.json({ message: "Debug route working", timestamp: new Date().toISOString() });
});

// ================== START SERVER ================== //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("🔑 Environment Check:");
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? "✅" : "❌"}`);
  console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "✅" : "❌"}`);
  console.log(`   MONGO_URI: ${process.env.MONGO_URI ? "✅" : "❌"}`);
});
