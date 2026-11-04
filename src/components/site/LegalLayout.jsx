import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";

export default function LegalLayout({ title, intro, updated, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="paper-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-14 sm:px-6 sm:pb-14 sm:pt-20">
            <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
            </Button>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Legal</p>
            <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
            <p className="mt-6 text-xs text-muted-foreground">Last updated: {updated}</p>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-10">{children}</div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({ icon: Icon, title, paragraphs, list, children }) {
  return (
    <section>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-accent">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl tracking-tight sm:text-2xl">{title}</h2>
          {paragraphs?.length > 0 && (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          )}

          {list?.length > 0 && (
            <ul className="mt-4 space-y-3">
              {list.map((item) => (
                <li key={item.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
