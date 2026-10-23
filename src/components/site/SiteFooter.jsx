import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary font-display text-sm text-primary-foreground">
              Σ
            </span>
            <span className="font-display text-lg">Ganita</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Personalised mathematics for Classes 6 to 12 — find the gap, close the gap, track the climb.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <Link to="/login?returnTo=/dashboard" className="hover:text-foreground">Log in</Link>
          <Link to="/register?returnTo=/onboarding" className="hover:text-foreground">Create account</Link>
          <a href="#classes" className="hover:text-foreground">Syllabus</a>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
        Built for CBSE and State Board students across India.
      </div>
    </footer>
  );
}
