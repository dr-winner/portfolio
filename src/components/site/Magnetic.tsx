"use client";

import { useRef } from "react";

export function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el || !fine || reduce) return;
    const rect = el.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance > 110) {
      el.style.transform = "translate3d(0,0,0)";
      return;
    }
    el.style.transform = `translate3d(${dx * 0.18}px, ${dy * 0.18}px, 0)`;
  }

  function leave() {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  }

  return (
    <div className={`inline-flex ${className ?? ""}`} onPointerMove={move} onPointerLeave={leave}>
      <div ref={ref} className="inline-flex will-change-transform" style={{ transition: "transform 180ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
        {children}
      </div>
    </div>
  );
}
