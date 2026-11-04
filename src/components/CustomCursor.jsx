import React, { useEffect, useRef, useState } from "react";

const GROW_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, .lift-card, .lift-tile, .lift-btn';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setActive(fine.matches && !reduced.matches);
    sync();

    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const state = { x: 0, y: 0, rx: 0, ry: 0, scale: 1, target: 1, seen: false };
    let hovering = false;
    let frame = 0;

    const render = () => {
      state.rx += (state.x - state.rx) * 0.15;
      state.ry += (state.y - state.ry) * 0.15;
      state.scale += (state.target - state.scale) * 0.18;

      dot.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${state.rx}px, ${state.ry}px, 0) translate(-50%, -50%) scale(${state.scale})`;

      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const show = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hide = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onMove = (event) => {
      if (!state.seen) {
        state.seen = true;
        state.rx = event.clientX;
        state.ry = event.clientY;
        show();
      }
      state.x = event.clientX;
      state.y = event.clientY;
    };

    const onOver = (event) => {
      const target = event.target;
      hovering = target instanceof Element && Boolean(target.closest(GROW_SELECTOR));
      state.target = hovering ? 1.7 : 1;
    };

    const onDown = () => {
      state.target = 0.72;
    };

    const onUp = () => {
      state.target = hovering ? 1.7 : 1;
    };

    const onEnter = () => {
      if (state.seen) show();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", hide);
    root.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", hide);
      root.removeEventListener("mouseenter", onEnter);
      root.classList.remove("custom-cursor-active");
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
