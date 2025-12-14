/* File: backend/models/Subject.js */

const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

module.exports = mongoose.model("Subject", SubjectSchema);
