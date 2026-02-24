// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaGraduationCap, FaArrowRight } from "react-icons/fa";

// const Home = () => {
//     const navigate = useNavigate();
//     const user = JSON.parse(sessionStorage.getItem("LearningUser"));

//     return (
//         <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-fadeIn">
//             <div className="max-w-4xl space-y-8">
//                 {/* Visual Accent */}
//                 <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold tracking-wide mb-4">
//                     <FaGraduationCap />
//                     <span>NEXT GENERATION LEARNING</span>
//                 </div>

//                 {/* Hero Title */}
//                 <h1 className="text-5xl md:text-7xl font-bold tracking-tight base-content">
//                     Smart learning for <br />
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
//                         brighter futures.
//                     </span>
//                 </h1>

//                 {/* Hero Subtitle */}
//                 <p className="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
//                     A modern platform built to help students learn efficiently,
//                     track progress in real-time, and achieve career goals.
//                 </p>

//                 {/* CTA Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
//                     <button
//                         className="btn btn-primary btn-lg rounded-full px-10 group"
//                         onClick={() => navigate("/courses")}
//                     >
//                         Browse Courses
//                         <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
//                     </button>

//                     <button
//                         className="btn btn-ghost btn-lg rounded-full px-10 border-2 border-base-content/10"
//                         onClick={() => {
//                             if (user?.role === 'teacher') navigate("/teacher-dashboard");
//                             else navigate("/student-dashboard");
//                         }}
//                     >
//                         Go to Dashboard
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// //           <LearningCard
// //             title="Data Structures & Algorithms"
// //             desc="Problem solving & interview preparation"
// //             badge="Placement Focused"
// //             color="secondary"
// //           />

// //           <LearningCard
// //             title="Aptitude & Reasoning"
// //             desc="Quantitative, Logical & Verbal skills"
// //             badge="Assessment Ready"
// //             color="accent"
// //           />

// //         </div>
// //       </section>

// //       {/* CTA */}
// //       <section className="max-w-5xl mx-auto card bg-base-200 shadow-xl">
// //         <div className="card-body text-center">
// //           <h2 className="text-3xl font-bold mb-4">
// //             Start Learning Today
// //           </h2>
// //           <p className="text-base-content/70 text-lg">
// //             Track progress, stay consistent, and achieve your career goals with
// //             real-time insights and expert-designed courses.
// //           </p>
// //           <div className="card-actions justify-center mt-6">
// //             <button
// //               className="btn btn-primary btn-lg"
// //               onClick={() => navigate("/register")}
// //             >
// //               Get Started <FaPlayCircle />
// //             </button>
// //           </div>
// //         </div>
// //       </section>

// //     </div>
// //   );
// // };

// // /* Learning Card */
// // const LearningCard = ({ title, desc, badge, color }) => (
// //   <div className="card bg-base-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
// //     <div className="card-body">
// //       <h3 className="card-title">
// //         {title}
// //         <span className={`badge badge-${color}`}>{badge}</span>
// //       </h3>
// //       <p className="text-base-content/70">{desc}</p>
// //     </div>
// //   </div>
// // );

// // export default Home;