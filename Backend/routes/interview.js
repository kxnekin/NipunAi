const express = require("express");
const multer = require("multer");
const { Readable } = require("stream");
const InterviewSession = require("../models/InterviewSession");

const router = express.Router();

// ====== SAVE / GET SESSIONS ======
router.post("/sessions", async (req, res) => {
  try {
    const { email, type, totalScore, items } = req.body;
    const doc = new InterviewSession({
      email, type, totalScore,
      items: (items || []).map(x => ({
        question: x.q, answer: x.a, score: x.score, feedback: x.feedback
      })),
    });
    await doc.save();
    res.json({ ok: true, id: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to save session" });
  }
});

router.get("/sessions", async (req, res) => {
  try {
    const { email } = req.query;
    const docs = await InterviewSession.find(email ? { email } : {})
      .sort({ createdAt: -1 }).limit(50);
    res.json(docs);
  } catch (e) {
    res.status(500).json({ ok: false, error: "Failed to fetch sessions" });
  }
});

// ====== HIGH-ACCURACY TRANSCRIBE (OpenAI Whisper) ======
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: "Missing OPENAI_API_KEY in .env" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No audio provided" });
    }

    const OpenAI = require("openai");
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const stream = Readable.from(req.file.buffer);
    stream.path = "audio.webm";

    const result = await client.audio.transcriptions.create({
      file: stream,
      model: "whisper-1",
      language: "en",        // understands Indian English well
      response_format: "json",
      temperature: 0,
    });

    return res.json({ text: result.text || "" });
  } catch (err) {
    console.error("Transcription error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Transcription failed" });
  }
});

// ====== PREMIUM VOICE TTS (Azure en-IN voices) ======
router.post("/tts", async (req, res) => {
  try {
    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
      return res.status(400).json({ error: "Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION in .env" });
    }
    const { text, voice } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: "No text" });

    const sdk = require("microsoft-cognitiveservices-speech-sdk");
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );

    // Good Indian-English voices:
    //   en-IN-NeerjaNeural (female), en-IN-PrabhatNeural (male)
    speechConfig.speechSynthesisVoiceName = voice || "en-IN-NeerjaNeural";
    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
    synthesizer.speakTextAsync(
      text,
      (result) => {
        const audio = Buffer.from(result.audioData);
        res.setHeader("Content-Type", "audio/mpeg");
        res.send(audio);
        synthesizer.close();
      },
      (err) => {
        console.error("TTS error:", err);
        res.status(500).json({ error: "TTS failed" });
        synthesizer.close();
      }
    );
  } catch (e) {
    console.error("TTS error:", e.message);
    res.status(500).json({ error: "TTS failed" });
  }
});

module.exports = router;
