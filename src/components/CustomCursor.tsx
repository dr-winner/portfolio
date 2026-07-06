"use client";

import { useEffect, useRef } from "react";

/**
 * Replaces the native cursor on pointer-fine devices with a small cyan dot
 * that follows with 0.15 lerp and scales on interactive elements.
 * Disabled under prefers-reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const dot = dotRef.current;
    if (!dot) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let hovering = false;
    let raf = 0;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      hovering = !!el?.closest(
        'button, a, input, [role="button"], [data-magnetic], label, select'
      );
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function tick() {
      current.x = lerp(current.x, target.x, 0.15);
      current.y = lerp(current.y, target.y, 0.15);
      if (!dot) { raf = requestAnimationFrame(tick); return; }
      const scale = hovering ? 1.6 : 1;
      dot.style.transform = `translate(${current.x}px, ${current.y}px) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    document.body.classList.add("custom-cursor-active");

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] size-3 rounded-full bg-ocean-300 will-change-transform mix-blend-difference transition-transform duration-150"
      style={{ transform: "translate(-50%, -50%)" }}
    />
  );
}
