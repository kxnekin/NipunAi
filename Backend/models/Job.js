// Backend/models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  ctc: String,
  location: String,
  skills: String,
});

module.exports = mongoose.model("Job", jobSchema);
