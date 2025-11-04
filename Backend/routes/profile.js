const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/user");

// Upload folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get student profile
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update student profile
router.post("/update", async (req, res) => {
  const { email, name, branch, usn, workExperience, details } = req.body;
  const updated = await User.findOneAndUpdate(
    { email },
    { name, branch, usn, workExperience, details },
    { new: true }
  );
  res.json(updated);
});

// Upload resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  const email = req.headers["user-email"];
  if (!email) return res.status(400).json({ message: "Email header missing" });

  await User.findOneAndUpdate(
    { email },
    { resumeUrl: req.file.path },
    { new: true }
  );

  res.json({ filePath: req.file.path });
});

module.exports = router;
