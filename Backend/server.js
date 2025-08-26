// Backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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

// ✅ Code runner (Piston)
const runRoutes = require("./routes/run");
app.use("/api/run", runRoutes);

// ✅ AI Interview sessions (added)
const interviewRoutes = require("./routes/interview");
app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running ✅. Use /api/... endpoints.");
});

// ================= Start Server ================= //
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
