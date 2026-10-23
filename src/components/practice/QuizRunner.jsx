import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export default function QuizRunner({ questions, topic, onSubmit, saving }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(() => null));
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    setIndex(0);
    setAnswers(questions.map(() => null));
  }, [questions]);

  const current = questions[index];
  const answeredCount = useMemo(() => answers.filter((a) => a !== null).length, [answers]);
  const isLast = index === questions.length - 1;

  const choose = (optionIndex) => {
    setAnswers((prev) => prev.map((value, i) => (i === index ? optionIndex : value)));
  };

  const next = () => {
    if (isLast) {
      const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      onSubmit(answers, seconds);
      return;
    }
    setIndex((i) => i + 1);
  };

  if (!current) return null;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{topic}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Question {index + 1} of {questions.length} · {answeredCount} answered
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground/70 tabular-nums">
          {Math.round(((index + 1) / questions.length) * 100)}%
        </span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="mt-7 text-xl leading-snug sm:text-2xl">{current.prompt}</h2>

      <div className="mt-6 space-y-2.5">
        {current.options.map((option, optionIndex) => {
          const selected = answers[index] === optionIndex;
          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => choose(optionIndex)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all ${
                selected
                  ? "border-primary bg-primary/[0.04] text-foreground"
                  : "border-border bg-background hover:border-accent/40"
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {selected ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + optionIndex)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="rounded-full"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0 || saving}
        >
          Back
        </Button>
        <Button
          className="rounded-full px-6"
          onClick={next}
          disabled={answers[index] === null || saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking…
            </>
          ) : isLast ? (
            "Finish and see results"
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
