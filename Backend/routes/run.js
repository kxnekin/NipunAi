const express = require("express");
const axios = require("axios");
const router = express.Router();

// ================= Run Code Route ================= //
router.post("/", async (req, res) => {
  try {
    let { code, language, testCases } = req.body;

    // ================= Validation ================= //
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "❌ Code must be provided as a string" });
    }
    if (!Array.isArray(testCases)) {
      return res.status(400).json({ error: "❌ Test cases must be an array" });
    }

    // Default language
    language = language || "javascript";

    // Try to auto-detect function name (for JS and Python)
    let functionName = "";
    if (language === "javascript") {
      const match = code.match(/function\s+([a-zA-Z0-9_]+)/);
      if (!match) return res.status(400).json({ error: "❌ Could not detect function name" });
      functionName = match[1];
    } else if (language === "python") {
      const match = code.match(/def\s+([a-zA-Z0-9_]+)/);
      if (!match) return res.status(400).json({ error: "❌ Could not detect function name" });
      functionName = match[1];
    } else if (language === "cpp") {
      // For C++, assume user defines function and we wrap in main
      const match = code.match(/([a-zA-Z0-9_]+)\s*\(.*\)\s*{/);
      if (!match) return res.status(400).json({ error: "❌ Could not detect function name" });
      functionName = match[1];
    }

    let results = [];

    for (let tc of testCases) {
      let wrappedCode = "";

      // ================= Language-specific Wrapping ================= //
      if (language === "javascript") {
        wrappedCode = `
${code}

(async () => {
  try {
    const input = ${JSON.stringify(tc.input)};
    const result = ${functionName}(...Object.values(input));
    console.log(JSON.stringify(result));
  } catch (err) {
    console.error("Runtime Error:", err.message);
  }
})();
`;
      } else if (language === "python") {
        wrappedCode = `
${code}

input_data = ${JSON.stringify(tc.input)}
result = ${functionName}(*input_data.values())
print(result)
`;
      } else if (language === "cpp") {
        // For simplicity, only handles integer array inputs like nums
        let args = "";
        if (tc.input.nums) {
          args = `vector<int> nums {${tc.input.nums.join(", ")}}`;
        } else if (tc.input.s) {
          args = `string s = "${tc.input.s}"`;
        }

        wrappedCode = `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

${code}

int main() {
    ${args};
    auto result = ${functionName}(${Object.keys(tc.input).join(", ")});
    cout << result << endl;
    return 0;
}
`;
      }

      // ================= File Extension Map ================= //
      const extMap = {
        javascript: "js",
        python: "py",
        cpp: "cpp",
      };

      // ================= Piston API Call ================= //
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version: "*",
        files: [
          {
            name: `main.${extMap[language] || "txt"}`,
            content: wrappedCode,
          },
        ],
      });

      // ================= Parse Output ================= //
      const rawOutput = (response.data.run.output || "").trim();
      let userOutput;
      try {
        userOutput = JSON.parse(rawOutput);
      } catch {
        userOutput = rawOutput; // fallback if not valid JSON
      }

      const passed = JSON.stringify(userOutput) === JSON.stringify(tc.expectedOutput);

      results.push({
        input: tc.input,
        expected: tc.expectedOutput,
        got: userOutput,
        passed,
      });
    }

    return res.json({ success: true, results });
  } catch (err) {
    console.error("❌ Piston API error:", err.message);
    if (err.response) {
      console.error("Details:", err.response.data);
    }
    return res.status(500).json({ error: "❌ Code execution failed" });
  }
});

module.exports = router;
