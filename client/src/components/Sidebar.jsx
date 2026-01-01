import { GraduationCap } from "lucide-react";
import { NavLink } from "react-router-dom";
import IconBadge from "./IconBadge";
import React from "react";

const resolvePath = (id) => {
  if (id === "dashboard") return "/dashboard";
  if (id === "my-notes") return "/my-notes";
  return `/${id}`;
};

const Sidebar = ({ items = [] }) => {
  return (
    <aside className="glass-panel hidden w-72 flex-col rounded-e-3xl bg-slate-900/70 p-6 text-slate-100 lg:flex">
      <div className="flex items-center gap-3 pb-6">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-indigo-500/30 text-indigo-200">
          <GraduationCap />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">
            Smart Notes
          </p>
          <h2 className="text-lg font-semibold text-white">Lecture Lab</h2>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={resolvePath(item.id)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-white/10 text-white shadow-lg shadow-indigo-600/20"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            <IconBadge icon={item.icon} size={18} className="size-10" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
          Tip
        </p>
        <p className="mt-3 text-sm text-white/80">
          Upload lectures in batches to unlock lightning summaries & curated
          flashcards.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
