// backend/routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/user.js'); // Your user model
const authMiddleware = require('../middleware/auth'); // Your JWT auth middleware

/**
 * @route   POST /api/applications
 * @desc    Apply for a job using the user's saved profile resume
 * @access  Private (Requires JWT Token)
 */
router.post('/', authMiddleware, async (req, res) => {
  const { jobId } = req.body; // Get jobId from the frontend request
  const studentId = req.user.id; // Get studentId from the authenticated token

  try {
    // 1. Find the student's profile in the database
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Your profile was not found.' });
    }

    // 2. Check if the student has uploaded a resume to their profile
    if (!student.resumeUrl) {
      return res.status(400).json({ error: 'Please upload a resume to your profile before applying.' });
    }

    // 3. Check if they have already applied for this exact job
    const existingApplication = await Application.findOne({ job: jobId, student: studentId });
    if (existingApplication) {
      return res.status(409).json({ error: 'You have already applied for this job.' });
    }

    // 4. Create the new application record
    const newApplication = new Application({
      job: jobId,
      student: studentId,
      resumeUrl: student.resumeUrl, // Attach the resume URL from their profile
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully!' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;