const express = require("express");
const multer = require("multer");
const path = require("path");
const Roadmap = require("../models/Roadmap");

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/roadmaps"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload roadmap
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const newRoadmap = new Roadmap({
      title: req.body.title,
      fileUrl: `/uploads/roadmaps/${req.file.filename}`, // 👈 matches model
    });

    await newRoadmap.save();
    res.status(201).json(newRoadmap);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Failed to upload roadmap" });
  }
});

// Get all roadmaps
router.get("/", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
});

module.exports = router;
