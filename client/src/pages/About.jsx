import React from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaLaptopCode,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 animate-fadeIn">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <div className="flex justify-center mb-6">
          <FaGraduationCap className="text-primary text-6xl animate-bounceSlow" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          About Our Learning Management System
        </h1>

        <p className="text-slate-400 max-w-3xl mx-auto text-lg">
          A smart, student-focused LMS designed to track progress, improve skills,
          and make learning engaging, interactive, and career-oriented.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <span className="badge badge-primary badge-lg">Student First</span>
          <span className="badge badge-outline badge-lg">Real-Time</span>
          <span className="badge badge-secondary badge-lg">Career Ready</span>
        </div>
      </section>

      {/* FlyonUI Stats */}
      <section className="max-w-6xl mx-auto mb-20">
        <div className="stats shadow bg-base-200 text-base-content w-full">

          <div className="stat">
            <div className="stat-figure text-primary text-3xl">
              <FaUsers />
            </div>
            <div className="stat-title">Active Students</div>
            <div className="stat-value text-primary">1200+</div>
            <div className="stat-desc">Growing daily</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary text-3xl">
              <FaLaptopCode />
            </div>
            <div className="stat-title">Courses</div>
            <div className="stat-value text-secondary">45+</div>
            <div className="stat-desc">Industry aligned</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent text-3xl">
              <FaRocket />
            </div>
            <div className="stat-title">Success Rate</div>
            <div className="stat-value text-accent">95%</div>
            <div className="stat-desc">Placement focused</div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <FeatureCard
          icon={<FaLaptopCode />}
          title="Practical Learning"
          desc="Hands-on assignments, projects, and quizzes to build real-world skills."
        />
        <FeatureCard
          icon={<FaUsers />}
          title="Student-Centric"
          desc="Personalized dashboards, learning streaks, and performance analytics."
        />
        <FeatureCard
          icon={<FaRocket />}
          title="Career Ready"
          desc="Skill tracking, mentor support, and industry-aligned content."
        />
      </section>

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto card bg-base-200 shadow-xl mb-20 animate-slideUp">
        <div className="card-body text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission 🎯</h2>
          <p className="text-base-content/70 text-lg leading-relaxed">
            Our mission is to empower students with structured learning,
            continuous feedback, and real-time insights so they can grow
            confidently and succeed in their careers.
          </p>
          <div className="card-actions justify-center mt-6">
            <button className="btn btn-primary">Explore Courses</button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Our LMS?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reason text="Real-time student dashboard & progress tracking" />
          <Reason text="Assignments, quizzes & leaderboard system" />
          <Reason text="Skill-based learning with performance insights" />
          <Reason text="Clean UI powered by FlyonUI" />
        </div>
      </section>

    </div>
  );
};

/* Feature Card Component (FlyonUI Card) */
const FeatureCard = ({ icon, title, desc }) => (
  <div className="card bg-base-200 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className="card-body text-center">
      <div className="flex justify-center mb-4 text-primary text-4xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-base-content/70">{desc}</p>
    </div>
  </div>
);

/* Reason Item */
const Reason = ({ text }) => (
  <div className="flex items-start gap-4 p-5 rounded-2xl bg-base-200 shadow-sm hover:shadow-md transition">
    <FaCheckCircle className="text-primary mt-1" />
    <p className="text-base-content/80">{text}</p>
  </div>
);

export default About;