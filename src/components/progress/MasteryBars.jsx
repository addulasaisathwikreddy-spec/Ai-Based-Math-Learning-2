import React from "react";
import { strengthLabel } from "@/lib/study";

const toneFor = (mastery) => {
  if (mastery >= 70) return "bg-emerald-600";
  if (mastery >= 50) return "bg-amber-500";
  return "bg-accent";
};

export default function MasteryBars({ rows }) {
  if (!rows.length) {
    return (
      <p className="py-6 text-sm text-muted-foreground">
        Attempt a practice set and your chapter-wise mastery will build here.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {rows.map((row) => (
        <div key={row.topic}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-foreground">{row.topic}</span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {row.mastery}% · {strengthLabel(row.mastery)}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full ${toneFor(row.mastery)} transition-all duration-700`}
              style={{ width: `${Math.max(row.mastery, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
