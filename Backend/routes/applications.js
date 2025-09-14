// backend/routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (only for logged-in students)
router.post('/', authMiddleware, async (req, res) => {
  const { jobId } = req.body;
  const studentId = req.user.id; // Get student ID from the auth token payload

  try {
    // Check if the student has already applied for this job
    const existingApplication = await Application.findOne({ job: jobId, student: studentId });

    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied for this job.' });
    }

    // Create a new application
    const newApplication = new Application({
      job: jobId,
      student: studentId,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;