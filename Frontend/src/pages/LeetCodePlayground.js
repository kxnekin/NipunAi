import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/codingPlayground.css";

const LeetCodePlayground = () => {
  const { state } = useLocation();
  const { titleSlug } = useParams();
  const [question, setQuestion] = useState(state || null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const [code, setCode] = useState("// Write your solution here");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [language, setLanguage] = useState("javascript");

  // Fetch question if not passed in state
  useEffect(() => {
    const fetchQuestion = async () => {
      if (!question && titleSlug) {
        setLoadingQuestion(true);
        try {
          const res = await fetch(`http://localhost:5000/api/leetcode-questions/${titleSlug}`);
          if (!res.ok) throw new Error("Question not found");
          const data = await res.json();
          setQuestion(data);
        } catch (err) {
          setQuestion({ error: err.message });
        } finally {
          setLoadingQuestion(false);
        }
      }
    };
    fetchQuestion();
  }, [titleSlug, question]);

  if (loadingQuestion) return <div style={{ padding: "20px" }}>⏳ Loading question...</div>;
  if (!question) return <div className="error-message">❌ No question loaded</div>;
  if (question.error) return <div className="error-message">❌ {question.error}</div>;

  // Run code
  const handleRun = async () => {
    setRunning(true);
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
    setRunning(false);
  };

  return (
    <div className="playground-container">
      {/* Left Panel: Question */}
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

        {/* Topic Tags */}
        {question.topicTags && question.topicTags.length > 0 && (
          <div className="tags">
            {question.topicTags.map((tag, idx) => (
              <span key={idx} className="tag">{tag.name}</span>
            ))}
          </div>
        )}

        {/* Question Description */}
        {question.content && (
          <div
            className="question-description"
            dangerouslySetInnerHTML={{ __html: question.content }}
          ></div>
        )}

        {/* Input / Output Examples */}
        {question.exampleTestcases && question.exampleTestcases.length > 0 && (
          <div className="examples">
            <h4>Examples:</h4>
            {question.exampleTestcases.map((ex, idx) => (
              <pre key={idx} className="example-box">{ex}</pre>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel: Editor */}
      <div className="editor-panel">
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            if (e.target.value === "javascript") setCode("// JavaScript Example\nconsole.log('Hello JS!');");
            else if (e.target.value === "python") setCode("# Python Example\nprint('Hello Python!')");
            else if (e.target.value === "cpp")
              setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello C++!" << endl;\n    return 0;\n}`);
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

        <button className="run-button" onClick={handleRun} disabled={running}>
          {running ? "Running..." : "Run Code"}
        </button>

        {output && <pre className="output-box">{output}</pre>}
      </div>
    </div>
  );
};

export default LeetCodePlayground;
