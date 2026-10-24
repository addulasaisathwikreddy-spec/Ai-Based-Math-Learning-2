import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "@/components/onboarding/ProfileForm";
import useStudentProfile from "@/hooks/useStudentProfile";

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, loading } = useStudentProfile();

  return (
    <div className="min-h-screen bg-background">
      <div className="paper-grid pointer-events-none fixed inset-0 opacity-50" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
            {loading ? "Loading" : profile ? "Your profile" : "Step 1 of 1"}
          </p>
          <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            {profile ? "Your details" : "Let’s set up your study plan."}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            These details decide which chapters you practise and how questions are written. A few
            fields change with your class — the stream only appears for Classes 11 and 12.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {loading ? (
            <div className="space-y-4">
              <div className="h-11 w-full animate-pulse rounded-lg bg-secondary" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-11 animate-pulse rounded-lg bg-secondary" />
                <div className="h-11 animate-pulse rounded-lg bg-secondary" />
                <div className="h-11 animate-pulse rounded-lg bg-secondary" />
                <div className="h-11 animate-pulse rounded-lg bg-secondary" />
              </div>
            </div>
          ) : (
            <ProfileForm profile={profile} onSaved={() => navigate("/dashboard", { replace: true })} />
          )}
        </div>
      </div>
    </div>
  );
}
