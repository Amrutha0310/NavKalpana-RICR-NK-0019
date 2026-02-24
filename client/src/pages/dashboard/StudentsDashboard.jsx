import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import Sidebar from "../../components/Sidebar";
import {
  FaTrophy,
  FaFire,
  FaBullseye,
  FaGraduationCap,
  FaCalendarAlt,
  FaChartLine,
  FaClock,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StudentsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/user/dashboard");

        const weeklyDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = weeklyDays[new Date().getDay()];

        const weeklyChartWithColors = res.data.weeklyChart.map((item) => ({
          ...item,
          fill: item.day === today ? "#38bdf8" : "#1e293b",
        }));

        setData({
          ...res.data,
          weeklyChart: weeklyChartWithColors,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const user = JSON.parse(sessionStorage.getItem("LearningUser"));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaChartLine className="text-primary-500 animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">
            {getGreeting()}, {user?.fullName || 'Student'}! 👋
          </h2>
          <p className="text-slate-400 mt-1">
            Here's what's happening with your learning today.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/50 p-2 pl-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Current Time
            </span>
            <span className="text-sm font-mono text-primary-400">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="p-2 bg-slate-800 rounded-xl">
            <FaClock className="text-slate-400" />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Academic Score"
          value={`${data?.performance || 0}%`}
          desc="Overall Performance"
          icon={FaTrophy}
          color="text-yellow-500"
          bg="bg-yellow-500/10"
        />
        <StatCard
          title="Assignments"
          value={`${data?.assignments.completed || 0}/${data?.assignments.total || 0}`}
          desc="Completed Tasks"
          icon={FaBullseye}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Learning Streak"
          value={data?.learningStreak || 0}
          desc="Days in a row"
          icon={FaFire}
          color="text-orange-500"
          bg="bg-orange-500/10"
        />
        <StatCard
          title="Skills Acquired"
          value={`${data?.skillsCount || 0}/${data?.totalSkills || 0}`}
          desc="Total Skills"
          icon={FaGraduationCap}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">
            Weekly Progress
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyChart}>
                <XAxis dataKey="day" tick={{ fill: "#94a3b8" }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                // Each bar will automatically use the fill from data
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-base-100 p-6 rounded-3xl border border-base-300 shadow-sm">
          <h3 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-primary" />
            Upcoming Events
          </h3>

          <EventItem
            title="React Mid-Term Quiz"
            time="Feb 22, 10:00 AM"
            type="Quiz"
            color="bg-orange-500"
          />
          <EventItem
            title="Portfolio Submission"
            time="Feb 25, 11:59 PM"
            type="Assignment"
            color="bg-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};

// statCard
const StatCard = ({ title, value, desc, icon: Icon, color, bg }) => (
  <div className="glass p-6 rounded-3xl border border-slate-800">
    <div className={`p-3 ${bg} ${color} rounded-2xl w-fit mb-4`}>
      <Icon size={24} />
    </div>
    <p className="text-slate-400 text-sm">{title}</p>
    <h4 className="text-3xl font-bold text-white">{value}</h4>
    <p className="text-slate-500 text-xs mt-2 uppercase">{desc}</p>
  </div>
);


const EventItem = ({ title, time, type, color }) => (
  <div className="flex items-start gap-4 mb-4">
    <div className={`w-1 h-12 rounded-full ${color}`} />
    <div>
      <h5 className="font-semibold text-slate-200">{title}</h5>
      <p className="text-sm text-slate-400">{time}</p>
      <span
        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${color} bg-opacity-10 ${color.replace(
          "bg-",
          "text-"
        )}`}
      >
        {type}
      </span>
    </div>
  </div>
);

export default StudentsDashboard;