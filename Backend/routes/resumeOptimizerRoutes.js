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
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}

// ================== Multer Setup ================== //
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({
    storage
});

// ================== Predefined Fallback ================== //
function predefinedAnalysis(targetRole) {
    return {
        score: 75,
        strong_points: [
            `Skills aligned with ${targetRole}`,
            "Hands-on academic and personal projects",
            "Clear educational background"
        ],
        missing_keywords: [
            "Git",
            "REST APIs",
            "Unit Testing"
        ],
        suggestions: [
            "Add GitHub project links",
            "Mention tools and technologies clearly",
            "Quantify project impact using numbers"
        ],
        unnecessary_points: [
            "High school achievements",
            "Irrelevant certifications"
        ]
    };
}

// ================== Gemini + Fallback Analyzer ================== //
async function analyzeResume(resumeText, targetRole) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.0-flash";

    const prompt = `
You are an expert resume reviewer. Analyze the provided resume for a ${targetRole} role.

Return ONLY valid JSON:
{
  "score": number,
  "strong_points": [],
  "missing_keywords": [],
  "suggestions": [],
  "unnecessary_points": []
}

Resume:
${resumeText}
`;

    try {
        console.log("🤖 Trying Gemini AI...");

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
                contents: [{
                    role: "user",
                    parts: [{
                        text: prompt
                    }]
                }]
            }
        );

        let text =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        text = text.replace(/```json|```/gi, "").trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid JSON from Gemini");

        const parsed = JSON.parse(jsonMatch[0]);

        console.log("✅ Gemini AI analysis successful");
        return parsed;

    } catch (error) {
        console.error("⚠️ Gemini failed, using predefined analysis");
        return predefinedAnalysis(targetRole);
    }
}

// ================== POST /optimize ================== //
router.post("/optimize", upload.single("resume"), async (req, res) => {
    try {
        const targetRole = req.body.targetRole;

        if (!req.file) {
            return res.status(400).json({
                error: "No resume uploaded"
            });
        }
        if (!targetRole) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                error: "Target role is required"
            });
        }

        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        const resumeText = pdfData.text;

        fs.unlinkSync(req.file.path);

        if (!resumeText || resumeText.length < 50) {
            return res.status(400).json({
                error: "Could not extract readable text from resume"
            });
        }

        const result = await analyzeResume(resumeText, targetRole);
        return res.status(200).json(result);

    } catch (err) {
        console.error("❌ Resume optimizer error:", err.message);
        return res.status(500).json({
            error: "Resume analysis failed"
        });
    }
});

// ================== Export ================== //
module.exports = router;