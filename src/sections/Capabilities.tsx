"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import {
  capabilities,
  capabilityPreamble,
  type Capability,
} from "@/content/capabilities";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

const accentText: Record<Capability["accent"], string> = {
  cyber: "text-cyber-600 dark:text-cyber-300",
  signal: "text-amber-700 dark:text-signal-300",
  ok: "text-emerald-700 dark:text-ok-400",
  threat: "text-rose-700 dark:text-threat-400",
};

const accentIconSurface: Record<Capability["accent"], string> = {
  cyber:
    "border-cyber-400/35 bg-cyan-50 text-cyber-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-cyber-300",
  signal:
    "border-amber-400/40 bg-amber-50 text-amber-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-signal-300",
  ok: "border-emerald-400/40 bg-emerald-50 text-emerald-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-ok-400",
  threat:
    "border-rose-400/40 bg-rose-50 text-rose-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-threat-400",
};

const accentRing: Record<Capability["accent"], string> = {
  cyber: "shadow-[inset_0_0_0_1px_rgba(60,207,255,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(60,207,255,0.45)]",
  signal: "shadow-[inset_0_0_0_1px_rgba(255,174,0,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(255,174,0,0.45)]",
  ok: "shadow-[inset_0_0_0_1px_rgba(71,240,167,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(71,240,167,0.45)]",
  threat: "shadow-[inset_0_0_0_1px_rgba(255,82,119,0.18)] hover:shadow-[inset_0_0_0_1px_rgba(255,82,119,0.45)]",
};

export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal>
          <SectionHeader
            eyebrow="What I do"
            title="The work, not the job title."
            description="How I show up: defend systems, make models useful, harden the cloud, and still ship the product. Four lanes — one through-line: fewer surprises, faster answers."
          />
        </ScrollReveal>

        <div className="mt-12 space-y-6 text-[15px] leading-[1.75] text-slate-700 md:mt-20 md:space-y-0 md:grid md:gap-10 md:text-[16px] lg:mt-24 lg:gap-14 lg:grid-cols-2 dark:text-white/72">
          <p className="prose-measure md:max-w-none">{capabilityPreamble[0]}</p>
          <p className="prose-measure border-t border-slate-200/90 pt-6 text-slate-700 md:max-w-none md:border-t-0 md:border-l md:border-slate-200/90 md:pl-8 md:pt-0 dark:border-white/10 dark:text-white/72">
            {capabilityPreamble[1]}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:mt-20 md:gap-10 lg:mt-24 lg:grid-cols-2">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <ScrollReveal key={cap.id} from="up" amount={36}>
                <motion.div
                  className="h-full"
                  whileHover={{
                    y: -8,
                    transition: { type: "spring", stiffness: 420, damping: 28 },
                  }}
                >
                <Card
                  className={clsx(
                    "group relative h-full p-6 sm:p-8 md:p-10 lg:p-11 transition-shadow duration-300",
                    accentRing[cap.accent],
                    "hover:shadow-glow-sm"
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
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500 sm:text-right dark:text-white/38">
                      {cap.label}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl leading-tight tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600 dark:text-white/70">{cap.description}</p>

                  <div className="my-8 divider-hair" />

                  <ul className="space-y-3.5 text-[14px] md:text-[15px]">
                    {cap.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-slate-700 dark:text-white/78">
                        <span className={clsx("mt-2 size-1 shrink-0 rounded-full", accentText[cap.accent])}>
                          <span className="block size-1 rounded-full bg-current shadow-glow-sm" />
                        </span>
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
