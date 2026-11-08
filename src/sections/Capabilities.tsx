"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  capabilities,
  type Capability,
} from "@/content/capabilities";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

const accentText: Record<Capability["accent"], string> = {
  ocean: "text-ocean-600 dark:text-ocean-300",
  signal: "text-amber-700 dark:text-signal-300",
  ok: "text-emerald-700 dark:text-ok-400",
  threat: "text-rose-700 dark:text-threat-400",
};

const accentIconSurface: Record<Capability["accent"], string> = {
  ocean:
    "border-ocean-400/35 bg-cyan-50 text-ocean-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-ocean-300",
  signal:
    "border-amber-400/40 bg-amber-50 text-amber-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-signal-300",
  ok: "border-emerald-400/40 bg-emerald-50 text-emerald-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-ok-400",
  threat:
    "border-rose-400/40 bg-rose-50 text-rose-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-threat-400",
};

const accentRing: Record<Capability["accent"], string> = {
  ocean:
    "shadow-[inset_0_0_0_1px_rgba(60,207,255,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(60,207,255,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(60,207,255,0.06)] dark:hover:shadow-[inset_0_0_0_1px_rgba(60,207,255,0.12)]",
  signal:
    "shadow-[inset_0_0_0_1px_rgba(255,174,0,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(255,174,0,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(255,174,0,0.06)] dark:hover:shadow-[inset_0_0_0_1px_rgba(255,174,0,0.14)]",
  ok: "shadow-[inset_0_0_0_1px_rgba(71,240,167,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(71,240,167,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(71,240,167,0.06)] dark:hover:shadow-[inset_0_0_0_1px_rgba(71,240,167,0.14)]",
  threat:
    "shadow-[inset_0_0_0_1px_rgba(255,82,119,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(255,82,119,0.45)] dark:shadow-[inset_0_0_0_1px_rgba(255,82,119,0.06)] dark:hover:shadow-[inset_0_0_0_1px_rgba(255,82,119,0.14)]",
};

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="capabilities" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal>
          <SectionHeader
            eyebrow="What I do"
            title="I look for what breaks, and I explain how to fix it."
          />
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:mt-20 md:gap-10 lg:mt-24 lg:grid-cols-3">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.id}
                className="cap-card h-full"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 420, damping: 28 },
                }}
              >
                <Card
                  className={clsx(
                    "group relative flex h-full flex-col p-6 transition-shadow duration-300 sm:p-8 md:p-10 lg:p-11",
                    accentRing[cap.accent],
                    "hover:shadow-glow-sm dark:hover:shadow-none"
                  )}
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div
                      className={clsx(
                        "inline-flex size-12 shrink-0 items-center justify-center rounded-xl border",
                        accentIconSurface[cap.accent]
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 sm:text-right dark:text-slate-400">
                      {cap.label}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl leading-tight tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                    {cap.description}
                  </p>

                  {cap.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-8 space-y-3.5 text-[14px] md:text-[15px]">
                    {cap.bullets.filter(Boolean).map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-slate-700 dark:text-slate-100"
                      >
                        <span
                          className={clsx(
                            "mt-2 size-1 shrink-0 rounded-full",
                            accentText[cap.accent]
                          )}
                        >
                          <span className="block size-1 rounded-full bg-current shadow-glow-sm" />
                        </span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                  )}

                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
