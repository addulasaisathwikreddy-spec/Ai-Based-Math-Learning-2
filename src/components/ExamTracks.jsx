import React from "react";
import { Check } from "lucide-react";

const tracks = [
  {
    name: "School & Board",
    detail: "Classes 6–10",
    points: ["Chapter-wise practice", "Board answer format", "Term revision sets"],
  },
  {
    name: "JEE",
    detail: "Classes 11–12",
    points: ["MPC depth problems", "Timed mixed sets", "Concept-first solutions"],
  },
  {
    name: "NEET",
    detail: "Classes 11–12",
    points: ["BiPC mathematics base", "Speed drills", "Formula recall"],
  },
];

export default function ExamTracks() {
  return (
    <section id="tracks" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">Exam tracks</p>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">One platform, three destinations.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Your goal is saved with your profile, so practice difficulty and chapter focus follow the
            exam you’re actually preparing for.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {tracks.map((track) => (
            <div key={track.name} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-xl">{track.name}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{track.detail}</p>
              <ul className="mt-4 space-y-2">
                {track.points.map((point) => (
                  <li key={point} className="flex gap-2 text-xs leading-relaxed text-foreground/75">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
