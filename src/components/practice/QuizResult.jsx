import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Check, Loader2, RotateCcw, Sparkles, X } from "lucide-react";

function ScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-secondary" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={score >= 70 ? "#0f766e" : score >= 50 ? "#d97706" : "#b4572f"}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-3xl tabular-nums">{score}%</span>
      </div>
    </div>
  );
}

export default function QuizResult({ attempt, onRestart }) {
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const missed = (attempt.questions || [])
        .filter((q) => q.selected_index !== q.correct_index)
        .map((q) => ({
          prompt: q.prompt,
          correct_answer: q.options?.[q.correct_index] || "",
          chosen_answer: q.selected_index >= 0 ? q.options?.[q.selected_index] || "" : "",
        }));
      try {
        const response = await base44.functions.invoke("tutorInsight", {
          topic: attempt.topic,
          class_level: attempt.class_level,
          total: attempt.total_questions,
          correct: attempt.correct_count,
          missed,
        });
        if (active) setInsight(response.data);
      } catch (err) {
        if (active) {
          setInsight({
            insight: `You scored ${attempt.correct_count} of ${attempt.total_questions}. Review the questions you missed below.`,
            tips: ["Redo the missed questions slowly.", "Write the formula before each sum.", "Come back to this chapter in 3 days."],
            demo: true,
          });
        }
      } finally {
        if (active) setLoadingInsight(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [attempt]);

  const message =
    attempt.score_percent >= 85
      ? "Excellent — this chapter is secure."
      : attempt.score_percent >= 60
        ? "Good progress. A little polish and this is solid."
        : "This one needs another pass. That is exactly what practice is for.";

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={Math.round(attempt.score_percent)} />
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-accent">{attempt.topic}</p>
            <h1 className="mt-2 text-2xl tracking-tight sm:text-3xl">{message}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {attempt.correct_count} of {attempt.total_questions} correct · {attempt.class_level ? `Class ${attempt.class_level}` : ""} · saved to your progress
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-accent/20 bg-accent/[0.04] p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg">Tutor note</h2>
          {insight?.demo && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Demo mode
            </span>
          )}
        </div>
        {loadingInsight ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Reading your answers…
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">{insight?.insight}</p>
            {!!insight?.tips?.length && (
              <ul className="mt-4 space-y-2">
                {insight.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/75">
                    <span className="mt-0.5 text-accent">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            )}
            {insight?.demo && (
              <p className="mt-4 text-xs text-muted-foreground">
                Live AI feedback is unavailable right now, so this note comes from our offline guide.
              </p>
            )}
          </>
        )}
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl">Answer review</h2>
        <div className="mt-5 space-y-5">
          {(attempt.questions || []).map((question, qIndex) => {
            const isCorrect = question.selected_index === question.correct_index;
            return (
              <div key={qIndex} className="border-t border-border pt-5 first:border-0 first:pt-0">
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  )}
                  <p className="text-sm font-medium leading-relaxed text-foreground">
                    {qIndex + 1}. {question.prompt}
                  </p>
                </div>
                <div className="mt-3 space-y-1.5 pl-6">
                  {question.options.map((option, optionIndex) => {
                    const correct = optionIndex === question.correct_index;
                    const chosen = optionIndex === question.selected_index;
                    return (
                      <p
                        key={optionIndex}
                        className={`text-sm ${
                          correct
                            ? "font-medium text-emerald-700"
                            : chosen
                              ? "text-accent line-through decoration-accent/40"
                              : "text-muted-foreground"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {correct ? "  ✓" : ""}
                        {chosen && !correct ? "  (your answer)" : ""}
                      </p>
                    );
                  })}
                </div>
                {question.explanation && (
                  <p className="mt-3 rounded-xl bg-secondary/60 px-3 py-2 text-xs leading-relaxed text-foreground/75">
                    {question.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" className="h-11 rounded-full px-6" onClick={onRestart}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Practise another chapter
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
          <Link to="/progress">View progress</Link>
        </Button>
      </div>
    </div>
  );
}
