const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  generateFeedback,
  transcribeAudio,
  blockedNotice,
} = require("../controllers/mockInterviewController");

// ✅ Working routes
router.post("/generate", generateFeedback);
router.post("/transcribe", upload.single("file"), transcribeAudio);
router.get("/blocked", blockedNotice);

module.exports = router;