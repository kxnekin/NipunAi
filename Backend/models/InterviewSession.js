const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  question: String,
  answer: String,
  score: Number,
  feedback: String,
}, { _id: false });

const InterviewSessionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  type: { type: String, enum: ["hr","tech"], required: true },
  totalScore: { type: Number, default: 0 },
  items: [ItemSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);
