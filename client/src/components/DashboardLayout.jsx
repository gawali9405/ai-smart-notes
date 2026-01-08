import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Search, Sparkles, User, LogOut, Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import DarkModeToggle from "./DarkModeToggle";
import MobileNav from "./MobileNav";
import { navItems } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const DashboardLayout = ({ isDark, onToggleTheme }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent transition-colors duration-500">
      <Sidebar items={navItems} />

      <section className="flex-1 px-4 py-6 sm:px-8">
        <header className="glass-panel flex flex-wrap items-center gap-4 rounded-3xl px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Sparkles className="text-indigo-300" size={18} />
            <span>AI status: All systems stable</span>
          </div>

          <div className="ms-auto flex flex-wrap items-center gap-3">
            {/* Search */}
            <label className="relative hidden md:block">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="search"
                placeholder="Search notes, lectures..."
                className="rounded-full bg-white/5 pl-12 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
              />
            </label>

            <DarkModeToggle enabled={isDark} onToggle={onToggleTheme} />

            {/* Profile Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Open profile menu"
                className="rounded-2xl border border-white/10 bg-white/10 p-2 text-white/80 transition hover:scale-105 hover:text-white"
              >
                <User size={18} />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-slate-900/90 p-2 backdrop-blur-lg shadow-xl">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    <User size={16} /> Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    <Settings size={16} /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-300 hover:bg-rose-400/10"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/upload"
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:translate-y-0.5"
            >
              New Upload
            </Link>
          </div>

          <MobileNav items={navItems} />
        </header>

        <main className="mt-6 space-y-6">
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
