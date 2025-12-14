/* File: backend/models/CompanyResource.js */

const mongoose = require("mongoose");

const CompanyResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

module.exports = mongoose.model("CompanyResource", CompanyResourceSchema);
