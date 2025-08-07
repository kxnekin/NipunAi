// models/Job.js
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  ctc: { type: String, required: true },
  location: { type: String },
  description: { type: String, required: true },
  eligibility: { type: String },
  deadline: { type: Date },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Job", JobSchema);
