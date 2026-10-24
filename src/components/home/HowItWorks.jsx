import React from "react";

const steps = [
  {
    number: "01",
    title: "Diagnose",
    body: "A short adaptive set of questions across your class syllabus shows exactly which concepts hold and which ones quietly break.",
  },
  {
    number: "02",
    title: "Explain",
    body: "Every wrong answer gets a plain-language explanation of the missing step — in the language you chose.",
  },
  {
    number: "03",
    title: "Practise",
    body: "Fresh questions target only your weak topics, so each session is short, focused, and actually moves your score.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-border/70 bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">How it works</p>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            Three steps, repeated until it clicks.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative border-t border-border pt-6">
              <span className="font-display text-2xl text-accent">{step.number}</span>
              <h3 className="mt-3 text-xl">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
