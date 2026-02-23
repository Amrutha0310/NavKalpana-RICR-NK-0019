<<<<<<< HEAD
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaGraduationCap,
//   FaUsers,
//   FaBookOpen,
//   FaChartLine,
//   FaClock,
//   FaPlayCircle,
//   FaSignal,
// } from "react-icons/fa";

// const Home = () => {
//   const navigate = useNavigate();
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [activeUsers, setActiveUsers] = useState(1200);

//   // ⏱ Real-time clock
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // 👥 Simulated real-time active users
//   useEffect(() => {
//     const usersInterval = setInterval(() => {
//       setActiveUsers((prev) => prev + Math.floor(Math.random() * 3));
//     }, 5000);
//     return () => clearInterval(usersInterval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-950 text-white px-6 py-12 animate-fadeIn">

//       {/* Top Status Bar */}
//       <section className="max-w-7xl mx-auto mb-10 flex flex-wrap justify-between items-center gap-4">
//         <div className="flex items-center gap-2 text-sm text-slate-400">
//           <FaSignal className="text-green-400" />
//           System Status: <span className="text-green-400">Online</span>
//         </div>

//         <div className="flex items-center gap-3 bg-base-200 px-4 py-2 rounded-xl">
//           <FaClock className="text-primary" />
//           <span className="font-mono text-sm">
//             {currentTime.toLocaleTimeString()}
//           </span>
//         </div>
//       </section>

//       {/* Hero Section */}
//       <section className="max-w-6xl mx-auto text-center mb-20">
//         <FaGraduationCap className="text-primary text-6xl mx-auto mb-6 animate-bounceSlow" />

//         <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
//           Smart Learning. Real-Time Progress.
//         </h1>

//         <p className="text-slate-400 max-w-3xl mx-auto text-lg">
//           A modern Learning Management System built to help students learn
//           efficiently, track performance live, and become career-ready.
//         </p>

//         <div className="mt-8 flex justify-center gap-4 flex-wrap">
//           <button
//             className="btn btn-primary btn-lg"
//             onClick={() => navigate("/courses")}
//           >
//             Browse Courses
//           </button>
//           <button
//             className="btn btn-outline btn-lg"
//             onClick={() => navigate("/learning")}
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </section>

//       {/* Live Stats */}
//       <section className="max-w-7xl mx-auto mb-20">
//         <div className="stats shadow bg-base-200 text-base-content w-full">

//           <div className="stat">
//             <div className="stat-figure text-primary text-3xl">
//               <FaUsers />
//             </div>
//             <div className="stat-title">Active Learners</div>
//             <div className="stat-value text-primary">{activeUsers}</div>
//             <div className="stat-desc">Live users online</div>
//           </div>

//           <div className="stat">
//             <div className="stat-figure text-secondary text-3xl">
//               <FaBookOpen />
//             </div>
//             <div className="stat-title">Courses Available</div>
//             <div className="stat-value text-secondary">48</div>
//             <div className="stat-desc">Industry aligned</div>
//           </div>

//           <div className="stat">
//             <div className="stat-figure text-accent text-3xl">
//               <FaChartLine />
//             </div>
//             <div className="stat-title">Avg Completion</div>
//             <div className="stat-value text-accent">92%</div>
//             <div className="stat-desc">Last 30 days</div>
//           </div>

//         </div>
//       </section>

//       {/* Learning Paths */}
//       <section className="max-w-6xl mx-auto mb-20">
//         <h2 className="text-3xl font-bold text-center mb-10">
//           Structured Learning Paths
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//           <LearningCard
//             title="Full Stack Development"
//             desc="Frontend, Backend & Databases with projects"
//             badge="Most Popular"
//             color="primary"
//           />
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaArrowRight } from "react-icons/fa";

const Home = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("LearningUser"));

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-fadeIn">
            <div className="max-w-4xl space-y-8">
                {/* Visual Accent */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-4">
                    <FaGraduationCap />
                    <span>NEXT GENERATION LEARNING</span>
                </div>

                {/* Hero Title */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight base-content">
                    Smart learning for <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        brighter futures.
                    </span>
                </h1>

                {/* Hero Subtitle */}
                <p className="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
                    A modern platform built to help students learn efficiently,
                    track progress in real-time, and achieve career goals.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <button
                        className="btn btn-primary btn-lg rounded-full px-10 group"
                        onClick={() => navigate("/courses")}
                    >
                        Browse Courses
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        className="btn btn-ghost btn-lg rounded-full px-10 border-2 border-base-content/10"
                        onClick={() => {
                            if (user?.role === 'teacher') navigate("/teacher-dashboard");
                            else navigate("/student-dashboard");
                        }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
>>>>>>> 6599d6c23de3679a93331a350f97371d4da91c47

//           <LearningCard
//             title="Data Structures & Algorithms"
//             desc="Problem solving & interview preparation"
//             badge="Placement Focused"
//             color="secondary"
//           />

//           <LearningCard
//             title="Aptitude & Reasoning"
//             desc="Quantitative, Logical & Verbal skills"
//             badge="Assessment Ready"
//             color="accent"
//           />

//         </div>
//       </section>

//       {/* CTA */}
//       <section className="max-w-5xl mx-auto card bg-base-200 shadow-xl">
//         <div className="card-body text-center">
//           <h2 className="text-3xl font-bold mb-4">
//             Start Learning Today
//           </h2>
//           <p className="text-base-content/70 text-lg">
//             Track progress, stay consistent, and achieve your career goals with
//             real-time insights and expert-designed courses.
//           </p>
//           <div className="card-actions justify-center mt-6">
//             <button
//               className="btn btn-primary btn-lg"
//               onClick={() => navigate("/register")}
//             >
//               Get Started <FaPlayCircle />
//             </button>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// };

// /* Learning Card */
// const LearningCard = ({ title, desc, badge, color }) => (
//   <div className="card bg-base-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
//     <div className="card-body">
//       <h3 className="card-title">
//         {title}
//         <span className={`badge badge-${color}`}>{badge}</span>
//       </h3>
//       <p className="text-base-content/70">{desc}</p>
//     </div>
//   </div>
// );

// export default Home;