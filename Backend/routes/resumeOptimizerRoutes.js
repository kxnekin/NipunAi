// ================== Imports ================== //
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

// ================== Folder Setup ================== //
const uploadFolder = path.join(__dirname, "..", "resume_optimizer_uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// ================== Multer Setup ================== //
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// ================== Gemini API Function ================== //
async function analyzeResume(resumeText, targetRole) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-2.0-flash";

  const prompt = `
You are an expert resume reviewer. Analyze the provided resume for a **${targetRole}** position.

Return ONLY a JSON response in this exact structure (no extra text or markdown):
{
  "score": <number from 0-100>,
  "strong_points": [ "point1", "point2", "point3" ],
  "missing_keywords": [ "keyword1", "keyword2", "keyword3" ],
  "suggestions": [ "suggestion1", "suggestion2", "suggestion3" ],
  "unnecessary_points": [ "remove1", "remove2" ]
}

Resume:
---
${resumeText}
---`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      }
    );

    // Extract AI response text safely
    let jsonText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!jsonText.trim()) {
      throw new Error("Gemini returned an empty response or invalid format.");
    }

    // 🧹 Clean text — remove markdown fences, non-breaking spaces, etc.
    jsonText = jsonText
      .replace(/```json|```/gi, "") // remove ```json fences
      .replace(/[\u0000-\u001F]+/g, "") // remove control chars
      .trim();

    // 🧠 Try to find JSON-like structure if mixed text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonText = jsonMatch[0];

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.error("⚠️ Gemini invalid JSON:", jsonText);
      throw new Error("AI returned invalid JSON. Check console for output.");
    }

    return parsed;
  } catch (error) {
    console.error("❌ Gemini API error:", error.response?.data || error.message);
    throw new Error("AI analysis failed. Check logs for details.");
  }
}

// ================== POST /optimize ================== //
router.post("/optimize", upload.single("resume"), async (req, res) => {
  try {
    const targetRole = req.body.targetRole;

    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded." });
    if (!targetRole) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: "Target job role is required." });
    }

    const filePath = req.file.path;
    let resumeText = "";

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const parsedData = await pdfParse(dataBuffer);
      resumeText = parsedData.text;
    } else {
      resumeText = fs.readFileSync(filePath, "utf8");
    }

    if (resumeText.trim().length < 50) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        error: "Could not extract readable text from the resume. Please upload a text-selectable PDF."
      });
    }

    const analysisResults = await analyzeResume(resumeText, targetRole);
    fs.unlinkSync(filePath);

    res.status(200).json(analysisResults);
  } catch (error) {
    console.error("❌ Error optimizing resume:", error.message);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    res.status(500).json({
      success: false,
      error: error.message || "An unexpected server error occurred during analysis."
    });
  }
});

// ================== Export ================== //
module.exports = router;
