const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String, required: true }, // This will store the resume access URL
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", ApplicationSchema);
