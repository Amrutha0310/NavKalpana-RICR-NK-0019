import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SidebarLayout from "./components/layout/SidebarLayout";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import Support from "./pages/Support";
import Quiz from "./pages/Quiz";
import Quizzes from "./pages/Quizzes";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
// import Footer from "./components/Footer";
import StudentsDashboard from "./pages/dashboard/StudentsDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import { Toaster } from "react-hot-toast";
import CourseDetail from "./pages/CourseDetail";

const App = () => {
  const user = JSON.parse(sessionStorage.getItem("LearningUser"));
  const role = user?.role || "student";
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />

      <Routes>
        <Route path="/" element={<Register />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}

        {role === "student" && (
          <Route element={<SidebarLayout />}>
            <Route path="/student-dashboard" element={<StudentsDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/support" element={<Support />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/CourseDetail" element={<CourseDetail />} />
          </Route>
        )}


        {role === "teacher" && (
          <Route element={<SidebarLayout />}>
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/support" element={<Support />} />
          </Route>
        )}

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to={role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"}
            />
          }
        />
      </Routes>


    </BrowserRouter>
  );
};

export default App;