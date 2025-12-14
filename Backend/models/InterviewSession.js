const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: String,
  answer: String,
  audioUrl: String,
  timestamp: Date,
  score: Number,
  feedback: String
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewType: {
    type: String,
    required: true,
    enum: ['hr', 'technical', 'ai-ml', 'data-science']
  },
  questions: [String],
  answers: [answerSchema],
  currentQuestion: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startTime: Date,
  endTime: Date,
  overallScore: Number,
  proctoringEvents: [{
    type: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);