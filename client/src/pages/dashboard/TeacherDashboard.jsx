import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from "../../config/Api"
import {
  FaUsers,
  FaBookOpen,
  FaClipboardCheck,
  FaPlusCircle,
  FaChartLine,
  FaComments,
  FaClock,
  FaChevronRight
} from 'react-icons/fa';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingAssignments: 0,
    averageEngagement: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/user/teacher-dashboard');

        setStats({
          totalStudents: data.totalStudents,
          activeCourses: data.activeCourses,
          pendingAssignments: data.pendingAssignments,
          averageEngagement: data.averageEngagement
        });

        setRecentSubmissions(data.recentSubmissions);
      } catch (err) {
        console.error('Error fetching teacher stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const { user, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaChartLine className="text-primary animate-pulse text-5xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-base-content">
            Hello, {user?.fullName || 'Professor'} 👋
          </h2>
          <p className="text-base-content/70 text-sm mt-1">
            Here's what's happening in your classes today.
          </p>
        </div>

        {role === 'teacher' && (
          <button
            onClick={() => navigate('/courses')}
            className="btn btn-primary btn-sm sm:btn-md rounded-xl flex items-center gap-2 shadow-lg self-start"
          >
            <FaPlusCircle className="text-sm" /> Create New Course
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: FaUsers, color: 'bg-blue-600' },
          { label: 'Active Courses', value: stats.activeCourses, icon: FaBookOpen, color: 'bg-emerald-600' },
          { label: 'Submissions', value: stats.pendingAssignments, icon: FaClipboardCheck, color: 'bg-orange-600' },
          { label: 'Engagement', value: `${stats.averageEngagement}%`, icon: FaChartLine, color: 'bg-purple-600' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-base-100 shadow-sm p-4 sm:p-5 rounded-2xl border border-base-300 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2.5 sm:p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-base-content/50 uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-base-content">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-base-content">Recent Submissions</h3>
            <button
              onClick={() => navigate('/assignments')}
              className="text-primary hover:text-primary/80 text-xs font-bold flex items-center gap-1"
            >
              View All <FaChevronRight size={10} />
            </button>
          </div>

          <div className="bg-base-100 shadow-sm rounded-2xl border border-base-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-base-200">
                  <tr className="text-base-content/60 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    <th className="px-4 sm:px-6 py-3">Student</th>
                    <th className="px-4 sm:px-6 py-3">Course</th>
                    <th className="px-4 sm:px-6 py-3">Status</th>
                    <th className="px-4 sm:px-6 py-3">Time</th>
                    <th className="px-4 sm:px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center text-[10px] font-bold text-primary">
                            {sub.student.charAt(0)}
                          </div>
                          <span className="font-semibold text-sm text-base-content">
                            {sub.student}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-base-content/70 text-xs font-medium">
                        {sub.course}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sub.status === 'Pending'
                            ? 'bg-orange-500/10 text-orange-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-base-content/60 text-xs font-mono flex items-center gap-1">
                        <FaClock className="text-[10px]" />
                        {new Date(sub.time).toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <button
                          onClick={() => navigate('/assignments')}
                          className="text-primary hover:text-primary/80 font-bold text-xs"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-base-content">Teacher Actions</h3>
          <div className="bg-base-100 shadow-sm p-4 sm:p-5 rounded-2xl border border-base-300 space-y-3">
            <ActionButton
              icon={<FaComments />}
              title="Doubt Board"
              desc={`${stats.pendingAssignments} new doubts`}
              onClick={() => navigate('/support')}
              color="text-orange-600"
            />
            <ActionButton
              icon={<FaClipboardCheck />}
              title="Review Work"
              desc="Grade student submissions"
              onClick={() => navigate('/assignments')}
              color="text-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, title, desc, onClick, color }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-300 hover:border-primary/50 hover:bg-base-200 transition-all text-left group"
  >
    <div className={`w-9 h-9 rounded-lg bg-base-200 ${color} flex items-center justify-center shadow-inner text-sm`}>
      {icon}
    </div>
    <div>
      <h4 className="text-xs font-bold text-base-content">{title}</h4>
      <p className="text-[10px] text-base-content/50 font-medium">{desc}</p>
    </div>
  </button>
);

export default TeacherDashboard;