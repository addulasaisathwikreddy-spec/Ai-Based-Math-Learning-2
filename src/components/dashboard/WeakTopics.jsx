import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import { strengthLabel } from "@/lib/study";

export default function WeakTopics({ topics }) {
  if (!topics.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
        No weak spots yet. Finish a practice set and Ganita will rank the chapters that need attention.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {topics.map((topic) => (
        <div
          key={topic.topic}
          className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-accent/40"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{topic.topic}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {strengthLabel(topic.mastery)} · {topic.mastery}% across {topic.attempts}{" "}
              {topic.attempts === 1 ? "set" : "sets"}
            </p>
          </div>
          <Link
            to={`/practice?topic=${encodeURIComponent(topic.topic)}`}
            className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors group-hover:border-accent group-hover:text-accent"
          >
            <Target className="h-3.5 w-3.5" />
            Practise
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ))}
    </div>
  );
}
