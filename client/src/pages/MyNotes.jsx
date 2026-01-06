import React from "react";
import { useEffect, useState } from "react";
import { Download, Edit3, Share2, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import api from "../lib/api";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get("/notes");
        setNotes(data.notes || []);
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes =
    filter === "All"
      ? notes
      : notes.filter((note) => note.status === filter);

  const handleDelete = (id) => {
    // UI only (no backend delete yet)
    setNotes((prev) => prev.filter((note) => note._id !== id));
  };

  if (loading) {
    return <p className="text-white">Loading notes...</p>;
  }

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
      </div>

      {notes.length === 0 ? (
        <p className="text-white/60">No notes saved yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredNotes.map((note) => (
            <article
              key={note._id}
              className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                    {note.sourceType || "NOTE"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {note.title}
                  </h3>
                  <p className="text-sm text-white/60">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                  #{note._id.slice(-6)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-indigo-300">
                  <Edit3 size={16} /> Edit
                </button>

                <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-indigo-300">
                  <Download size={16} /> PDF
                </button>

                <button className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-indigo-300">
                  <Share2 size={16} /> Share
                </button>

                <button
                  onClick={() => handleDelete(note._id)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 px-4 py-2 text-sm text-rose-200 hover:border-rose-300"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotes;
