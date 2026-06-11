"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import { experience as seedExperience, type TimelineEntry } from "@/content/experience";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

export function Experience({ items }: { items?: TimelineEntry[] } = {}) {
  const list = items?.length ? items : seedExperience;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Trajectory"
            title="Engineer → AI builder → Security operator."
            description="Same curiosity, broader lens. I stack layers instead of replacing them."
          />
        </ScrollReveal>

        <div ref={ref} className="relative mt-20 w-full md:mt-28">
          {/* Center spine — desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-slate-300/55 dark:bg-white/[0.06] md:block"
          />
          <motion.div
            aria-hidden
            style={{ height: lineHeight }}
            className="pointer-events-none absolute left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-ocean-300/80 via-ocean-300/40 to-signal-300/40 shadow-glow-sm md:block"
          />

          <ol className="relative m-0 flex list-none flex-col gap-16 md:gap-24 p-0">
            {list.map((entry, i) => (
              <TimelineItem
                key={`${entry.period}-${entry.title}`}
                entry={entry}
                side={i % 2 === 0 ? "right" : "left"}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ entry, side }: { entry: TimelineEntry; side: "left" | "right" }) {
  const rowRef = useRef<HTMLLIElement>(null);
  const { scrollYProgress: rowProg } = useScroll({
    target: rowRef,
    offset: ["start 0.95", "end 0.05"],
  });

  const opacity = useTransform(rowProg, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const x = useTransform(
    rowProg,
    [0, 0.1, 0.9, 1],
    side === "left" ? [-48, 0, 0, -28] : [48, 0, 0, 28]
  );
  const dotScale = useTransform(rowProg, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.7]);

  // Separator line: scaleX 0 → 1 as row enters
  const lineScale = useTransform(rowProg, [0, 0.35], [0, 1]);
  // Date fades in after line is mostly drawn (~60% progress = 0.21 on our [0,0.35] range)
  const dateOpacity = useTransform(rowProg, [0.18, 0.35], [0, 1]);

  return (
    <li ref={rowRef} className="relative">
      {/* Separator line — draws left-to-right on scroll enter */}
      <motion.div
        aria-hidden
        style={{ scaleX: lineScale, transformOrigin: "left" }}
        className="mb-5 h-px w-full origin-left bg-gradient-to-r from-ocean-300/40 via-slate-300/30 to-transparent dark:from-ocean-300/25 dark:via-white/[0.06]"
      />

      {/* Timeline dot */}
      <div
        className="pointer-events-none absolute left-[calc(15px+0.5px)] top-7 z-10 flex size-4 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2"
        aria-hidden
      >
        <motion.span
          style={{ scale: dotScale, opacity }}
          className="flex size-4 items-center justify-center rounded-full border border-slate-300/80 bg-white dark:border-white/15 dark:bg-ink-100"
        >
          <span
            className={clsx(
              "size-1.5 rounded-full shadow-glow-sm",
              entry.current ? "bg-ok-400" : "bg-ocean-300"
            )}
          />
        </motion.span>
      </div>

      <div
        className={clsx(
          "md:grid md:grid-cols-2 md:gap-16",
          side === "right" && "md:[&>*:first-child]:order-2"
        )}
      >
        <motion.div
          style={{ opacity, x }}
          className={clsx(
            "pl-10 md:pl-0",
            side === "left" ? "md:pr-12 md:text-right" : "md:pl-12"
          )}
        >
          <Card
            className={clsx(
              "w-full p-7 md:p-8 max-w-md md:max-w-lg",
              side === "left" && "md:ml-auto",
              side === "right" && "md:mr-auto"
            )}
          >
            <div
              className={clsx(
                "flex flex-wrap items-center gap-x-3 gap-y-1",
                side === "left" && "md:justify-end"
              )}
            >
              <motion.span
                style={{ opacity: dateOpacity }}
                className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/60"
              >
                {entry.period}
              </motion.span>
              {entry.current && (
                <span className="chip-ocean font-mono text-[10px] uppercase">
                  current
                </span>
              )}
            </div>
            <h3 className="mt-3 font-display text-xl tracking-tight text-slate-900 md:text-2xl dark:text-white">
              {entry.title}
            </h3>
            <p className="mt-1 text-sm font-mono text-slate-500 dark:text-white/60">
              @ {entry.org}
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-slate-700 md:text-[15px] dark:text-white/85">
              {entry.description}
            </p>
            <div
              className={clsx(
                "mt-5 flex flex-wrap gap-1.5",
                side === "left" && "md:justify-end"
              )}
            >
              {entry.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-slate-200/90 bg-white/80 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-white/55"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="hidden md:block" />
      </div>
    </li>
  );
}
