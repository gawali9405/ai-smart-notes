import { useState } from "react";
import { Bookmark, Heart, MessageCircle, X } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { communityNotes, subjects } from "../data/mockData";
import React from "react";

const CommunityNotes = () => {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [selectedNote, setSelectedNote] = useState(null);

  const filteredNotes =
    subjectFilter === "All"
      ? communityNotes
      : communityNotes.filter((note) => note.subject === subjectFilter);

  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="Community"
        title="Explore public study vaults"
        description="Browse curated notes, remix them, and share your insights."
      />

      <div className="flex flex-wrap gap-4">
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-indigo-300 focus:outline-none"
        >
          <option value="All" className="bg-slate-900">
            All subjects
          </option>
          {subjects.map((subject) => (
            <option key={subject} value={subject} className="bg-slate-900">
              {subject}
            </option>
          ))}
        </select>
        <button className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
          Most liked
        </button>
        <button className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
          Trending
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredNotes.map((note) => (
          <article
            key={note.id}
            className="glass-panel flex flex-col gap-4 rounded-[2.5rem] p-6"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
              <IconBadge icon="book" size={18} className="size-10" />
              {note.subject}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">{note.title}</h3>
              <p className="text-sm text-white/70">{note.overview}</p>
            </div>
            <p className="text-sm text-white/60">By {note.author}</p>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <Heart size={16} className="text-rose-300" /> {note.likes}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={16} className="text-emerald-300" /> {note.comments}
              </span>
              <span className="inline-flex items-center gap-2">
                <Bookmark size={16} className="text-indigo-300" /> {note.bookmarks}
              </span>
              <button
                className="ms-auto rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:border-indigo-300"
                onClick={() => setSelectedNote(note)}
              >
                View full note
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedNote && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  {selectedNote.subject}
                </p>
                <h3 className="text-3xl font-semibold">{selectedNote.title}</h3>
                <p className="text-sm text-white/60">By {selectedNote.author}</p>
              </div>
              <button
                className="rounded-full border border-white/10 p-2 text-white/70 hover:border-rose-300 hover:text-white"
                onClick={() => setSelectedNote(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm text-white/80">
              <p>
                {selectedNote.overview} Dive deeper into concepts, case studies, and curated
                references contributed by the community.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Key concept breakdowns with definitions and analogies.</li>
                <li>Annotated diagrams and slide snapshots.</li>
                <li>Embedded quiz prompts matched to sections.</li>
                <li>Group highlights and peer comments.</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {["Like", "Comment", "Bookmark", "Share"].map((action) => (
                <button
                  key={action}
                  className="rounded-full border border-white/15 px-4 py-2 text-white/80 hover:border-indigo-300"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityNotes;
