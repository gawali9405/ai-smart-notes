import { useState } from "react";
import { Download, Edit3, Share2, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import { myNotes } from "../data/mockData";
import React from "react";

const MyNotes = () => {
  const [notes, setNotes] = useState(myNotes);
  const [filter, setFilter] = useState("All");

  const filteredNotes =
    filter === "All" ? notes : notes.filter((note) => note.status === filter);

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="My notes"
        title="Your personal knowledge base"
        description="Edit, export, or share notes to the community with a single click."
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-indigo-300 focus:outline-none"
        >
          {["All", "Draft", "Ready", "Shared"].map((status) => (
            <option key={status} value={status} className="bg-slate-900 text-white">
              {status}
            </option>
          ))}
        </select>
        <button className="rounded-2xl border border-white/15 px-4 py-2 text-white hover:border-indigo-300">
          Sync with cloud
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredNotes.map((note) => (
          <article key={note.id} className="glass-panel rounded-[2.5rem] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">{note.status}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{note.title}</h3>
                <p className="text-sm text-white/60">{note.updated}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                #{note.id}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
                <Edit3 size={16} />
                Edit
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
                <Download size={16} />
                PDF
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
                <Share2 size={16} />
                Share
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-200 hover:border-rose-300"
                onClick={() => handleDelete(note.id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MyNotes;
