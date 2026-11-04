import React, { useEffect, useRef } from "react";

const SYMBOLS = [
  { char: "+", top: "12%", left: "6%", size: "text-5xl", depth: 28 },
  { char: "−", top: "74%", left: "11%", size: "text-4xl", depth: 18 },
  { char: "×", top: "20%", left: "90%", size: "text-4xl", depth: 32 },
  { char: "÷", top: "66%", left: "93%", size: "text-5xl", depth: 22 },
  { char: "π", top: "86%", left: "52%", size: "text-3xl", depth: 14 },
  { char: "√", top: "6%", left: "54%", size: "text-3xl", depth: 20 },
];

export default function HeroAtmosphere() {
  const rootRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    if (!root || !glow) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const symbols = Array.from(root.querySelectorAll("[data-depth]")).map((element) => ({
      element,
      depth: Number(element.dataset.depth) || 0,
    }));

    let targetX = 0;
    let targetY = 0;
    let glowX = 0;
    let glowY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let seen = false;
    let frame = 0;

    const render = () => {
      smoothX += (targetX - smoothX) * 0.1;
      smoothY += (targetY - smoothY) * 0.1;
      glowX += (targetX - glowX) * 0.14;
      glowY += (targetY - glowY) * 0.14;

      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;

      symbols.forEach(({ element, depth }) => {
        element.style.transform = `translate3d(${-smoothX * depth}px, ${-smoothY * depth}px, 0)`;
      });

      frame = requestAnimationFrame(render);
    };

    const onMove = (event) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      if (!seen) {
        seen = true;
        glowX = targetX;
        glowY = targetY;
        root.classList.add("is-live");
      }
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={glowRef} className="hero-glow" />
      {SYMBOLS.map((symbol) => (
        <span
          key={symbol.char}
          data-depth={symbol.depth}
          style={{ top: symbol.top, left: symbol.left }}
          className={`absolute hidden select-none font-display leading-none text-accent/20 sm:block ${symbol.size}`}
        >
          {symbol.char}
        </span>
      ))}
    </div>
  );
}
