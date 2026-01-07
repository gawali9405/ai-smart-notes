import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, X, Loader2, Sparkles, Share2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { getCommunityNotes } from "../services/community.service";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { communityNotes as dummyNotes } from "../data/mockData";

const CommunityNotes = () => {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);
  const [error, setError] = useState(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const data = await getCommunityNotes(subjectFilter);

        if (data && data.length > 0) {
          setNotes(data);
          setIsUsingDummyData(false);
        } else if (!hasMounted.current) {
          // Only show dummy data on first load if no real data is available
          setNotes(dummyNotes);
          setIsUsingDummyData(true);
        }
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError("Failed to load community notes. Using sample data instead.");
        setNotes(dummyNotes);
        setIsUsingDummyData(true);
      } finally {
        setIsLoading(false);
        hasMounted.current = true;
      }
    };

    fetchNotes();
  }, [subjectFilter]);

  const handleSubjectChange = (newSubject) => {
    setSubjectFilter(newSubject);
  };

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
          onChange={(e) => handleSubjectChange(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-indigo-300 focus:outline-none"
        >
          <option value="All" className="bg-slate-900">
            All subjects
          </option>
          {[...new Set(notes.map((note) => note.subject).filter(Boolean))].map(
            (subject) => (
              <option key={subject} value={subject} className="bg-slate-900">
                {subject}
              </option>
            )
          )}
        </select>
        <button className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
          Most liked
        </button>
        <button className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white hover:border-indigo-300">
          Trending
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 px-6 rounded-xl bg-amber-900/20 text-amber-200 max-w-2xl mx-auto"
          >
            {error}{" "}
            {isUsingDummyData &&
              "(Showing sample data for demonstration purposes.)"}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {notes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 text-center py-12 text-gray-400"
              >
                No notes found. Be the first to share your notes!
              </motion.div>
            ) : (
              notes.map((note, index) => (
                <motion.article
                  key={note._id || note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`glass-panel flex flex-col gap-4 rounded-[2.5rem] p-6 relative overflow-hidden ${
                    isUsingDummyData
                      ? "border-2 border-dashed border-amber-500/30"
                      : ""
                  }`}
                >
                  {isUsingDummyData && (
                    <div className="absolute top-4 right-4 bg-amber-500/90 text-amber-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>Sample</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/60">
                    <IconBadge icon="book" size={18} className="size-10" />
                    {note.subject}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {note.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {note.content || note.overview}
                    </p>
                  </div>
                  <p className="text-sm text-white/60">
                    By {note.user?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className="inline-flex items-center gap-2 cursor-pointer">
                      <Heart size={16} className="text-rose-300" />{" "}
                      {note.likes?.length || 120}
                    </span>
                    <span className="inline-flex items-center gap-2 cursor-pointer">
                      <MessageCircle size={16} className="text-emerald-300" />{" "}
                      {note.comments?.length || 40}
                    </span>
                    <span className="inline-flex items-center gap-2 cursor-pointer">
                      <Share2 size={16} className="text-emerald-300" />{" "}
                      {note.shares?.length || 542}
                    </span>
                    <button
                      className="ms-auto rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:border-indigo-300"
                      onClick={() => setSelectedNote(note)}
                    >
                      View full note
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedNote && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-md p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  {selectedNote.subject}
                </p>
                <h3 className="text-3xl font-semibold">{selectedNote.title}</h3>
                <p className="text-sm text-white/60">
                  By {selectedNote.author}
                </p>
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
                {selectedNote.overview} Dive deeper into concepts, case studies,
                and curated references contributed by the community.
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
