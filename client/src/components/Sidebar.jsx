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

const Sidebar = () => {
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
    <aside className="w-64 bg-base-100 border-r border-base-300 flex flex-col h-screen sticky top-0">

      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <FaGraduationCap size={24} className="text-primary-content" />
        </div>
        <h1 className="text-xl font-bold text-base-content">learnify</h1>
      </div>


      <nav className="flex-1 mt-4 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-primary text-primary-content shadow-md"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>


      <div className="p-4 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-error hover:bg-error/10 transition-all duration-200"
        >
          <FaSignOutAlt size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;