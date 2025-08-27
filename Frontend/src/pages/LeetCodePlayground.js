import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/codingPlayground.css";

const LeetCodePlayground = () => {
  const { state } = useLocation(); // { questionFrontendId, title, titleSlug, difficulty }
  const question = state;

  const [code, setCode] = useState("// Write your solution here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");

  if (!question) {
    return <div className="error-message">❌ No question loaded</div>;
  }

  // Run Code
  const handleRun = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await axios.post("http://localhost:5000/api/run", {
        code,
        input: "",
        language,
      });

      const result = response.data;

      if (result.stdout) setOutput(result.stdout);
      else if (result.stderr) setOutput("Error:\n" + result.stderr);
      else if (result.output) setOutput(result.output);
      else setOutput("Unknown error. Try again.");
    } catch (err) {
      console.error(err);
      setOutput("❌ Failed to run code.");
    }

    setLoading(false);
  };

  return (
    <div className="playground-container">
      {/* Question Section */}
      <div className="question-panel">
        <h2>
          {question.questionFrontendId}. {question.title}
        </h2>
        <p>
          <b>Difficulty:</b>{" "}
          <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
            {question.difficulty}
          </span>
        </p>
        <p>
          (Full description can be fetched later using{" "}
          <code>{question.titleSlug}</code>)
        </p>
      </div>

      {/* Editor Section */}
      <div className="editor-panel">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            if (e.target.value === "javascript") {
              setCode("// JavaScript Example\nconsole.log('Hello JS!');");
            } else if (e.target.value === "python") {
              setCode("# Python Example\nprint('Hello Python!')");
            } else if (e.target.value === "cpp") {
              setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++!" << endl;\n    return 0;\n}`);
            }
          }}
          style={{ marginBottom: "10px", padding: "5px" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <Editor
          height="70vh"
          language={language === "cpp" ? "cpp" : language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
        />

        <button className="run-button" onClick={handleRun} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>

        {output && (
          <pre className="output-box">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
};

export default LeetCodePlayground;
