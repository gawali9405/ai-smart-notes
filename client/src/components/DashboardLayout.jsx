import { Link, Outlet } from "react-router-dom";
import { Bell, Search, Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";
import DarkModeToggle from "./DarkModeToggle";
import MobileNav from "./MobileNav";
import { navItems } from "../data/mockData";
import React from "react";

const DashboardLayout = ({ isDark, onToggleTheme }) => {
  return (
    <div
      className={`flex min-h-screen bg-gradient-to-br ${
        isDark
          ? "from-slate-950 via-slate-900 to-indigo-950 text-slate-100"
          : "from-slate-50 via-white to-indigo-50 text-slate-900"
      } transition-colors duration-500`}
    >
      <Sidebar items={navItems} />
      <section className="flex-1 px-4 py-6 sm:px-8">
        <header className="glass-panel flex flex-wrap items-center gap-4 rounded-3xl px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Sparkles className="text-indigo-300" size={18} />
            <span>AI status: All systems stable</span>
          </div>
          <div className="ms-auto flex flex-wrap items-center gap-3">
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
            <button className="rounded-2xl border border-white/10 bg-white/10 p-2 text-white/80 transition hover:scale-105 hover:text-white">
              <Bell size={18} />
            </button>
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
