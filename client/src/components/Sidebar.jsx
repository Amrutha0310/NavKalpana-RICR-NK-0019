import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBookOpen,
  FaClipboardList,
  FaBrain,
  FaUserCheck,
  FaLifeRing,
  FaSignOutAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const studentMenu = [
    { name: "Dashboard", icon: FaTachometerAlt, path: "/student-dashboard" },
    { name: "My Courses", icon: FaBookOpen, path: "/courses" },
    { name: "Assignments", icon: FaClipboardList, path: "/assignments" },
    { name: "Quizzes", icon: FaBrain, path: "/quizzes" },
    { name: "Attendance", icon: FaUserCheck, path: "/attendance" },
    { name: "Support", icon: FaLifeRing, path: "/support" },
  ];

  const teacherMenu = [
    { name: "Dashboard", icon: FaTachometerAlt, path: "/teacher-dashboard" },
    { name: "Manage Courses", icon: FaBookOpen, path: "/courses" },
    { name: "Student Work", icon: FaClipboardList, path: "/assignments" },
    { name: "Quiz Builder", icon: FaBrain, path: "/quizzes" },
    { name: "Doubt Board", icon: FaLifeRing, path: "/support" },
  ];

  const menuItems = role === "teacher" ? teacherMenu : studentMenu;

  return (
    <aside className="w-64 bg-base-100 border-r border-base-300 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-base-300">
        <div className="bg-primary p-2 rounded-lg">
          <FaGraduationCap size={20} className="text-primary-content" />
        </div>
        <h1 className="text-lg font-bold text-base-content">learnify</h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 mt-3 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm
                ${isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }
              `}
            >
              <Icon size={16} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-error hover:bg-error/10 transition-all duration-200 text-sm"
        >
          <FaSignOutAlt size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;