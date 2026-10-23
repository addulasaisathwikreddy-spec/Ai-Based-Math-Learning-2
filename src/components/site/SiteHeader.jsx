import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function SiteHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-lg text-primary-foreground">
            Σ
          </span>
          <span className="font-display text-xl tracking-tight">Ganita</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#features" className="transition-colors hover:text-foreground">What it does</a>
          <a href="#classes" className="transition-colors hover:text-foreground">Classes</a>
          <a href="#tracks" className="transition-colors hover:text-foreground">Exam tracks</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Link
                to="/login?returnTo=/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Button asChild size="sm">
                <Link to="/register?returnTo=/onboarding">Start free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
