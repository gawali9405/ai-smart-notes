import React from "react";
import SectionTitle from "./SectionTitle";
import IconBadge from "./IconBadge";

const ProcessingPipeline = () => {
  return (
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
            description:
              "Remove noise, detect segments, and align slides to timestamps.",
            icon: "upload",
          },
          {
            title: "Understand",
            description:
              "Topic clustering, glossary detection, and key frame extraction.",
            icon: "spark",
          },
          {
            title: "Summarize",
            description:
              "Short, detailed, and bullet modes created at once.",
            icon: "book",
          },
          {
            title: "Distribute",
            description:
              "Notes ready for community sharing, PDF export, or LMS sync.",
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
              <p className="text-sm text-white/70">
                {phase.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProcessingPipeline;
