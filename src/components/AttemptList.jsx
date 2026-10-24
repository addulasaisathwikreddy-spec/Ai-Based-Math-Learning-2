import React from "react";
import { formatDate, formatDuration } from "@/lib/study";

export default function AttemptList({ attempts, emptyText = "No attempts yet." }) {
  if (!attempts.length) {
    return <p className="py-6 text-sm text-muted-foreground">{emptyText}</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {attempts.map((attempt) => (
        <li key={attempt.id} className="flex items-center justify-between gap-4 py-3.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{attempt.topic}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDate(attempt.created_date)} · {attempt.total_questions} questions ·{" "}
              {formatDuration(attempt.duration_seconds)}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${
              attempt.score_percent >= 70
                ? "bg-emerald-500/10 text-emerald-700"
                : attempt.score_percent >= 50
                  ? "bg-amber-500/10 text-amber-700"
                  : "bg-accent/10 text-accent"
            }`}
          >
            {Math.round(attempt.score_percent)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
