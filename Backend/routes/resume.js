const express = require("express");
const multer = require("multer");
const User = require("../models/user");

const router = express.Router();

// Multer config (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Upload resume (PDF only)
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const email = req.headers["user-email"];
    if (!email) return res.status(400).json({ message: "User email is required in headers." });

    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF resumes are allowed." });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Save resume to user document
    user.resume = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    res.json({ message: "Resume uploaded successfully!" });
  } catch (err) {
    console.error("Resume upload error:", err);
    res.status(500).json({ message: "Server error uploading resume." });
  }
});

// ✅ Fetch resume
router.get("/", async (req, res) => {
  try {
    const email = req.headers["user-email"];
    if (!email) return res.status(400).json({ message: "User email is required in headers." });

    const user = await User.findOne({ email });
    if (!user || !user.resume || !user.resume.data) {
      return res.status(404).json({ message: "No resume found for this user." });
    }

    res.set("Content-Type", user.resume.contentType);
    res.send(user.resume.data);
  } catch (err) {
    console.error("Resume fetch error:", err);
    res.status(500).json({ message: "Server error fetching resume." });
  }
});

module.exports = router;