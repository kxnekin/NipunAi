import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Importing all pages
import StudentJobView from "./pages/StudentJobView";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminHome";
import CreateJob from "./pages/Createjob";
import JobsPage from "./pages/Jobpage";
import CodingPracticeLanding from "./pages/CodingPracticeLanding";
import FundamentalsPage from "./pages/FundamentalsPage";
import CodingPlayground from "./pages/CodingPlayground";
import LeetCodeQuestions from "./pages/LeetCodeQuestions";
import ViewJobCards from "./pages/ViewJobCards";
import MockInterview from "./pages/MockInterview";
import TestFFmpeg from "./pages/TestFFmpeg";
import ProfilePage from "./pages/ProfilePage";
import ResumeOptimizer from "./pages/ResumeOptimizer";

// --- ROADMAP IMPORTS ---
import AdminRoadmaps from "./pages/AdminRoadmaps";         // ✅ Admin upload page
import StudentRoadmapsView from "./pages/StudentRoadmapsView"; // 🌟 Student view page

// --- 📚 CORE SUBJECT IMPORTS ---
import AdminCoreSubjects from "./pages/AdminCoreSubjects";     // ✅ Admin upload page
import StudentCoreSubjectsView from "./pages/StudentCoreSubjectsView"; // 🌟 Student view page

// --- 🏢 NEW COMPANY RESOURCE IMPORTS ---
import AdminCompanyResources from "./pages/AdminCompanyResources";     // 👈 1. ADD THIS
import StudentCompanyResourcesView from "./pages/StudentCompanyResourcesView"; // 👈 2. ADD THIS

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ... (all your other routes like /login, /signup) ... */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/create" element={<CreateJob />} />
          <Route path="/admin-dashboard/view" element={<ViewJobCards />} />
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/student-jobs" element={<StudentJobView />} />
          
          {/* ✅ Coding Section */}
          <Route path="/coding" element={<CodingPracticeLanding />} />
          <Route path="/coding/fundamentals" element={<FundamentalsPage />} />
          <Route path="/coding/playground/:id" element={<CodingPlayground />} />
          <Route path="/coding/leetcode" element={<LeetCodeQuestions />} />

          {/* ✅ Admin & Student Roadmaps */}
          <Route 
            path="/admin-dashboard/roadmaps" 
            element={<AdminRoadmaps />} 
          /> 
          <Route 
            path="/coding/admin-roadmaps" 
            element={<StudentRoadmapsView />} 
          /> 

          {/* 📚 --- CORE SUBJECT ROUTES --- 📚 */}
          <Route 
            path="/admin-dashboard/core-subjects" 
            element={<AdminCoreSubjects />} 
          />
          <Route 
            path="/coding/core-subjects" 
            element={<StudentCoreSubjectsView />} 
          />
          
          {/* 🏢 --- NEW COMPANY RESOURCE ROUTES --- 🏢 */}
          {/* This route is for ADMINS to upload files */}
          <Route 
            path="/admin-dashboard/company-resources" // 👈 3. ADD THIS
            element={<AdminCompanyResources />} 
          />
          {/* This route is for STUDENTS to view files */}
          <Route 
            path="/coding/company-resources" // 👈 4. ADD THIS
            element={<StudentCompanyResourcesView />} 
          />
          {/* --- END OF NEW ROUTES --- */}

          {/* ... (all your other routes) ... */}
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/testffmpeg" element={<TestFFmpeg />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resume-optimiser" element={<ResumeOptimizer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;