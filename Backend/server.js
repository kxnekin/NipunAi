// ================== IMPORTS ================== //

// ✅ THIS IS THE FIX: Load .env variables BEFORE anything else.
require("dotenv").config();

// Now, all other files can safely use process.env
const express = require("express");
const cors = require("cors"); // ✅ REMOVED the extra quotes
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const User = require("./models/user"); // ✅ User model

const app = express();
const PORT = process.env.PORT || 5000;

// ================== Middleware ================== //
app.use(cors());
app.use(bodyParser.json());

// ================== MongoDB Connection ================== //
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nipun-ai-db") // This will now work
  .then(async () => {
    console.log("✅ MongoDB connected");
    await createDefaultAdmin();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================== Auto Admin Creation ================== //
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
      password: "Admin@123", // pre-save hook will hash this automatically
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Default admin created: admin@nipunai.com / Admin@123");
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
}

// ================== Routes ================== //
// All these routes will now have access to process.env
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

const resumeRoutes = require("./routes/resume");
app.use("/api/resume", resumeRoutes);

const runRoutes = require("./routes/run");
app.use("/api/run", runRoutes);

const roadmapRoutes = require("./routes/roadmaps");
app.use("/api/roadmaps", roadmapRoutes);

const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);


const resumeOptimizerRoutes = require("./routes/resumeOptimizerRoutes");
app.use("/api/resume-optimizer", resumeOptimizerRoutes); // fixed path consistency

// 🆕 Add your new Work Experience Routes
const workExpRoutes = require("./routes/workExpRoutes"); // ✅ fixed filename
app.use("/api/workexp", workExpRoutes);

// ================== LeetCode Questions ================== //
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

// ================== Static File Serving ================== //
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🆕 Serve resume optimizer uploads folder
app.use(
  "/resume_optimizer_uploads",
  express.static(path.join(__dirname, "resume_optimizer_uploads"))
);

// ================== Health Check ================== //
app.get("/", (req, res) => {
  res.send("🚀 Nipun AI Backend is running!");
});

// ================== Start Server ================== //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
