import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Upload, Workflow } from "lucide-react";
import {
  featureCards,
  progressStats,
  recentSummaries,
  uploadOptions,
} from "../data/mockData";
import SectionTitle from "../components/SectionTitle";
import IconBadge from "../components/IconBadge";
import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2.5rem] bg-slate-900/60 p-8 text-white">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 space-y-4">
            <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-indigo-200">
              <Workflow size={16} />
              Unified AI pipeline
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Welcome back! Your lecture lab is warmed up.
            </h1>
            <p className="text-white/70">
              Resume unfinished summaries, upload new lectures, or jump straight into Q&A mode.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Upload lecture
                <Upload size={16} />
              </Link>
              <Link
                to="/qa"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-indigo-300"
              >
                Generate Q&A
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Pipeline status</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Summaries rendering", value: "3 in queue" },
                { label: "Slides processing", value: "2 decks" },
                { label: "Community uploads", value: "18 today" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{item.label}</span>
                  <span className="text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-200" />
                Average turnaround
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">2m 40s / lecture</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Progress"
          title="Your weekly pulse"
          description="Track generated notes, lecture uploads, and question packs."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {progressStats.map((stat) => (
            <article
              key={stat.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-emerald-300">{stat.change}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
          <div className="flex items-center justify-between">
            <SectionTitle
              eyebrow="Recent"
              title="Summaries timeline"
              description="Keep tabs on the latest lecture digests."
            />
            <Link to="/my-notes" className="text-sm text-indigo-200 hover:text-white">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recentSummaries.map((summary) => (
              <div
                key={summary.id}
                className="flex flex-wrap gap-4 rounded-3xl border border-white/10 bg-slate-900/40 p-5"
              >
                <div className="flex-1">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                    {summary.course}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">{summary.snippet}</p>
                </div>
                <div className="text-sm text-white/70">
                  <p>{summary.timeAgo}</p>
                  <p className="text-indigo-200">{summary.status}</p>
                  <p>{summary.tone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white">
          <SectionTitle
            eyebrow="Quick upload"
            title="Drop a lecture"
            description="Pick the format that fits your source."
          />
          <div className="mt-6 space-y-4">
            {uploadOptions.map((option) => (
              <button
                key={option.id}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/60 p-4 text-left transition hover:border-indigo-300"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-white/50">{option.label}</p>
                <p className="mt-2 text-base font-semibold">{option.description}</p>
                <p className="text-sm text-white/60">{option.sampleName}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          eyebrow="Workflows"
          title="Choose the right AI path"
          description="Single-click flows tuned for each study milestone."
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="glass-panel flex items-start gap-4 rounded-[2rem] p-5 text-white"
            >
              <IconBadge icon={card.icon} />
              <div>
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-white/70">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
