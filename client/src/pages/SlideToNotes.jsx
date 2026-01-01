import { useState } from "react";
import { Eye, Loader2, Presentation, Upload } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { slidePreviews } from "../data/mockData";
import React from "react";

const SlideToNotes = () => {
  const [selectedSlide, setSelectedSlide] = useState(slidePreviews[0]);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = () => {
    setIsConverting(true);
    setTimeout(() => setIsConverting(false), 2000);
  };

  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="Slides to notes"
        title="Transform decks into structured notes"
        description="Upload PPT or PDF decks, preview slides, and convert them into study-ready notes."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Slide previews</p>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400">
              <Upload size={16} />
              Upload PPT/PDF
            </button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {slidePreviews.map((slide) => (
              <button
                key={slide.id}
                onClick={() => setSelectedSlide(slide)}
                className={`rounded-3xl border p-4 text-left ${
                  selectedSlide.id === slide.id
                    ? "border-indigo-400 bg-indigo-500/20"
                    : "border-white/10 bg-slate-900/40 hover:border-indigo-300"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{slide.status}</p>
                <p className="mt-2 text-sm font-semibold">{slide.title}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-[2rem] border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Slide {selectedSlide.id}</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center">
                <Presentation size={64} className="mx-auto text-indigo-200" />
                <p className="mt-4 text-lg font-semibold">{selectedSlide.title}</p>
                <p className="text-sm text-white/50">High-res preview available</p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-300">
                  <Eye size={16} />
                  View original slide
                </button>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Structured notes</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  Key ideas extracted from slide {selectedSlide.id}
                </p>
                <ul className="mt-4 list-disc space-y-2 text-sm text-white/70">
                  <li>Detect bullet hierarchy and convert to nested notes automatically.</li>
                  <li>Identify figures, diagrams, and annotate them with captions.</li>
                  <li>Extract citations and bibliography references.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Conversion options</p>
          <div className="grid gap-4">
            {[
              {
                title: "Outline mode",
                description: "Capture slide headings and convert to study outline.",
                icon: "spark",
              },
              {
                title: "Narrative mode",
                description: "Expand slides into paragraphs with context.",
                icon: "book",
              },
              {
                title: "Flashcard mode",
                description: "Build question-answer pairs for spaced repetition.",
                icon: "qa",
              },
            ].map((mode) => (
              <label key={mode.title} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-slate-900/50 p-4">
                <input type="checkbox" className="mt-1 accent-indigo-400" defaultChecked />
                <div>
                  <p className="text-sm font-semibold text-white">{mode.title}</p>
                  <p className="text-sm text-white/60">{mode.description}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleConvert}
            className="w-full rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-70"
            disabled={isConverting}
          >
            {isConverting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} /> Converting...
              </span>
            ) : (
              "Convert to notes"
            )}
          </button>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Output format</p>
            <div className="mt-4 grid gap-3 text-sm">
              {["PDF deck", "Notion doc", "Markdown export"].map((format) => (
                <div key={format} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span>{format}</span>
                  <IconBadge icon="bookmark" size={16} className="size-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideToNotes;
