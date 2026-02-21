import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const NavBar = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

   const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("chit-chatTheme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("chit-chatTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  return (
    <nav className="bg-primary px-6 py-3 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        <h1 className="text-2xl font-extrabold tracking-wide cursor-pointer">
          Student-Learning & Progress
        </h1>

        
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <span className="cursor-pointer hover:text-secondary transition">
            Home
          </span>
          <span className="cursor-pointer hover:text-secondary transition">
            About
          </span>
        </div>

        
        <div className="flex items-center gap-3">
          <button
            className="btn btn-secondary btn-sm px-5"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

         

          <select
            className="select select-bordered select-sm min-w-32.5"
            onChange={handleThemeChange}
            value={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="claude">Claude</option>
            <option value="spotify">Spotify</option>
            <option value="vscode">VSCode</option>
            <option value="black">Black</option>
            <option value="corporate">Corporate</option>
            <option value="ghibli">Ghibli</option>
            <option value="gourmet">Gourmet</option>
            <option value="luxury">Luxury</option>
            <option value="mintlify">Mintlify</option>
            <option value="pastel">Pastel</option>
            <option value="perplexity">Perplexity</option>
            <option value="shadcn">Shadcn</option>
            <option value="slack">Slack</option>
            <option value="soft">Soft</option>
            <option value="valorant">Valorant</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;