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
import AdminRoadmaps from "./pages/AdminRoadmaps";
import StudentRoadmapsView from "./pages/StudentRoadmapsView";

// --- 📚 CORE SUBJECT IMPORTS ---
import AdminCoreSubjects from "./pages/AdminCoreSubjects";
import StudentCoreSubjectsView from "./pages/StudentCoreSubjectsView";

// --- 🏢 COMPANY RESOURCE IMPORTS ---
import AdminCompanyResources from "./pages/AdminCompanyResources";
import StudentCompanyResourcesView from "./pages/StudentCompanyResourcesView";

// --- 📋 NEW PAGE: My Applications ---
import MyApplications from "./pages/MyApplications";

// --- 📢 ADMIN ANNOUNCEMENTS PAGE ---
import AdminAnnouncements from "./pages/AdminAnnouncements";

// --- 👥 ADMIN STUDENTS PAGE ---
import AdminStudents from "./pages/AdminStudents"; // ✅ IMPORT THIS

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* 🏠 Main & Auth Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🎓 Student Dashboard */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/my-applications" element={<MyApplications />} />

          {/* 👨‍💼 Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/create" element={<CreateJob />} />
          <Route path="/admin-dashboard/view" element={<ViewJobCards />} />

          {/* 📢 Announcements (NEW) */}
          <Route path="/admin-dashboard/announcements" element={<AdminAnnouncements />} />

          {/* 👥 View Students (NEW) */}
          <Route path="/admin-dashboard/students" element={<AdminStudents />} /> {/* ✅ ADD THIS ROUTE */}

          {/* 💼 Job Pages */}
          <Route path="/create-job" element={<CreateJob />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/student-jobs" element={<StudentJobView />} />

          {/* 💻 Coding Section */}
          <Route path="/coding" element={<CodingPracticeLanding />} />
          <Route path="/coding/fundamentals" element={<FundamentalsPage />} />
          <Route path="/coding/playground/:id" element={<CodingPlayground />} />
          <Route path="/coding/leetcode" element={<LeetCodeQuestions />} />

          {/* 🧭 Admin & Student Roadmaps */}
          <Route path="/admin-dashboard/roadmaps" element={<AdminRoadmaps />} />
          <Route path="/coding/admin-roadmaps" element={<StudentRoadmapsView />} />

          {/* 📚 Core Subjects */}
          <Route path="/admin-dashboard/core-subjects" element={<AdminCoreSubjects />} />
          <Route path="/coding/core-subjects" element={<StudentCoreSubjectsView />} />

          {/* 🏢 Company Resources */}
          <Route path="/admin-dashboard/company-resources" element={<AdminCompanyResources />} />
          <Route path="/coding/company-resources" element={<StudentCompanyResourcesView />} />

          {/* 🤖 Mock Interview & Resume */}
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