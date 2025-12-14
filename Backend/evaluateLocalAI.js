// ===================== Required Modules ===================== //
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // keep your environment variables

// ===================== App Setup ===================== //
const app = express();
const PORT = 5002;

// ✅ Robust CORS setup (Express 5-safe)
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Universal preflight handler
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ===================== Health Check ===================== //
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ===================== Ollama Health Check ===================== //
app.get("/api/check-ollama", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    const data = await response.json();
    return res.json({
      status: "OK",
      message: "Ollama is running",
      models: data.models || [],
    });
  } catch (error) {
    return res.status(500).json({
      status: "ERROR",
      message: "Ollama not accessible",
      error: error.message,
    });
  }
});

// ===================== AI Evaluation Endpoint ===================== //
app.post("/api/evaluate", async (req, res) => {
  const { question, answer } = req.body;
  console.log("📥 Received evaluation request:", req.body);

  if (!question || !answer) {
    return res.status(400).json({ error: "Missing question or answer" });
  }

  const prompt = `
Evaluate this interview answer briefly:

Question: "${question}"
Answer: "${answer}"

Respond in JSON only:
{
  "score": 1-10,
  "feedback": "2-3 sentence feedback",
  "strengths": ["brief strength"],
  "improvements": ["brief improvement"]
}
Keep responses very concise.`;

  try {
    console.log("📤 Sending prompt to Ollama...");

    // ✅ Send prompt to Ollama
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_k: 20,
          top_p: 0.8,
          num_predict: 150,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`⚠️ Ollama API error: ${response.status}`);
      return res.json(analyzeAnswerFallback(question, answer));
    }

    const data = await response.json();
    const rawText =
      data.response || data.text || data.output || JSON.stringify(data);

    if (!rawText) {
      console.warn("⚠️ No response text from Ollama");
      return res.json(analyzeAnswerFallback(question, answer));
    }

    console.log("📝 Raw Ollama output:", rawText);

    // ✅ Try to extract valid JSON
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const result = JSON.parse(match[0]);
        console.log("✅ AI Evaluation successful:", result);
        return res.json(result);
      } catch (parseError) {
        console.warn("⚠️ JSON parse error:", parseError.message);
      }
    }

    console.warn("⚠️ Could not parse AI response, using fallback");
    return res.json(analyzeAnswerFallback(question, answer));
  } catch (err) {
    console.error("❌ Evaluation Error:", err.message);
    return res.json(
      analyzeAnswerFallback(question, answer || "No answer provided")
    );
  }
});

// ===================== Fallback Evaluator ===================== //
function analyzeAnswerFallback(question, answer) {
  console.log("🔄 Using fallback evaluation for:", { question, answer });

  const words = answer.split(/\s+/).filter(Boolean).length;
  const keywords = (question.match(/\b\w{4,}\b/g) || []).map((w) =>
    w.toLowerCase()
  );
  const answerLower = answer.toLowerCase();
  const relevance =
    keywords.filter((k) => answerLower.includes(k)).length /
    Math.max(1, keywords.length);

  let score = 5;
  if (words > 30) score++;
  if (words > 60) score++;
  if (relevance > 0.5) score += 2;
  if (relevance > 0.7) score++;

  const hasStructure = /(first|second|finally|because|therefore)/i.test(answer);
  const hasExamples = /(example|such as|like when|instance)/i.test(answer);
  const hasPersonal = /(i|my|me|project|experience|worked)/i.test(answer);

  if (hasStructure) score++;
  if (hasExamples) score++;
  if (hasPersonal) score++;

  score = Math.min(10, Math.max(1, Math.round(score)));

  const strengths = [];
  const improvements = [];

  if (words > 40) strengths.push("Good elaboration");
  else improvements.push("Add more details");
  if (relevance > 0.6) strengths.push("Relevant answer");
  else improvements.push("Focus more on question");
  if (hasStructure) strengths.push("Well-structured");
  else improvements.push("Add structure (First, Then, Finally)");

  const feedback =
    score >= 9
      ? "Excellent, detailed and structured answer."
      : score >= 7
      ? "Good, but can add more examples."
      : score >= 5
      ? "Average answer — elaborate and structure more."
      : "Needs improvement — unclear and brief.";

  const result = {
    score,
    feedback,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    note: "Fallback evaluation used",
  };

  console.log("📊 Fallback evaluation result:", result);
  return result;
}

// ===================== Start Server ===================== //
app.listen(PORT, () => {
  console.log(`✅ Local AI evaluator running on port ${PORT}`);
  console.log(`✅ CORS enabled for: http://localhost:3000`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✅ Ollama check: http://localhost:${PORT}/api/check-ollama`);
  console.log(`✅ Using model: gemma3:4b`);
  console.log(`✅ Optimized for faster responses`);
});
