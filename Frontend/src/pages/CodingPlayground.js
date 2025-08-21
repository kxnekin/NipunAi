import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "../styles/codingPlayground.css";
import { fundamentalQuestions } from "./data/questions";

const CodingPlayground = () => {
  const { id } = useParams();
  const question = fundamentalQuestions.find(q => q.id === Number(id));

  const [code, setCode] = useState("// Write your solution here");

  if (!question) {
    return <div style={{ padding: "20px" }}>❌ Question not found</div>;
  }

  return (
    <div className="playground-container">
      <div className="question-panel">
        <h2>{question.title}</h2>
        <p>{question.description}</p>
      </div>

      <div className="editor-panel">
        <Editor
          height="80vh"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
        <button className="run-button">Run Code</button>
      </div>
    </div>
  );
};

export default CodingPlayground;
