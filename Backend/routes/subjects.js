/* File: backend/routes/subjects.js */

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Subject from "../models/Subject.js"; // Import the model

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config
const uploadDir = path.join(__dirname, "../uploads/subjects");
// This was already in your server.js, but it's good to have here too
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// === POST (Upload) ===
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const newSubject = new Subject({
      title: req.body.title,
      fileUrl: `/uploads/subjects/${req.file.filename}`,
    });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Failed to upload subject" });
  }
});

// === GET (Fetch All) ===
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

// === DELETE ===
router.delete("/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    // Construct file path and delete from server
    const filePath = path.join(__dirname, "..", subject.fileUrl);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("❌ Failed to delete file:", err);
      }
      // Delete from database
      await Subject.findByIdAndDelete(req.params.id);
      res.json({ message: "Subject deleted successfully" });
    });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

export default router;