import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaTasks,
  FaChartLine,
  FaUserGraduate,
  FaPlayCircle,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200">

      {/* Hero Section */}
      <div className="hero bg-gradient-to-r text-white py-20">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-4">
              Welcome to <span className="text-warning">Learnify</span>
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Learn skills. Track progress. Achieve your goals.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className="btn btn-warning btn-lg"
                onClick={() => navigate("/learning")}
              >
                My Learning
              </button>
              <button
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-indigo-600"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="stats shadow w-full bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaBookOpen size={28} />
            </div>
            <div className="stat-title">Courses</div>
            <div className="stat-value">120+</div>
            <div className="stat-desc">Updated regularly</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <FaUserGraduate size={28} />
            </div>
            <div className="stat-title">Students</div>
            <div className="stat-value">8.5K+</div>
            <div className="stat-desc">Active learners</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <FaChartLine size={28} />
            </div>
            <div className="stat-title">Completion</div>
            <div className="stat-value">92%</div>
            <div className="stat-desc">Success rate</div>
          </div>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Popular Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="card bg-base-100 shadow hover:shadow-xl transition">
            <div className="card-body">
              <h3 className="card-title">
                Full Stack MERN
                <span className="badge badge-primary">Trending</span>
              </h3>
              <p>React, Node, MongoDB with real projects.</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/courses")}
                >
                  <FaPlayCircle /> Start
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow hover:shadow-xl transition">
            <div className="card-body">
              <h3 className="card-title">
                Data Structures
                <span className="badge badge-success">Placement</span>
              </h3>
              <p>DSA for interviews & coding rounds.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-success btn-sm">
                  <FaPlayCircle /> Start
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow hover:shadow-xl transition">
            <div className="card-body">
              <h3 className="card-title">
                Aptitude & Reasoning
                <span className="badge badge-warning">Exam</span>
              </h3>
              <p>Quant, logical & verbal practice.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-warning btn-sm">
                  <FaPlayCircle /> Start
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Student Actions */}
      <div className="bg-base-100 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div
            className="card bg-base-200 shadow hover:scale-105 transition cursor-pointer"
            onClick={() => navigate("/assignments")}
          >
            <div className="card-body items-center">
              <FaTasks size={32} className="text-primary" />
              <h3 className="card-title">Assignments</h3>
              <p className="text-sm">Submit & review tasks</p>
            </div>
          </div>

          <div
            className="card bg-base-200 shadow hover:scale-105 transition cursor-pointer"
            onClick={() => navigate("/progress")}
          >
            <div className="card-body items-center">
              <FaChartLine size={32} className="text-success" />
              <h3 className="card-title">Progress</h3>
              <p className="text-sm">Track learning growth</p>
            </div>
          </div>

          <div
            className="card bg-base-200 shadow hover:scale-105 transition cursor-pointer"
            onClick={() => navigate("/contact")}
          >
            <div className="card-body items-center">
              <FaUserGraduate size={32} className="text-warning" />
              <h3 className="card-title">Support</h3>
              <p className="text-sm">Ask mentors for help</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;