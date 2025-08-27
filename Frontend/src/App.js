// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminHome';
import CreateJob from './pages/Createjob';
import JobsPage from './pages/Jobpage';
import CodingPracticeLanding from "./pages/CodingPracticeLanding";
import FundamentalsPage from "./pages/FundamentalsPage";
import CodingPlayground from "./pages/CodingPlayground";
import LeetCodeQuestions from "./pages/LeetCodeQuestions";
import LeetCodePlayground from "./pages/LeetCodePlayground";
import InterviewLanding from "./pages/InterviewLanding";
import InterviewSession from "./pages/InterviewSession";

import './App.css';

// ✅ Temporary hardcoded sample questions
const sampleQuestions = [
  { questionFrontendId: "1", title: "Two Sum", difficulty: "Easy", titleSlug: "two-sum" },
  { questionFrontendId: "2", title: "Add Two Numbers", difficulty: "Medium", titleSlug: "add-two-numbers" },
  { questionFrontendId: "3", title: "Longest Substring", difficulty: "Hard", titleSlug: "longest-substring-without-repeating-characters" },
];

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Auth & Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboards */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/create" element={<CreateJob />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/jobs" element={<JobsPage />} />

          {/* Coding Section */}
          <Route path="/coding" element={<CodingPracticeLanding />} />
          <Route path="/coding/fundamentals" element={<FundamentalsPage />} />
          <Route path="/coding/playground/:id" element={<CodingPlayground />} />

          {/* ✅ LeetCode Section */}
          <Route path="/coding/leetcode" element={<LeetCodeQuestions questions={sampleQuestions} />} />
          <Route path="/coding/leetcode/:slug" element={<LeetCodePlayground />} />

          {/* ✅ Interview Section */}
          <Route path="/interview" element={<InterviewLanding />} />
          <Route path="/interview/session" element={<InterviewSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
