const InterviewSession = require('../models/InterviewSession');

// Start new interview session
const startInterview = async (req, res) => {
  try {
    const { userId, interviewType, questions } = req.body;
    
    const newSession = new InterviewSession({
      userId,
      interviewType,
      questions,
      currentQuestion: 0,
      status: 'active',
      startTime: new Date()
    });

    await newSession.save();
    res.status(201).json({ 
      success: true, 
      sessionId: newSession._id,
      firstQuestion: questions[0] 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Submit answer and get next question
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer, audioUrl } = req.body;
    
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Save the answer
    session.answers.push({
      question: session.questions[session.currentQuestion],
      answer: answer,
      audioUrl: audioUrl,
      timestamp: new Date()
    });

    // Move to next question or end interview
    session.currentQuestion++;
    
    if (session.currentQuestion >= session.questions.length) {
      session.status = 'completed';
      session.endTime = new Date();
    }

    await session.save();

    const response = {
      success: true,
      currentQuestion: session.currentQuestion,
      totalQuestions: session.questions.length,
      status: session.status
    };

    // If there are more questions, send next one
    if (session.status === 'active') {
      response.nextQuestion = session.questions[session.currentQuestion];
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get interview results
const getResults = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await InterviewSession.findById(sessionId)
      .populate('userId', 'name email');
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    res.json({
      success: true,
      session: session
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  getResults
};