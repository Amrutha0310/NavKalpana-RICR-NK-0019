import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

const SidebarLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-[calc(100vh-57px)] overflow-hidden">
            {/* Desktop Sidebar — hidden below lg */}
            <div className="hidden lg:block shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-base-200/30 relative">
                {/* Mobile Header */}
                <div className="sticky top-0 z-30 lg:hidden bg-base-100 border-b border-base-300 px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="btn btn-ghost btn-sm btn-square"
                    >
                        {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                    </button>
                    <span className="text-sm font-bold text-base-content/60 uppercase tracking-widest">
                        Menu
                    </span>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

export default SidebarLayout;
