import SectionTitle from "../components/SectionTitle";
import React from "react";

const toggles = [
  { id: "email-alerts", label: "Email alerts", description: "Get notified when new summaries finish." },
  { id: "community-share", label: "Auto-share to community", description: "Publish notes after manual review." },
  { id: "dark-mode", label: "Default to dark mode", description: "Start every session in dark theme." },
];

const Settings = () => {
  return (
    <div className="space-y-8 text-white">
      <SectionTitle
        eyebrow="Settings"
        title="Customize your lecture lab"
        description="Manage integrations, preferences, and AI usage."
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Preferences</p>
          <div className="mt-4 space-y-4">
            {toggles.map((toggle) => (
              <label key={toggle.id} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-slate-900/40 p-4">
                <input type="checkbox" defaultChecked className="mt-1 size-5 accent-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{toggle.label}</p>
                  <p className="text-sm text-white/60">{toggle.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Integrations</p>
          <div className="mt-4 space-y-4">
            {[
              { label: "Canvas LMS", status: "Connected" },
              { label: "Google Drive", status: "Ready to connect" },
              { label: "Notion Workspace", status: "Connected" },
            ].map((integration) => (
              <div key={integration.label} className="flex items-center justify-between rounded-3xl border border-white/10 bg-slate-900/40 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{integration.label}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{integration.status}</p>
                </div>
                <button className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:border-indigo-300">
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Usage</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { label: "AI minutes", value: "480 / 600", helper: "Reset in 3 days" },
            { label: "Slides processed", value: "82 decks", helper: "+12 this week" },
            { label: "Q&A generated", value: "640 prompts", helper: "Premium tier unlocked" },
          ].map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-900/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
              <p className="text-sm text-indigo-200">{metric.helper}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;
