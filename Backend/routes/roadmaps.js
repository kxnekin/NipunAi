const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 👈 --- ADD THIS LINE (File System)
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

// --- 👇 NEWLY ADDED DELETE ROUTE ---
router.delete("/:id", async (req, res) => {
  try {
    // 1. Find the roadmap by ID
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // 2. Get the file path from the fileUrl
    // (e.g., /uploads/roadmaps/123.pdf -> ../uploads/roadmaps/123.pdf)
    const filePath = path.join(__dirname, "..", roadmap.fileUrl);

    // 3. Delete the file from the filesystem
    fs.unlink(filePath, async (err) => {
      if (err) {
        // Log the error but continue to delete from DB
        console.error("❌ Failed to delete file:", err);
      }

      // 4. Delete the roadmap from the database
      await Roadmap.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted successfully" });
    });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete roadmap" });
  }
});
// --- END OF NEW ROUTE ---

module.exports = router;