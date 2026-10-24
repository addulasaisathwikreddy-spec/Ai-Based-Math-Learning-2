import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import useStudentProfile from "@/hooks/useStudentProfile";
import { averageScore, questionsSolved, strengthLabel, topicStats } from "@/lib/study";
import MasteryBars from "@/components/progress/MasteryBars";
import ScoreTrend from "@/components/progress/ScoreTrend";
import AttemptList from "@/components/AttemptList";
import StatGrid from "@/components/dashboard/StatGrid";
import { Button } from "@/components/ui/button";
import { Loader2, PenLine } from "lucide-react";

export default function Progress() {
  const navigate = useNavigate();
  const { profile, loading } = useStudentProfile();
  const [attempts, setAttempts] = useState([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!profile) {
      navigate("/onboarding", { replace: true });
      return;
    }
    let active = true;
    (async () => {
      try {
        const { items } = await base44.entities.TestAttempt.filter(
          {},
          { sort: "-created_date", limit: 100 }
        );
        if (active) setAttempts(items);
      } finally {
        if (active) setLoadingAttempts(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, profile, navigate]);

  if (loading || !profile || loadingAttempts) {
    return (
      <div className="flex items-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Building your progress report…
      </div>
    );
  }

  const stats = topicStats(attempts);
  const average = averageScore(attempts);
  const best = attempts.reduce((max, a) => Math.max(max, Number(a.score_percent) || 0), 0);
  const strongest = stats[stats.length - 1];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 sm:p-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Progress report</p>
          <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">Class {profile.class_level} · {profile.board}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats.length
              ? `${stats.length} chapters tracked. Overall mastery ${average}% — ${
                  average >= 70 ? "on track" : "worth one more pass this week"
                }.`
              : "No chapters tracked yet. Your report fills in as you practise."}
          </p>
        </div>
        <Button asChild className="h-11 shrink-0 rounded-full px-6">
          <Link to="/practice">
            <PenLine className="mr-2 h-4 w-4" />
            Practise a chapter
          </Link>
        </Button>
      </section>

      <StatGrid
        items={[
          { label: "Average score", value: `${average}%` },
          { label: "Best set", value: `${best}%` },
          { label: "Sets completed", value: attempts.length },
          { label: "Questions solved", value: questionsSolved(attempts) },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
          <h2 className="text-xl">Chapter mastery</h2>
          <p className="mt-1 text-sm text-muted-foreground">Lowest first — the honest order.</p>
          <div className="mt-5">
            <MasteryBars rows={stats} />
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
          <h2 className="text-xl">Score trend</h2>
          <p className="mt-1 text-sm text-muted-foreground">Every set, oldest to newest.</p>
          <div className="mt-4">
            <ScoreTrend attempts={attempts} />
          </div>
          {strongest && (
            <p className="mt-4 rounded-xl bg-secondary/60 px-3 py-2 text-xs text-foreground/75">
              Strongest chapter right now: <span className="font-medium">{strongest.topic}</span> ({strongest.mastery}% ·{" "}
              {strengthLabel(strongest.mastery)})
            </p>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-border bg-card p-6 sm:p-7">
        <h2 className="text-xl">All attempts</h2>
        <div className="mt-3">
          <AttemptList attempts={attempts} emptyText="No attempts yet — start with a five-question set." />
        </div>
      </section>
    </div>
  );
}
