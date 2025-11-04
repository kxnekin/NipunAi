import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentJobView from './pages/StudentJobView';
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
import ViewJobCards from "./pages/ViewJobCards";
import MockInterview from "./pages/MockInterview";
import TestFFmpeg from "./pages/TestFFmpeg";
import MockInterviewSession from "./pages/MockInterviewSession";
import './App.css';

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
          <Route path="/admin-dashboard/view" element={<ViewJobCards />} />
          
          {/* FIXED THIS LINE: Use element prop instead of component */}
          <Route path="/student-jobs" element={<StudentJobView />} />

          {/* Coding Section */}
          <Route path="/coding" element={<CodingPracticeLanding />} />
          <Route path="/coding/fundamentals" element={<FundamentalsPage />} />
          <Route path="/coding/playground/:id" element={<CodingPlayground />} />
          <Route path="/coding/leetcode" element={<LeetCodeQuestions />} />

          {/* AI Mock Interview + FFmpeg Test */}
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/interview" element={<MockInterviewSession />} />
          <Route path="/testffmpeg" element={<TestFFmpeg />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
