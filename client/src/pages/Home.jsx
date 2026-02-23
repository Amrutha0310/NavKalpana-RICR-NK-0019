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