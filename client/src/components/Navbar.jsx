import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaEnvelope,
  FaGraduationCap,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);

  /* THEME */
  useEffect(() => {
    const savedTheme = localStorage.getItem("lms-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const t = e.target.value;
    setTheme(t);
    localStorage.setItem("lms-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  /* ACTIVE LINK */
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
     ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"}`;

  return (
    <nav className="bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* LEFT */}

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <FaGraduationCap className="text-blue-500 text-2xl" />
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-white">Learnify</h1>
            <p className="text-[10px] text-gray-400">Student LMS</p>
          </div>
        </div>

        {/* CENTER */}
        <ul className="hidden md:flex gap-3">
          <NavLink to="/home" className={linkClass}>
            <FaHome /> Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <FaBookOpen /> About
          </NavLink>
          <NavLink to="/courses" className={linkClass}>
            <FaBookOpen /> Courses
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            <FaEnvelope /> Contact Us
          </NavLink>
        </ul>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* THEME */}
          <select
            className="select select-bordered select-sm hidden sm:block"
            value={theme}
            onChange={handleThemeChange}
          >
            <option>--Theme</option>
            <option value="light">Light</option>{" "}
            <option value="dark">Dark</option>{" "}
            <option value="claude">Claude</option>{" "}
            <option value="spotify">Spotify</option>{" "}
            <option value="vscode">VSCode</option>{" "}
            <option value="black">Black</option>{" "}
            <option value="corporate">Corporate</option>{" "}
            <option value="ghibli">Ghibli</option>{" "}
            <option value="gourmet">Gourmet</option>{" "}
            <option value="luxury">Luxury</option>{" "}
            <option value="mintlify">Mintlify</option>{" "}
            <option value="pastel">Pastel</option>{" "}
            <option value="perplexity">Perplexity</option>{" "}
            <option value="shadcn">Shadcn</option>{" "}
            <option value="slack">Slack</option>{" "}
            <option value="soft">Soft</option>{" "}
            <option value="valorant">Valorant</option>
          </select>

          {/* LOGIN / REGISTER */}
          <button
            onClick={() => navigate("/login")}
            className="btn btn-outline btn-sm flex items-center gap-2"
          >
            <FaSignInAlt /> Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            <FaUserPlus /> Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
