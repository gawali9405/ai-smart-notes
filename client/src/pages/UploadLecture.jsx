import React, { useRef, useState } from "react";
import { CheckCircle2, Link2, Loader2, RadioTower, UploadCloud, X } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { languages, summaryTypes, uploadOptions } from "../data/mockData";
import { toast } from "react-hot-toast";
import api from "../lib/api";

const SUMMARY_LABELS = {
  short: "Short",
  detailed: "Detailed",
  bullet: "Bullet points",
};

const UploadLecture = () => {
  const [activeOption, setActiveOption] = useState(uploadOptions[0].id);
  const [summaryType, setSummaryType] = useState(summaryTypes[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [title, setTitle] = useState("");
  const [textInput, setTextInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [generatedNote, setGeneratedNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const ACCEPTED_FILE_TYPES = {
    audio: ".mp3,.wav,.aac,.m4a",
    video: ".mp4,.mov,.m4v",
  };

  const MAX_TEXT_LENGTH = 4000;

  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptionChange = (optionId) => {
    setActiveOption(optionId);
    setErrors({});
    if (!["audio", "video"].includes(optionId)) {
      resetFileInput();
    }
  };

  const hydrateFileState = (nextFile) => {
    if (!nextFile) return;

    const isAudio = activeOption === "audio";
    const isVideo = activeOption === "video";

    if (isAudio && !nextFile.type.startsWith("audio/")) {
      setErrors((prev) => ({ ...prev, file: "Please choose an audio file." }));
      return;
    }

    if (isVideo && !nextFile.type.startsWith("video/")) {
      setErrors((prev) => ({ ...prev, file: "Please choose a video file." }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(nextFile);
  };

  const handleFileChange = (event) => {
    const [nextFile] = event.target.files || [];
    hydrateFileState(nextFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const [droppedFile] = event.dataTransfer.files || [];
    hydrateFileState(droppedFile);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (["audio", "video"].includes(activeOption) && !file) {
      nextErrors.file = `Upload a ${activeOption} file to continue.`;
    }

    if (activeOption === "text" && !textInput.trim()) {
      nextErrors.text = "Paste lecture content or transcript.";
    }

    if (activeOption === "youtube") {
      if (!youtubeUrl.trim()) {
        nextErrors.youtubeUrl = "Provide a YouTube link.";
      } else if (!/(youtube\.com|youtu\.be)/i.test(youtubeUrl.trim())) {
        nextErrors.youtubeUrl = "Add a valid YouTube URL.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    const formData = new FormData();

    formData.append("sourceType", activeOption);
    formData.append("summaryType", summaryType);
    formData.append("language", language);

    if (title.trim()) {
      formData.append("title", title.trim());
    }

    if (["audio", "video"].includes(activeOption) && file) {
      formData.append("file", file);
    }

    if (activeOption === "text") {
      formData.append("text", textInput.trim());
    }

    if (activeOption === "youtube") {
      formData.append("youtubeUrl", youtubeUrl.trim());
    }

    return formData;
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setGeneratedNote(null);

    if (!validateForm()) return;

    try {
      setIsGenerating(true);
      const payload = buildPayload();
      const { data } = await api.post("/notes/generate", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Notes generated successfully ✨");
      setGeneratedNote(data?.data?.note || null);

      if (activeOption === "text") setTextInput("");
      if (activeOption === "youtube") setYoutubeUrl("");
      if (["audio", "video"].includes(activeOption)) resetFileInput();
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to generate notes";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="Upload lecture"
        title="Send your lecture files to the AI lab"
        description="Choose from audio, video, text, or links. The AI auto-detects chapters and speaker context."
      />

      <form onSubmit={handleGenerate} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Upload options</p>
          <div className="grid gap-4 md:grid-cols-2">
            {uploadOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionChange(option.id)}
                className={`rounded-3xl border p-4 text-left ${
                  activeOption === option.id
                    ? "border-indigo-400 bg-indigo-500/20"
                    : "border-white/10 bg-slate-900/40 hover:border-indigo-300"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">{option.label}</p>
                <p className="mt-2 text-lg font-semibold">{option.description}</p>
                <p className="text-sm text-white/60">{option.sampleName}</p>
              </button>
            ))}
          </div>

          <div className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <label className="block text-xs uppercase tracking-[0.4em] text-white/50">
              Lecture title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Week 4 – Quantum Mechanics"
              maxLength={120}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/40 focus:border-indigo-300 focus:outline-none"
            />

            {["audio", "video"].includes(activeOption) && (
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed p-6 text-center transition ${
                  isDragging ? "border-indigo-400 bg-indigo-500/10" : "border-white/20 bg-slate-900/40"
                }`}
              >
                <UploadCloud className="mx-auto text-indigo-200" size={36} />
                <p className="mt-3 text-lg font-semibold">
                  {file ? "File ready to upload" : "Drop your lecture file here"}
                </p>
                <p className="text-sm text-white/60">
                  {activeOption === "audio"
                    ? "Supports MP3, WAV, AAC, M4A"
                    : "Supports MP4, MOV, M4V up to 3GB"}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-white hover:border-indigo-300"
                  >
                    Browse files
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={resetFileInput}
                      className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES[activeOption]}
                  className="hidden"
                  onChange={handleFileChange}
                />

                {file && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm">
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-white/60">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
                {errors.file && <p className="mt-3 text-sm text-rose-300">{errors.file}</p>}
              </div>
            )}

            {activeOption === "text" && (
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                  <span>Paste transcript</span>
                  <span className="text-white/40">
                    {textInput.length}/{MAX_TEXT_LENGTH}
                  </span>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value.slice(0, MAX_TEXT_LENGTH))}
                  rows={6}
                  placeholder="Drop your transcript, bullet outline, or raw lecture notes here..."
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-indigo-300 focus:outline-none"
                />
                {errors.text && <p className="mt-2 text-sm text-rose-300">{errors.text}</p>}
              </div>
            )}

            {activeOption === "youtube" && (
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/50">
                  <Link2 size={14} />
                  YouTube link
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtu.be/abcdef12345"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-white/40 focus:border-indigo-300 focus:outline-none"
                />
                <p className="mt-2 text-xs text-white/50">Supports public or unlisted videos.</p>
                {errors.youtubeUrl && <p className="mt-2 text-sm text-rose-300">{errors.youtubeUrl}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Language</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white focus:border-indigo-300 focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-white">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Summary type</p>
            <div className="mt-3 grid gap-3">
              {summaryTypes.map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    summaryType === type
                      ? "border-indigo-400 bg-indigo-500/20"
                      : "border-white/10 bg-slate-900/50 hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="summaryType"
                    checked={summaryType === type}
                    onChange={() => setSummaryType(type)}
                    className="accent-indigo-400"
                  />
                  {SUMMARY_LABELS[type] || type}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Status</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {isGenerating ? "Processing…" : "Queue ready"}
            </p>
            <p className="text-sm text-white/60">
              {isGenerating ? "Extracting content and generating notes" : "Average completion: 2 mins"}
            </p>
            <div className="mt-4 grid gap-3 text-sm">
              {[
                "Speaker diarization enabled",
                "Slide recognition active",
                "Terminology matching on",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-emerald-300">
                  <RadioTower size={14} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </span>
            ) : (
              "Generate notes"
            )}
          </button>

          {generatedNote && (
            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 size={18} />
                <span>Notes ready from your {generatedNote.sourceType} upload</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{generatedNote.title}</p>
              <p className="mt-2 text-sm text-white/70 whitespace-pre-line">
                {generatedNote.content?.slice(0, 400)}
                {generatedNote.content?.length > 400 ? "…" : ""}
              </p>
              {generatedNote.keyPoints?.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/70">
                  {generatedNote.keyPoints.slice(0, 3).map((point, index) => (
                    <li key={`${point}-${index}`}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </form>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
        <SectionTitle
          eyebrow="Processing pipeline"
          title="What happens after upload?"
          description="The orchestrator runs audio extraction, transcription, slide parsing, and summary generation."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            {
              title: "Ingest",
              description: "Remove noise, detect segments, and align slides to timestamps.",
              icon: "upload",
            },
            {
              title: "Understand",
              description: "Topic clustering, glossary detection, and key frame extraction.",
              icon: "spark",
            },
            {
              title: "Summarize",
              description: "Short, detailed, and bullet modes created at once.",
              icon: "book",
            },
            {
              title: "Distribute",
              description: "Notes ready for community sharing, PDF export, or LMS sync.",
              icon: "community",
            },
          ].map((phase) => (
            <article
              key={phase.title}
              className="glass-panel flex flex-col gap-4 rounded-3xl p-5 text-white"
            >
              <IconBadge icon={phase.icon} />
              <div>
                <h3 className="text-lg font-semibold">{phase.title}</h3>
                <p className="text-sm text-white/70">{phase.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UploadLecture;
