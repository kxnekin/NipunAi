const express = require("express");
const multer = require("multer");
const User = require("../models/user");

const router = express.Router();
const upload = multer(); // store in memory

// Upload resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const email = req.headers["user-email"];
    if (!email) return res.status(400).json({ message: "User email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resume = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname,
    };

    await user.save();
    res.json({ message: "Resume uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error uploading resume", error: err.message });
  }
});

// Fetch resume
router.get("/", async (req, res) => {
  try {
    const email = req.headers["user-email"];
    if (!email) return res.status(400).json({ message: "User email is required" });

    const user = await User.findOne({ email });
    if (!user || !user.resume) return res.status(404).json({ message: "No resume found" });

    res.set("Content-Type", user.resume.contentType);
    res.send(user.resume.data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resume", error: err.message });
  }
});

module.exports = router;
