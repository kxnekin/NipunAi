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
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your-db-name")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= Routes ================= //
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

const resumeRoutes = require("./routes/resume");
app.use("/api/resume", resumeRoutes);

// 🔹 Run Route (Piston Integration)
const runRoutes = require("./routes/run");
app.use("/api/run", runRoutes);

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

// ================= Roadmaps ================= //
const roadmapRoutes = require("./routes/roadmaps");
app.use("/uploads", express.static("uploads"));
// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Health Check ================= //
app.get("/", (req, res) => {
  res.send("🚀 API is running!");
});

// ================= Start Server ================= //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
