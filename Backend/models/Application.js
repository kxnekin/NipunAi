const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Selected", "Rejected"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
