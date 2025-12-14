const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getResults } = require('../controllers/interviewController');

// Interview session routes
router.post('/start', startInterview);
router.post('/submit-answer', submitAnswer);
router.get('/results/:sessionId', getResults);

module.exports = router;