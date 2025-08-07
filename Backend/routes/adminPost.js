const express = require('express');
const router = express.Router();
const Job = require('../models/jobs');

// Admin posts a new job
router.post('/post-job', async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      type,
      description,
      skills,
    } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      salary,
      type,
      description,
      skills,
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully', job: newJob });
  } catch (error) {
    console.error('Job Post Error:', error);
    res.status(500).json({ message: 'Failed to post job' });
  }
});

module.exports = router;
