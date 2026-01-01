import { Moon, Sun } from "lucide-react";
import React from "react";

const DarkModeToggle = ({ enabled, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-indigo-400 hover:text-white"
    aria-pressed={enabled}
  >
    {enabled ? (
      <>
        <Sun size={18} className="text-amber-300 transition group-hover:rotate-6" />
        Light
      </>
    ) : (
      <>
        <Moon size={18} className="text-indigo-300 transition group-hover:-rotate-6" />
        Dark
      </>
    )}
  </button>
);

export default DarkModeToggle;
