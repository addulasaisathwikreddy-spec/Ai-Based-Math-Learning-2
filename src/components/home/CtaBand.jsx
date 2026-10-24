import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-primary-foreground sm:px-12">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-accent/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl leading-tight tracking-tight sm:text-4xl">
              Ten minutes today tells you what to fix tonight.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Create a profile, run the first diagnostic, and get a ranked list of the chapters
              holding your score down.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 shrink-0 rounded-full bg-primary-foreground px-7 text-primary hover:bg-primary-foreground/90">
            <Link to="/register?returnTo=/onboarding">
              Start free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
