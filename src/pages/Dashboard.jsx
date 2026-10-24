import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import useStudentProfile from "@/hooks/useStudentProfile";
import { averageScore, questionsSolved, topicStats, weakTopics } from "@/lib/study";
import StatGrid from "@/components/dashboard/StatGrid";
import WeakTopics from "@/components/dashboard/WeakTopics";
import AttemptList from "@/components/AttemptList";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine } from "lucide-react";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
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
          { sort: "-created_date", limit: 50 }
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
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-3xl bg-secondary/60" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      </div>
    );
  }

  const stats = topicStats(attempts);
  const firstName = profile.full_name?.split(" ")[0] || "there";
  const topGaps = weakTopics(attempts, 3);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {greeting()}
            </p>
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">{firstName}.</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-secondary px-3 py-1 text-foreground/75">
                Class {profile.class_level}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-foreground/75">
                {profile.board}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-foreground/75">
                {profile.goal}
              </span>
              {profile.stream && (
                <span className="rounded-full bg-secondary px-3 py-1 text-foreground/75">
                  {profile.stream}
                </span>
              )}
            </div>
          </div>
          <Button asChild size="lg" className="h-12 shrink-0 rounded-full px-6">
            <Link to="/practice">
              <PenLine className="mr-2 h-4 w-4" />
              {attempts.length ? "Start a practice set" : "Run your first diagnostic"}
            </Link>
          </Button>
        </div>
      </section>

      <StatGrid
        items={[
          { label: "Practice sets", value: attempts.length },
          { label: "Average score", value: `${averageScore(attempts)}%` },
          { label: "Questions solved", value: questionsSolved(attempts) },
          { label: "Chapters tracked", value: stats.length },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl">Where to focus next</h2>
            <Link to="/progress" className="text-xs font-medium text-accent hover:underline">
              Full breakdown
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ranked from your recent attempts, lowest mastery first.
          </p>
          <div className="mt-5">
            {attempts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6">
                <p className="text-sm text-muted-foreground">
                  Your weakness map is empty until you attempt a few questions.
                </p>
                <Button asChild variant="outline" className="mt-4 rounded-full">
                  <Link to="/practice">
                    Take a 5-question set
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <WeakTopics topics={topGaps} />
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl">Recent activity</h2>
            <Link to="/progress" className="text-xs font-medium text-accent hover:underline">
              See all
            </Link>
          </div>
          <div className="mt-3">
            <AttemptList attempts={attempts.slice(0, 5)} emptyText="Nothing here yet — your first set will appear here." />
          </div>
        </section>
      </div>
    </div>
  );
}
