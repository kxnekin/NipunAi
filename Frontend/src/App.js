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
import AdminRoadmaps from "./pages/AdminRoadmaps";
import ViewJobCards from "./pages/ViewJobCards";
import InterviewLanding from "./pages/InterviewLanding";
import InterviewSession from "./pages/InterviewSession";
import ResumeOptimizer from './pages/ResumeOptimizer';
import ProfilePage from './pages/ProfilePage';
import AdminStudents from "./pages/AdminStudents";
// import StudentDetails from "./pages/StudentDetails";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ✅ Auth & Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Student & Admin Dashboards */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/create" element={<CreateJob />} />
          <Route path="/admin-dashboard/view" element={<ViewJobCards />} />
          <Route path="/admin-dashboard/roadmaps" element={<AdminRoadmaps />} />

          {/* ✅ Admin Student Management */}
          <Route path="/admin-dashboard/students" element={<AdminStudents />} />
          {/* <Route path="/admin-dashboard/student/:email" element={<StudentDetails />} /> */}

          {/* ✅ Job & Resume Routes */}
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/resume-optimizer" element={<ResumeOptimizer />} />

          {/* ✅ Profile Page route */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* ✅ Coding Section */}
          <Route path="/coding" element={<CodingPracticeLanding />} />
          <Route path="/coding/fundamentals" element={<FundamentalsPage />} />
          <Route path="/coding/playground/:id" element={<CodingPlayground />} />
          <Route path="/coding/leetcode" element={<LeetCodeQuestions />} />

          {/* ✅ Interview Section */}
          <Route path="/interview" element={<InterviewLanding />} />
          <Route path="/interview/session" element={<InterviewSession />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
