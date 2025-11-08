/* File: backend/routes/companyResources.js */

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import CompanyResource from "../models/CompanyResource.js"; // 1. CHANGED

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 2. CHANGED: Define the new upload path
const uploadDir = path.join(__dirname, "../uploads/company_resources");

// Ensure the directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 3. CHANGED
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
    const newResource = new CompanyResource({ // 4. CHANGED
      title: req.body.title,
      fileUrl: `/uploads/company_resources/${req.file.filename}`, // 5. CHANGED
    });
    await newResource.save(); // 6. CHANGED
    res.status(201).json(newResource); // 7. CHANGED
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Failed to upload company resource" }); // 8. CHANGED
  }
});

// === GET (Fetch All) ===
router.get("/", async (req, res) => {
  try {
    const resources = await CompanyResource.find(); // 9. CHANGED
    res.json(resources); // 10. CHANGED
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch company resources" }); // 11. CHANGED
  }
});

// === DELETE ===
router.delete("/:id", async (req, res) => {
  try {
    // 12. CHANGED (all instances of "subject")
    const resource = await CompanyResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    const filePath = path.join(__dirname, "..", resource.fileUrl);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("❌ Failed to delete file:", err);
      }
      await CompanyResource.findByIdAndDelete(req.params.id);
      res.json({ message: "Resource deleted successfully" });
    });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    res.status(500).json({ error: "Failed to delete resource" });
  }
});

export default router;