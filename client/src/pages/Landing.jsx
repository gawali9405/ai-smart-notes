import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  ArrowRight,
  CheckCircle2,
  CloudUpload,
  PenSquare,
  Shield,
  Sparkles,
  TimerReset,
  Users,
} from "lucide-react";
import DarkModeToggle from "../components/DarkModeToggle";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import { featureCards } from "../data/mockData";

const Landing = ({ isDark, onToggleTheme }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleUploadClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: '/upload' } });
    }
  };
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3 text-indigo-100">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200">
            <Sparkles />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-200/80">
              SmartGenius
            </p>
            <h1 className="text-xl font-semibold text-white">AI Lecture Lab</h1>
          </div>
        </Link>
        <nav className="hidden gap-6 text-sm text-indigo-100/80 md:flex">
          {["Features", "Workflow", "Community"].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <DarkModeToggle enabled={isDark} onToggle={onToggleTheme} />
          <Link
            to="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-indigo-400"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:translate-y-0.5 sm:inline-flex"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-indigo-200">
              <Sparkles size={14} />
              AI-Powered Learning Suite
            </p>
            <h2 className="text-5xl font-semibold leading-tight text-white">
              Turn Lectures into <span className="text-indigo-300">Smart Notes</span> using AI
            </h2>
            <p className="text-lg text-white/70">
              Summarize lectures, convert slides to notes, auto-generate questions & answers, and
              share with a community of focused learners.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Get Started
                <ArrowRight className="transition group-hover:translate-x-1" size={18} />
              </Link>
              <Link
                to={isAuthenticated ? "/upload" : "#"}
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-indigo-300"
              >
                Upload Lecture
                <CloudUpload size={18} />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Lectures Summarized", value: "42K+" },
                { label: "Questions Generated", value: "1.2M+" },
                { label: "Community Notes", value: "8.7K" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel rounded-[2.5rem] p-8">
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Live Summary</span>
                  <span className="inline-flex items-center gap-2 text-xs text-emerald-300">
                    <TimerReset size={16} />
                    0.9x realtime
                  </span>
                </div>
                <div className="mt-6 space-y-3 text-sm text-white/80">
                  {[
                    "Parsing lecture audio...",
                    "Detecting slide transitions...",
                    "Extracting core arguments...",
                    "Generating quiz-ready prompts...",
                  ].map((step, idx) => (
                    <p key={step} className="flex items-center gap-3">
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs text-indigo-200">
                        {idx + 1}
                      </span>
                      {step}
                    </p>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Generated Notes</p>
                  <p className="mt-3 text-sm leading-relaxed text-white">
                    Neural networks rely on stacked perceptrons. Each layer captures richer pattern
                    recognition by composing activations from previous layers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-32 space-y-10">
          <SectionTitle
            eyebrow="Capabilities"
            title="Everything you need to conquer lecture overload"
            description="Mix and match AI workflows tailored for lecture, slide, and study note formats."
            align="center"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="glass-panel flex gap-4 rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <IconBadge icon={card.icon} />
                <div>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-24 grid gap-8 rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-10 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionTitle
              eyebrow="Workflow"
              title="Upload once, learn faster"
              description="Smart Notes Generator orchestrates speech-to-text, slide parsing, concept clustering, and Q&A generation in a single flow."
            />
            <div className="space-y-4">
              {[
                {
                  title: "Upload & detect context",
                  description: "Audio, video, slides, or transcripts — the system classifies content in seconds.",
                  icon: "upload",
                },
                {
                  title: "Summarize & enrich",
                  description:
                    "AI extracts lecture beats, adds references, and builds memory anchors using spaced repetition cues.",
                  icon: "spark",
                },
                {
                  title: "Generate study kit",
                  description:
                    "Auto-build flashcards, quizzes, and share-ready notes with canonical formatting.",
                  icon: "book",
                },
              ].map((step) => (
                <div key={step.title} className="flex items-start gap-4 rounded-3xl border border-white/5 bg-white/5 p-4">
                  <IconBadge icon={step.icon} />
                  <div>
                    <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                    <p className="text-sm text-white/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
              <div className="flex items-center gap-3 text-sm text-emerald-200">
                <Shield size={18} />
                Secure campus-grade processing
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">FERPA-ready & SOC2 aligned</p>
              <p className="mt-2 text-sm text-white/80">
                Your notes stay encrypted. Share only when you decide.
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Integrations</p>
              <p className="mt-3 text-3xl font-semibold text-white">Slides, Moodle, Canvas</p>
              <p className="mt-2 text-sm text-white/70">
                Import slides and transcripts directly from your LMS. Sync with Notion or Obsidian.
              </p>
              <div className="mt-6 flex gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <PenSquare size={16} />
                  Notes-ready
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <CheckCircle2 size={16} />
                  QA verified
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                  <Users size={16} />
                  Team spaces
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="community" className="mt-28 space-y-10">
          <SectionTitle
            eyebrow="Community"
            title="Join global study circles"
            description="Share notes, gather feedback, and discover curated lecture summaries across disciplines."
            align="center"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Subject-focused feeds",
                description: "Browse trending Physics, CS, Medicine, or Business decks.",
              },
              {
                title: "Collaborative editing",
                description: "Co-edit with classmates, add highlights, and remix references.",
              },
              {
                title: "Rewarded sharing",
                description: "Earn badges for contributions and unlock premium AI minutes.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-3xl p-6">
                <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                <p className="mt-2 text-sm text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2.5rem] border border-white/10 bg-white/5 px-10 py-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Ready when you are</p>
              <p className="mt-3 text-3xl font-semibold text-white">Upload your next lecture</p>
              <p className="mt-2 text-sm text-white/70">
                Start free. No credit card required. Switch between lecture types anytime.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to={isAuthenticated ? "/upload" : "#"}
                onClick={handleUploadClick}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Upload lecture
              </Link>
              <Link
                to="/register"
                className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-indigo-300"
              >
                Explore dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} Smart Notes Generator · 
      </footer>
    </div>
  );
};

export default Landing;
