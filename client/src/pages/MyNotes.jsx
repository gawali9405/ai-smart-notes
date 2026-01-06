import React from "react";
import { useEffect, useState } from "react";
import { Download, Eye, Share2, Trash2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import api from "../lib/api";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [viewNote, setViewNote] = useState(null);

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
    filter === "All" ? notes : notes.filter((note) => note.status === filter);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  const handleDownload = (note) => {
    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(note.title, 10, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    const content = note.content.replace(/```json|```/g, "");
    const lines = pdf.splitTextToSize(content, 180);

    pdf.text(lines, 10, 35);

    pdf.save(`${note.title || "note"}.pdf`);
  };

  const handleShare = async (note) => {
    const pdf = new jsPDF();
    pdf.text(note.title, 10, 20);
    pdf.text(note.content, 10, 35);

    const blob = pdf.output("blob");
    const file = new File([blob], `${note.title}.pdf`, {
      type: "application/pdf",
    });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: note.title,
        files: [file],
      });
    } else {
      toast.error("File sharing not supported on this device");
    }
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
            <option
              key={status}
              value={status}
              className="bg-slate-900 text-white"
            >
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
                <button
                  onClick={() => setViewNote(note)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-indigo-300"
                >
                  <Eye size={16} /> View
                </button>

                <button
                  onClick={() => handleDownload(note)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-indigo-300"
                >
                  <Download size={16} /> PDF
                </button>

                <button
                  onClick={() => handleShare(note)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:border-indigo-300"
                >
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
      {viewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900 p-6 text-white">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{viewNote.title}</h2>
              <button
                onClick={() => setViewNote(null)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-white/5 p-4 text-sm leading-relaxed">
              <pre className="whitespace-pre-wrap font-sans">
                {viewNote.content.replace(/```json|```/g, "")}
              </pre>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => handleDownload(viewNote)}
                className="rounded-xl inline-flex items-center gap-2 border border-white/20 px-4 py-2 hover:border-indigo-300"
              >
                 <Download size={16} /> PDF
              </button>

              <button
                onClick={() => handleShare(viewNote)}
                className="rounded-xl inline-flex items-center gap-2 border border-white/20 px-4 py-2 hover:border-indigo-300"
              >
                <Share2 size={16} /> Share
              </button>

              <button
                onClick={() => setViewNote(null)}
                className="rounded-xl inline-flex items-center bg-blue-400 gap-2 border border-white/20 px-4 py-2 hover:border-indigo-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNotes;
