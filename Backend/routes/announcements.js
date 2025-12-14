const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// --- Schema ---
const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

// --- Get All Announcements ---
router.get("/", async (req, res) => {
  try {
    const data = await Announcement.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Create Announcement ---
router.post("/", async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message)
      return res.status(400).json({ error: "Title and message required" });

    const newAnnouncement = new Announcement({ title, message });
    await newAnnouncement.save();

    res.status(201).json({ success: true, message: "Announcement added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Delete Announcement ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({ success: true, message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
