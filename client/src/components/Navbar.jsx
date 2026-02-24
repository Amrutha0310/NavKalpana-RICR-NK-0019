
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaGraduationCap,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem("lms-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);

    // Initial check
    const storedUser = JSON.parse(sessionStorage.getItem("LearningUser"));
    setUser(storedUser);

    // Listen for changes in session storage (tab sync or login/logout)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("LearningUser"));
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event listener for same-tab updates
    window.addEventListener("userLogin", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLogin", handleStorageChange);
    };
  }, []);

  const handleThemeChange = (e) => {
    const t = e.target.value;
    setTheme(t);
    localStorage.setItem("lms-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("LearningUser");
    setUser(null);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200 text-base-content"}`;

  return (
    <nav className="bg-base-100 shadow-md sticky top-0 z-50 border-b border-base-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LEFT */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FaGraduationCap className="text-primary text-3xl" />
          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-tight">learnify</h1>
            <p className="text-[10px] uppercase font-medium text-base-content/50 tracking-widest">Portal</p>
          </div>
         </div> 

      
        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <select
            className="select select-bordered select-sm hidden sm:block font-medium text-xs"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="light">LIGHT MODE</option>
            <option value="dark">DARK MODE</option>
          </select>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end leading-none">
                <span className="text-[14px] font-bold">{user.fullName}</span>
                <span className="text-[10px] uppercase font-black text-primary opacity-70">{user.role}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-error btn-sm btn-outline px-5 rounded-full font-black text-xs"
              >
                <FaSignOutAlt /> LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="btn btn-primary btn-sm px-8 rounded-full font-bold text-xs shadow-lg shadow-primary/20"
              >
                LOGIN
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn btn-primary btn-sm px-8 rounded-full font-bold text-xs shadow-lg shadow-primary/20"
              >
                REGISTER
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
