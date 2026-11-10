"use client";

import { useEffect, useRef } from "react";

/**
 * Counts from zero to a target the first time it scrolls into view.
 * Server-renders the final value, so users without JS (or with reduced
 * motion) simply see the finished number.
 */
export function CountUp({
  to,
  decimals = 0,
  pad = false,
  duration = 1150,
  className = "",
}: {
  to: number;
  decimals?: number;
  /** Pad single digits with a leading zero keeps the console "05" / "06" look. */
  pad?: boolean;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  function format(value: number) {
    if (decimals > 0) return value.toFixed(decimals);
    const rendered = String(Math.round(value));
    return pad ? rendered.padStart(2, "0") : rendered;
  }

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.textContent = format(0);
    let raf = 0;
    let started = false;

    function start() {
      if (started) return;
      started = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        if (!node) return;
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = format(to * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            start();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals, pad, duration]);

  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
