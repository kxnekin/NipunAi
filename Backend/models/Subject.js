/* File: backend/models/Subject.js */

import mongoose from "mongoose"; // Use import

const SubjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

// Use export default
export default mongoose.model("Subject", SubjectSchema);