// routes/jobs.js
const express = require("express");
const router = express.Router();
const Job = require("../models/Job"); // Make sure filename is exactly Job.js

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new job
router.post("/", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✨ ADD THIS ENTIRE DELETE ROUTE ✨
// DELETE a job by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      // If no job was found with that ID, return a 404 error
      return res.status(404).json({ error: "Job not found" });
    }

    // If the job was deleted successfully, send a success message
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    // For any other server-side errors
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;