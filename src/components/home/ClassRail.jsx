import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CLASS_LEVELS, topicsFor } from "@/lib/syllabus";

export default function ClassRail() {
  return (
    <section id="classes" className="border-y border-border/70 bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">Coverage</p>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">Class 6 through Class 12.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every chapter in the school syllabus, from whole numbers to differential equations.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CLASS_LEVELS.map((level) => (
            <Link
              key={level}
              to="/register?returnTo=/onboarding"
              className="group rounded-2xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl">{level}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {topicsFor(level).length} chapters
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
