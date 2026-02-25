import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
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
          fill: item.day === today ? "#38bdf8" : "#94a3b8",
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

  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaChartLine className="text-primary animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-base-content">
            {getGreeting()}, {user?.fullName || 'Student'}! 👋
          </h2>
          <p className="text-base-content/70 text-sm mt-1">
            Here's what's happening with your learning today.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-base-100 p-2 pl-4 rounded-xl border border-base-300 shadow-sm self-start">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-base-content/40 uppercase">
              Current Time
            </span>
            <span className="text-xs font-mono text-primary font-bold">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="p-2 bg-base-200 rounded-lg">
            <FaClock className="text-base-content/40" size={14} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Academic Score"
          value={`${data?.performance || 0}%`}
          desc="Overall Performance"
          icon={FaTrophy}
          color="text-yellow-600"
          bg="bg-yellow-500/10"
        />
        <StatCard
          title="Assignments"
          value={`${data?.assignments.completed || 0}/${data?.assignments.total || 0}`}
          desc="Completed Tasks"
          icon={FaBullseye}
          color="text-emerald-600"
          bg="bg-emerald-500/10"
        />
        <StatCard
          title="Learning Streak"
          value={data?.learningStreak || 0}
          desc="Days in a row"
          icon={FaFire}
          color="text-orange-600"
          bg="bg-orange-500/10"
        />
        <StatCard
          title="Skills Acquired"
          value={`${data?.skillsCount || 0}/${data?.totalSkills || 0}`}
          desc="Total Skills"
          icon={FaGraduationCap}
          color="text-blue-600"
          bg="bg-blue-500/10"
        />
      </div>

      {/* Charts & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-base-100 shadow-sm p-4 sm:p-6 rounded-2xl border border-base-300">
          <h3 className="text-base sm:text-lg font-bold text-base-content mb-4">
            Weekly Progress
          </h3>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weeklyChart}>
                <XAxis dataKey="day" tick={{ fill: "currentColor", fontSize: 12 }} className="text-base-content/60" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--b1)', color: 'var(--bc)', borderRadius: '12px', border: '1px solid var(--b3)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-base-100 p-4 sm:p-6 rounded-2xl border border-base-300 shadow-sm">
          <h3 className="text-base sm:text-lg font-bold text-base-content mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-primary" size={16} />
            Upcoming Events
          </h3>
          <EventItem title="React Mid-Term Quiz" time="Feb 22, 10:00 AM" type="Quiz" color="bg-orange-500" />
          <EventItem title="Portfolio Submission" time="Feb 25, 11:59 PM" type="Assignment" color="bg-emerald-500" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, desc, icon: Icon, color, bg }) => (
  <div className="bg-base-100 shadow-sm p-4 sm:p-5 rounded-2xl border border-base-300">
    <div className={`p-2.5 ${bg} ${color} rounded-xl w-fit mb-3`}>
      <Icon size={18} />
    </div>
    <p className="text-base-content/60 text-xs">{title}</p>
    <h4 className="text-xl sm:text-2xl font-bold text-base-content">{value}</h4>
    <p className="text-base-content/40 text-[10px] uppercase font-bold mt-1">{desc}</p>
  </div>
);

const EventItem = ({ title, time, type, color }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className={`w-1 h-10 rounded-full ${color}`} />
    <div>
      <h5 className="font-semibold text-sm text-base-content">{title}</h5>
      <p className="text-xs text-base-content/60">{time}</p>
      <span
        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${color} bg-opacity-10 ${color.replace("bg-", "text-")}`}
      >
        {type}
      </span>
    </div>
  </div>
);

export default StudentsDashboard;