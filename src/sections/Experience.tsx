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

  // Animated line fill — grows as you scroll through the section
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

        <div ref={ref} className="relative mt-20 md:mt-28 w-full max-w-5xl mx-auto">
          {/* Center spine — desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/[0.06] md:block"
          />
          <motion.div
            aria-hidden
            style={{ height: lineHeight }}
            className="pointer-events-none absolute left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-cyber-300/80 via-cyber-300/40 to-signal-300/40 shadow-glow-sm md:block"
          />

          {/* Mobile spine */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[15px] top-0 h-full w-px bg-white/[0.06] md:hidden"
          />
          <motion.div
            aria-hidden
            style={{ height: lineHeight }}
            className="pointer-events-none absolute left-[15px] top-0 w-px bg-gradient-to-b from-cyber-300/80 via-cyber-300/40 to-signal-300/40 shadow-glow-sm md:hidden"
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
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "end 0.05"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    side === "left" ? [-48, 0, 0, -28] : [48, 0, 0, 28]
  );
  const dotScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.7]);

  return (
    <li ref={ref} className="relative">
      {/* Dot — desktop: outer keeps center; inner motion only scales */}
      <div
        className="absolute left-1/2 top-7 z-10 hidden -translate-x-1/2 md:block"
        aria-hidden
      >
        <motion.span
          style={{ scale: dotScale, opacity }}
          className="flex size-4 items-center justify-center rounded-full border border-white/15 bg-ink-100"
        >
          <span
            className={clsx(
              "size-1.5 rounded-full shadow-glow-sm",
              entry.current ? "bg-ok-400" : "bg-cyber-300"
            )}
          />
        </motion.span>
      </div>

      {/* Dot — mobile left */}
      <span
        className={clsx(
          "absolute left-[7px] top-2 flex size-4 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-ink-100 md:hidden"
        )}
      >
        <span
          className={clsx(
            "size-1.5 rounded-full shadow-glow-sm",
            entry.current ? "bg-ok-400" : "bg-cyber-300"
          )}
        />
      </span>

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
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                {entry.period}
              </span>
              {entry.current && (
                <span className="chip-cyber font-mono text-[10px] uppercase">current</span>
              )}
            </div>
            <h3 className="mt-3 font-display text-xl md:text-2xl tracking-tight text-white">
              {entry.title}
            </h3>
            <p className="mt-1 text-sm font-mono text-white/45">@ {entry.org}</p>
            <p className="mt-4 text-[14px] md:text-[15px] leading-relaxed text-white/70">
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
                  className="rounded-md border border-white/10 bg-white/[0.02] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-white/55"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Empty cell on the opposite side keeps the grid balanced. */}
        <div className="hidden md:block" />
      </div>
    </li>
  );
}
