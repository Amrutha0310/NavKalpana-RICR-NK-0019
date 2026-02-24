import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

const SidebarLayout = () => {
  return (
    <div className="flex bg-base-200 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;