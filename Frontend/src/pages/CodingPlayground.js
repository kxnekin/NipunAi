import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/codingPlayground.css";
import { fundamentalQuestions } from "./data/questions";

const CodingPlayground = () => {
  const { id } = useParams();
  const question = fundamentalQuestions.find((q) => q.id === Number(id));

  const [code, setCode] = useState(
    question ? question.starterCode : "// Write your solution here"
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript"); // default JS

  // Run Code with test cases
  const handleRun = async () => {
    if (!question) return;
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await axios.post("http://localhost:5000/api/run", {
        code,
        language,
        testCases: question.testCases, // send test cases
      });

      const { results } = response.data;

      // Format results for display
      let formatted = results
        .map(
          (r, i) =>
            `Test ${i + 1}:\nInput: ${JSON.stringify(r.input)}\nExpected: ${JSON.stringify(
              r.expected
            )}\nGot: ${JSON.stringify(r.got)}\nResult: ${r.passed ? "✅ Passed" : "❌ Failed"}\n`
        )
        .join("\n");

      setOutput(formatted);
    } catch (err) {
      console.error(err);
      setOutput("❌ Failed to run code.");
    }

    setLoading(false);
  };

  if (!question) {
    return <div style={{ padding: "20px" }}>❌ Question not found</div>;
  }

  return (
    <div className="playground-container">
      {/* LEFT PANEL: Question */}
      <div className="question-panel">
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <p>
          <strong>Difficulty:</strong> {question.difficulty}
        </p>
        <p>
          <strong>Tags:</strong>{" "}
          {question.tags && question.tags.length > 0
            ? question.tags.join(", ")
            : "None"}
        </p>

        <h3>Examples:</h3>
        {question.testCases && question.testCases.length > 0 ? (
          question.testCases.map((tc, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Example {index + 1}:</strong>
              </p>
              <p>Input: {JSON.stringify(tc.input)}</p>
              <p>Output: {JSON.stringify(tc.expectedOutput)}</p>
            </div>
          ))
        ) : (
          <p>No examples available.</p>
        )}
      </div>

      {/* RIGHT PANEL: Editor */}
      <div className="editor-panel">
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);

            // Set default starter code based on language
            if (e.target.value === "javascript") {
              setCode(question.starterCode || "// JavaScript solution");
            } else if (e.target.value === "python") {
              setCode("# Python solution\ndef solve():\n    pass");
            } else if (e.target.value === "cpp") {
              setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    // C++ solution\n    return 0;\n}`);
            }
          }}
          style={{ marginBottom: "10px", padding: "5px" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        {/* Monaco editor */}
        <Editor
          height="70vh"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />

        {/* Run Button */}
        <button className="run-button" onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>

        {/* Output Section */}
        {output && (
          <pre
            style={{
              marginTop: "10px",
              background: "#111",
              color: "#0f0",
              padding: "10px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
            }}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
};

export default CodingPlayground;
