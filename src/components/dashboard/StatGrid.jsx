import React from "react";

export default function StatGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="font-display text-3xl leading-none text-foreground">{item.value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
