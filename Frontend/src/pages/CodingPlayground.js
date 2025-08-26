import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/codingPlayground.css";
import { fundamentalQuestions } from "./data/questions";

const CodingPlayground = () => {
  const { id } = useParams();
  const question = fundamentalQuestions.find((q) => q.id === Number(id));

  const [code, setCode] = useState("// Write your solution here");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript"); // ✅ default JS

  // Run Code
  const handleRun = async () => {
    setLoading(true);
    setOutput("Running...");

    try {
      const response = await axios.post("http://localhost:5000/api/run", {
        code,
        input: question.input || "",
        language, // ✅ match backend piston format
      });

      const result = response.data;

      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.stderr) {
        setOutput("Error:\n" + result.stderr);
      } else if (result.output) {
        setOutput(result.output);
      } else {
        setOutput("Unknown error. Try again.");
      }
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
      <div className="question-panel">
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <p>INPUT : {question.input}</p>
        <p>OUTPUT : {question.output}</p>
        <p>EXAMPLES : {question.examples}</p>
      </div>

      <div className="editor-panel">
        {/* ✅ Language Selector */}
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);

            // ✅ Set default template code when language changes
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

        {/* ✅ Monaco editor auto-updates language */}
        <Editor
          height="70vh"
          language={language === "cpp" ? "cpp" : language} 
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />

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
