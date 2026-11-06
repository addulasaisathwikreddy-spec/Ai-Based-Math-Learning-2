import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, PenLine, TrendingUp, LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import useStudentProfile from "@/hooks/useStudentProfile";
import WelcomeTour from "@/components/app/WelcomeTour";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tone: "saffron" },
  { to: "/practice", label: "Practice", icon: PenLine, tone: "indigo" },
  { to: "/progress", label: "Progress", icon: TrendingUp, tone: "teal" },
];

const NAV_TONE = {
  saffron: {
    active: "bg-brand-saffron text-white shadow-sm",
    idle: "text-foreground/65 hover:bg-brand-saffron/10 hover:text-brand-saffron",
  },
  indigo: {
    active: "bg-brand-indigo text-white shadow-sm",
    idle: "text-foreground/65 hover:bg-brand-indigo/10 hover:text-brand-indigo",
  },
  teal: {
    active: "bg-brand-teal text-white shadow-sm",
    idle: "text-foreground/65 hover:bg-brand-teal/10 hover:text-brand-teal",
  },
};

const tourKey = (id) => `ganita_tour_seen_${id}`;

export default function AppShell() {
  const { user, logout } = useAuth();
  const { profile } = useStudentProfile();
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    if (!localStorage.getItem(tourKey(user.id))) setTourOpen(true);
  }, [user?.id]);

  const closeTour = () => {
    setTourOpen(false);
    if (user?.id) localStorage.setItem(tourKey(user.id), "1");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-saffron to-brand-indigo font-display text-lg text-white">
              Σ
            </span>
            <span className="hidden font-display text-lg tracking-tight sm:block">Ganita</span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-border bg-card/70 p-1">
            {links.map((link) => {
              const Icon = link.icon;
              const tone = NAV_TONE[link.tone];
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                      isActive ? tone.active : tone.idle
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {profile && (
              <Link
                to="/onboarding"
                className="hidden rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1.5 text-xs text-brand-indigo transition-colors hover:bg-brand-indigo/15 md:block"
              >
                Class {profile.class_level} · {profile.board}
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTourOpen(true)}
              aria-label="How Ganita works"
              title="How Ganita works"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout(true)}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <WelcomeTour open={tourOpen} onClose={closeTour} />
    </div>
  );
}
             
            
