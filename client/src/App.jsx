import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
        <Route path="/courses" element={<Courses />} /> 
        <Route path="/support" element={<Support />} /> 
        <Route path="/quiz" element={<Quiz/>} /> 
        <Route path="/quizzes" element={<Quizzes/>} /> 
        <Route path="/assignments" element={<Assignments/>} /> 
        <Route path="/CourseDetail" element={<CourseDetail/>} /> 
        <Route path="/Attendance" element={<Attendance/>} /> 
        <Route path="/studentsdashboard" element={<StudentsDashboard />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        

      </Routes>
{/* 
      <Footer /> */}
    </BrowserRouter>
  );
};

export default App;