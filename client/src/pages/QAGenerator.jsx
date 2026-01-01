import React, { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import SectionTitle from "../components/SectionTitle";
import { difficultyLevels, questionTypes, qaPreview } from "../data/mockData";
import api from "../lib/api";

const MIN_NOTES_LENGTH = 20;

const QAGenerator = () => {
  const [selectedType, setSelectedType] = useState(questionTypes[0]);
  const [difficulty, setDifficulty] = useState(difficultyLevels[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [notesError, setNotesError] = useState("");
  const [qaResults, setQaResults] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  const normalizeOption = (option, index) => {
    if (typeof option === "string") {
      return { label: String.fromCharCode(65 + index), text: option };
    }

    if (option && typeof option === "object") {
      return {
        label:
          option.label ??
          option.key ??
          option.letter ??
          option.id ??
          String.fromCharCode(65 + index),
        text:
          option.text ??
          option.value ??
          option.content ??
          option.option ??
          option.answer ??
          "",
      };
    }

    return {
      label: String.fromCharCode(65 + index),
      text: String(option ?? ""),
    };
  };

  const handleGenerate = async () => {
    if (notesInput.trim().length < MIN_NOTES_LENGTH) {
      setNotesError(`Enter at least ${MIN_NOTES_LENGTH} characters of notes.`);
      return;
    }

    setNotesError("");
    setIsGenerating(true);
    setHasGenerated(true);

    try {
      const payload = {
        notes: notesInput.trim(),
        questionType: selectedType,
        difficulty,
      };

      const { data } = await api.post("/qa/generate", payload);
      const generatedItems = data?.data?.qa || [];
      setQaResults(generatedItems);

      if (generatedItems.length) {
        toast.success("Generated fresh questions ✨");
      } else {
        toast("AI couldn't craft questions from that input. Try adding more detail.");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to generate questions";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const results = qaResults.length ? qaResults : qaPreview;
  const showingSample = qaResults.length === 0;
  const noResultsAfterGenerate = hasGenerated && qaResults.length === 0;

  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="Auto Q&A"
        title="Generate exam-ready questions from any notes"
        description="Turn summaries into question sets for MCQ, short and long answers, with difficulty controls."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Input notes</p>
          <textarea
            rows={8}
            placeholder="Paste lecture summary or pick from generated notes..."
            value={notesInput}
            onChange={(event) => {
              setNotesInput(event.target.value);
              if (notesError) setNotesError("");
            }}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/40 p-4 text-sm text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
          />
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Minimum {MIN_NOTES_LENGTH} characters</span>
            <span>{notesInput.length} chars</span>
          </div>
          {notesError && <p className="text-sm text-rose-300">{notesError}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Question type</p>
              <div className="mt-3 grid gap-3">
                {questionTypes.map((type) => (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      selectedType === type
                        ? "border-indigo-400 bg-indigo-500/20"
                        : "border-white/10 bg-slate-900/50 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="questionType"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="accent-indigo-400"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Difficulty</p>
              <div className="mt-3 grid gap-3">
                {difficultyLevels.map((level) => (
                  <label
                    key={level}
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      difficulty === level
                        ? "border-indigo-400 bg-indigo-500/20"
                        : "border-white/10 bg-slate-900/50 hover:border-indigo-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                      className="accent-indigo-400"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {isGenerating ? "Generating..." : "Generate questions"}
          </button>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <SectionTitle
            eyebrow="Library"
            title="Saved note sets"
            description="Choose an existing lecture summary to convert."
          />
          <div className="mt-6 space-y-4 text-sm">
            {[
              "Neural Networks - Week 4",
              "Behavioral Economics - Seminar",
              "Modern Poetry - Guest lecture",
            ].map((item) => (
              <button
                key={item}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/40 px-4 py-3 text-left hover:border-indigo-300"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/70">
          <SectionTitle
            eyebrow="Results"
            title="Preview generated Q&A"
            description="Mix question types in one batch and export to PDF or Google Forms."
          />
          <span className="text-xs uppercase tracking-[0.3em]">
            {showingSample ? "Showing sample data" : "Showing AI results"}
          </span>
          <div className="flex gap-3">
            {["PDF", "Google Forms", "Anki"].map((exportOption) => (
              <button
                key={exportOption}
                className="rounded-full border border-white/15 px-4 py-2 text-white hover:border-indigo-300"
              >
                {exportOption}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {results.map((qa, cardIndex) => {
            const normalizedCorrect = qa.correctOption?.toString().trim().toLowerCase();

            return (
              <article
                key={qa.id || `qa-${cardIndex}`}
                className="glass-panel flex flex-col gap-3 rounded-3xl p-5 text-white"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em]">
                  <span className="text-white/60">{qa.type}</span>
                  <span className="text-indigo-200">{qa.difficulty}</span>
                </div>
                <h3 className="text-lg font-semibold">{qa.question}</h3>

                {Array.isArray(qa.options) && qa.options.length > 0 && (
                  <ul className="space-y-2 rounded-2xl bg-white/5 p-3 text-sm">
                    {qa.options.map((option, optionIndex) => {
                      const normalized = normalizeOption(option, optionIndex);
                      const optionKey = `${qa.id || cardIndex}-option-${optionIndex}`;
                      const isCorrect =
                        normalizedCorrect &&
                        (normalizedCorrect === normalized.label.toLowerCase() ||
                          normalizedCorrect === normalized.text.toLowerCase());

                      return (
                        <li
                          key={optionKey}
                          className={`flex items-start gap-2 rounded-xl border border-white/10 px-3 py-2 ${
                            isCorrect ? "border-emerald-300/60 bg-emerald-400/10" : ""
                          }`}
                        >
                          <span className="font-semibold text-white">{normalized.label}.</span>
                          <span className="text-white/80">{normalized.text}</span>
                          {isCorrect && (
                            <span className="ml-auto text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                              Correct
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <p className="text-sm text-white/70">{qa.answer}</p>
              </article>
            );
          })}
        </div>
        {noResultsAfterGenerate && (
          <p className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4 text-sm text-amber-200">
            We couldn't generate MCQs from the provided text. Add more detailed notes or clarify the
            subject matter, then try again.
          </p>
        )}
      </section>
    </div>
  );
};

export default QAGenerator;
