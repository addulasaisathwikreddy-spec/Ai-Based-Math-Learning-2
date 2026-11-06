import React from "react";

const TONES = [
  "border-brand-saffron/30 bg-brand-saffron/10 text-brand-saffron",
  "border-brand-indigo/30 bg-brand-indigo/10 text-brand-indigo",
  "border-brand-teal/30 bg-brand-teal/10 text-brand-teal",
  "border-brand-saffron/30 bg-brand-saffron/10 text-brand-saffron",
];

export default function StatGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item, i) => (
        <div key={item.label} className={`rounded-2xl border p-4 sm:p-5 ${TONES[i % TONES.length]}`}>
          <p className="font-display text-3xl leading-none">{item.value}</p>
          <p className="mt-2 text-xs text-foreground/65">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
