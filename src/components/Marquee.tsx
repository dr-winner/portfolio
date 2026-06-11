"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

const DEFAULT_ITEMS = [
  "Python",
  "TypeScript",
  "Next.js",
  "FastAPI",
  "LangChain",
  "Splunk",
  "Elastic",
  "AWS",
  "Docker",
  "Solidity",
  "React",
  "Node.js",
  "PostgreSQL",
  "MITRE ATT&CK",
  "LangGraph",
  "CrowdStrike",
  "Redis",
  "Terraform",
];

export function Marquee({
  items = DEFAULT_ITEMS,
  speed = 30,
}: {
  items?: string[];
  speed?: number;
}) {
  const x = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playbackRef = useRef<any>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const inner = innerRef.current;
    if (!inner) return;

    // half = one copy width; when x reaches -half it looks identical to x=0
    const half = inner.scrollWidth / 2;

    playbackRef.current = animate(x, [0, -half], {
      duration: speed,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => playbackRef.current?.stop();
  }, [speed, x]);

  return (
    <section
      aria-label="Tech stack marquee"
      className="relative border-y border-slate-200/80 bg-slate-50/80 dark:border-white/[0.08] dark:bg-ink-100/40"
      onMouseEnter={() => playbackRef.current?.pause()}
      onMouseLeave={() => playbackRef.current?.play()}
    >
      <div className="overflow-hidden py-4 mask-fade-x-soft">
        <motion.div
          ref={innerRef}
          style={{ x }}
          className="flex whitespace-nowrap will-change-transform"
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-2.5 px-8 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-white/55"
            >
              <span className="size-1 rounded-full bg-ocean-400/70 dark:bg-ocean-300/60" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
