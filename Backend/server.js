// ================== IMPORTS ================== //

// ✅ Load environment variables before anything else
import "dotenv/config"; // Use this simple import to load .env
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Needed for __dirname in ESM

// ✅ Import routes (assuming they use `export default`)
// NOTE: In ESM, you must include the .js extension for local files
import User from "./models/user.js";
import authRoutes from "./routes/auth.js";
import jobRoutes from "./routes/jobs.js";
import resumeRoutes from "./routes/resume.js";
import runRoutes from "./routes/run.js";
import roadmapRoutes from "./routes/roadmaps.js";
import subjectRoutes from "./routes/subjects.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import resumeOptimizerRoutes from "./routes/resumeOptimizerRoutes.js";
import workExpRoutes from "./routes/workExpRoutes.js";
//
// 1. 👈 --- IMPORTED NEW COMPANY RESOURCE ROUTE ---
import companyResourceRoutes from "./routes/companyResources.js"; 
//
// ✅ Import JSON (using the modern 'with' syntax)
import leetcodeQuestions from "./leetcode-questions.json" with { type: "json" };

// ================== Path Setup ================== //
// Standard workaround for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== Server & Port Setup ================== //
const app = express();
const PORT = process.env.PORT || 5000;

// ================== Middleware ================== //
app.use(cors());
app.use(express.json()); // ✅ Replaces deprecated bodyParser.json()

// ================== Ensure Upload Folders Exist ================== //
const uploadDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/roadmaps"),
  path.join(__dirname, "uploads/subjects"), 
  //
  // 2. 👈 --- ADDED NEW COMPANY RESOURCE FOLDER ---
  path.join(__dirname, "uploads/company_resources"), 
  //
  path.join(__dirname, "resume_optimizer_uploads"),
];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ================== MongoDB Connection ================== //
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1); // Exit the application if the DB connection string is missing
}

mongoose
  .connect(MONGO_URI) // Deprecated options removed
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
      password: "Admin@123", // pre-save hook will hash this
      role: "admin",
    });

    await adminUser.save();
    console.log("✅ Default admin created: admin@nipunai.com / Admin@123");
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
}

// ================== Routes ================== //
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/run", runRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/subjects", subjectRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume-optimizer", resumeOptimizerRoutes);
app.use("/api/workexp", workExpRoutes);
//
// 3. 👈 --- USING NEW COMPANY RESOURCE ROUTE ---
app.use("/api/company-resources", companyResourceRoutes); 
//
// ================== LeetCode Questions ================== //

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
// Note: /uploads also serves /uploads/roadmaps, /uploads/subjects, etc.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/resume_optimizer_uploads",
  express.static(path.join(__dirname, "resume_optimizer_uploads"))
);

// ================== Health Check ================== //
app.get("/", (req, res) => {
  res.send("🚀 Nipun AI Backend is running!");
});

// =F ================= Start Server ================== //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});