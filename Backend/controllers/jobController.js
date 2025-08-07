const Job = require('../models/Job');

// POST - Admin creates job
exports.createJob = async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post job' });
  }
};

// GET - Fetch all jobs for student
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};
