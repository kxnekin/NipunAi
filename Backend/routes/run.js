const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  let { code, input, language } = req.body;

  try {
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Code must be provided as a string" });
    }

    // Default language = javascript
    language = language || "javascript";

    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      version: "*",
      files: [
        {
          name: `main.${language === "javascript" ? "js" : language === "python" ? "py" : language === "cpp" ? "cpp" : "txt"}`,
          content: code.toString(),
        },
      ],
      stdin: input ? input.toString() : "",
    });

    res.json(response.data.run); // ✅ send only run output (stdout, stderr, etc.)
  } catch (err) {
    console.error("❌ Piston API error:", err.message);
    if (err.response) {
      console.error("Details:", err.response.data);
    }
    res.status(500).json({ error: "Code execution failed" });
  }
});

module.exports = router;
