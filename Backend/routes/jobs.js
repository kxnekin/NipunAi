// Backend/routes/jobs.js
const express = require("express");
const router = express.Router();
const Job = require("../models/jobs");

// POST /api/jobs/create → Admin creates a job
router.post("/create", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ message: "Job posted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to post job" });
  }
});

// GET /api/jobs/all → Student sees all jobs
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

module.exports = router;
