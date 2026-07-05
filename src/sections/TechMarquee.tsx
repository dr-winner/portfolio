"use client";
// Uses Framer Motion for the infinite scroll animation

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useReducedMotion,
} from "framer-motion";

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const TECH_ITEMS = [
  "Python",
  "TypeScript",
  "Next.js",
  "FastAPI",
  "LangChain",
  "Splunk",
  "Elastic",
  "AWS",
  "Docker",
  "React",
  "PostgreSQL",
  "Prisma",
  "GSAP",
  "Framer Motion",
  "Solidity",
  "LLMs",
  "Azure",
  "GCP",
  "GitHub Actions",
  "Terraform",
] as const;

/* ─── Dot separator ────────────────────────────────────────────────────────── */

function Dot() {
  return <span className="size-1 rounded-full bg-cyber-300/60" aria-hidden />;
}

/* ─── Component ────────────────────────────────────────────────────────────── */

export function TechMarquee() {
  const shouldReduceMotion = useReducedMotion();

  /* Motion value drives the translate-x imperatively for smooth pause/resume */
  const x = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);
  const playbackRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const inner = innerRef.current;
    if (!inner) return;

    // One full copy = half of the duplicated strip; when x reaches -half the
    // visual is identical to x = 0, so the loop is invisible.
    const half = inner.scrollWidth / 2;

    playbackRef.current = animate(x, [0, -half], {
      duration: 30,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => playbackRef.current?.stop();
  }, [shouldReduceMotion, x]);

  /* ── Reduced-motion fallback: static horizontally scrollable list ─────── */
  if (shouldReduceMotion) {
    return (
      <section
        aria-label="Technology stack"
        className="relative overflow-hidden py-0 border-y border-slate-200/70 bg-slate-50/60 dark:border-white/[0.06] dark:bg-ink-50/30"
      >
        <div className="overflow-x-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center whitespace-nowrap px-6">
            {TECH_ITEMS.map((item, i) => (
              <span
                key={item}
                className="inline-flex shrink-0 items-center gap-2.5 px-4 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
              >
                {i > 0 && <Dot />}
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── Animated marquee ──────────────────────────────────────────────────── */
  const doubled = [...TECH_ITEMS, ...TECH_ITEMS];

  return (
    <section
      aria-label="Technology stack"
      className="relative overflow-hidden py-0 border-y border-slate-200/70 bg-slate-50/60 dark:border-white/[0.06] dark:bg-ink-50/30"
      onMouseEnter={() => playbackRef.current?.pause()}
      onMouseLeave={() => playbackRef.current?.play()}
    >
      <div className="py-4 mask-fade-x-rail">
        <motion.div
          ref={innerRef}
          style={{ x }}
          className="flex whitespace-nowrap will-change-transform"
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-2.5 px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400"
            >
              <Dot />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
