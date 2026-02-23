import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
<<<<<<< HEAD
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import Courses from "./pages/Courses";   
=======
import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
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
<<<<<<< HEAD
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
=======
        <Route path="/courses" element={<Courses />} />
        <Route path="/support" element={<Support />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/CourseDetail" element={<CourseDetail />} />
        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/student-dashboard" element={<StudentsDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />


      </Routes>
      {/* 
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47
      <Footer /> */}
    </BrowserRouter>
  );
};

export default App;