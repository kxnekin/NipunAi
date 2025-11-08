/* File: backend/models/CompanyResource.js */

import mongoose from "mongoose";

const CompanyResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

export default mongoose.model("CompanyResource", CompanyResourceSchema);