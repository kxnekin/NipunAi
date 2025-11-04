const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

// Schema
const workExpSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  company: String,
  role: String,
  description: String,
});

const WorkExperience = mongoose.model("WorkExperience", workExpSchema);

// ✅ Save multiple experiences
router.post("/save", async (req, res) => {
  try {
    const { email, experiences } = req.body;

    if (!email || !experiences || experiences.length === 0) {
      return res.status(400).json({ error: "Missing email or experiences." });
    }

    // Remove old entries
    await WorkExperience.deleteMany({ userEmail: email });

    // Insert new ones
    const toInsert = experiences.map((exp) => ({
      userEmail: email,
      company: exp.company,
      role: exp.role,
      description: exp.description,
    }));

    await WorkExperience.insertMany(toInsert);
    res.status(201).json({ message: "✅ Work experience saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving work experience:", error);
    res.status(500).json({ error: "Failed to save work experience." });
  }
});

// ✅ Get experiences for a user
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const data = await WorkExperience.find({ userEmail: email });
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching work experience:", error);
    res.status(500).json({ error: "Failed to fetch work experience." });
  }
});

module.exports = router;
