import React from "react";
import { Radar, Sparkles, Target, BookOpen, LineChart, Languages } from "lucide-react";

const features = [
  {
    icon: Radar,
    title: "Weakness radar",
    body: "Concept-level accuracy is tracked across every attempt, so gaps surface as a ranked list — not a vague feeling of being bad at maths.",
  },
  {
    icon: Target,
    title: "Practice that adapts",
    body: "Questions are generated for your class, board and chosen chapter, then calibrated as your accuracy changes.",
  },
  {
    icon: Sparkles,
    title: "Explanations that teach",
    body: "After every set, a tutor summary names the exact step you missed and gives three concrete next actions.",
  },
  {
    icon: BookOpen,
    title: "Mapped to your syllabus",
    body: "CBSE and State Board chapter lists for Classes 6 to 12 — no material from outside your course.",
  },
  {
    icon: LineChart,
    title: "Progress you can show",
    body: "Mastery per chapter, score trend over time, and a clear record you can take to a parent or teacher.",
  },
  {
    icon: Languages,
    title: "Your language",
    body: "Study preferences in English, Hindi, Telugu and more, with explanations written to match.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">What it does</p>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            Built around one question: where does it break?
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Most students don’t fail maths everywhere. They fail three specific steps that never got
          fixed. Ganita is built to find those.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="bg-card p-7 transition-colors hover:bg-secondary/40">
              <Icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
