import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

export default function TopicPicker({ topics, topic, onTopic, count, onCount, onStart, loading, error }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.2em] text-accent">New practice set</p>
      <h1 className="mt-2 text-3xl tracking-tight">Pick a chapter to work on.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Questions are written for your class and board, then checked by a tutor summary at the end.
      </p>

      {error && (
        <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Chapters</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((item) => {
            const active = item === topic;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onTopic(item)}
                className={`rounded-full border px-4 py-2 text-sm transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/80 hover:border-accent/50 hover:text-foreground"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Number of questions
        </p>
        <div className="mt-3 inline-flex rounded-full border border-border bg-background p-1">
          {[5, 10].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onCount(value)}
              className={`rounded-full px-5 py-1.5 text-sm transition-colors ${
                count === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <Button
        size="lg"
        className="mt-8 h-12 w-full rounded-full sm:w-auto sm:px-8"
        onClick={onStart}
        disabled={!topic || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Writing your questions…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Start {count} questions
          </>
        )}
      </Button>
      {loading && (
        <p className="mt-3 text-xs text-muted-foreground">
          This usually takes a few seconds while the tutor builds your set.
        </p>
      )}
    </div>
  );
}
