import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, PenLine, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import useStudentProfile from "@/hooks/useStudentProfile";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/practice", label: "Practice", icon: PenLine },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export default function AppShell() {
  const { logout } = useAuth();
  const { profile } = useStudentProfile();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-display text-lg text-primary-foreground">
              Σ
            </span>
            <span className="hidden font-display text-lg tracking-tight sm:block">Ganita</span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-border bg-card/70 p-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
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
                className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground md:block"
              >
                Class {profile.class_level} · {profile.board}
              </Link>
            )}
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
    </div>
  );
}
