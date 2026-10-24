import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const skills = [
  { label: "Real Numbers", value: 84, tone: "bg-emerald-600" },
  { label: "Quadratic Equations", value: 41, tone: "bg-accent", flagged: true },
  { label: "Trigonometry", value: 63, tone: "bg-amber-500" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-16 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
        <div className="animate-rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Classes 6–12 · CBSE &amp; State Board
          </p>
          <h1 className="mt-6 text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Mathematics that <em className="font-normal text-accent">finally</em> makes sense.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Ganita finds the exact concepts a student is quietly shaky on, explains them in plain
            language, and builds practice that closes the gap — long before the exam does.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7">
              <Link to="/register?returnTo=/onboarding">
                Take the free diagnostic
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <a
              href="#how"
              className="text-sm font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              See how it works
            </a>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Free to begin · No card needed · English, Hindi &amp; Telugu
          </p>
        </div>

        <div className="animate-rise-slow relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-secondary/70 blur-2xl" aria-hidden="true" />
          <div className="relative rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_30px_70px_-40px_rgba(20,25,45,0.45)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Diagnostic</p>
                <p className="mt-1 font-display text-lg">Class 10 · Board track</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700">
                8 min complete
              </span>
            </div>

            <div className="mt-7 space-y-5">
              {skills.map((skill) => (
                <div key={skill.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className={skill.flagged ? "font-semibold text-foreground" : "text-foreground/80"}>
                      {skill.label}
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">{skill.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${skill.tone}`} style={{ width: `${skill.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-accent">Weakness detected</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Splitting the middle term when the leading coefficient isn’t 1 — a step that fails
                silently in every later chapter.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-border bg-card px-4 py-3 shadow-lg sm:block">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Next up</p>
            <p className="text-sm font-medium">5 questions · 6 min</p>
          </div>
        </div>
      </div>
    </section>
  );
}
