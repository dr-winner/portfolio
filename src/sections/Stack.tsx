"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import {
  stackCategories as seedStack,
  type StackCategory,
  type StackLevel,
} from "@/content/stack";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { iconFromKey } from "@/lib/icons";

const accent: Record<StackCategory["accent"], string> = {
  ocean:
    "border-ocean-400/40 bg-cyan-50 text-ocean-700 dark:border-ocean-300/30 dark:bg-ocean-300/[0.06] dark:text-ocean-300",
  signal:
    "border-amber-400/40 bg-amber-50 text-amber-800 dark:border-signal-300/30 dark:bg-signal-300/[0.06] dark:text-signal-300",
  ok: "border-emerald-400/40 bg-emerald-50 text-emerald-800 dark:border-ok-400/30 dark:bg-ok-400/[0.06] dark:text-ok-400",
  threat:
    "border-rose-400/40 bg-rose-50 text-rose-800 dark:border-threat-400/30 dark:bg-threat-400/[0.06] dark:text-threat-400",
};

const levelDot: Record<StackLevel, string> = {
  core: "bg-emerald-600 dark:bg-ok-400",
  working: "bg-ocean-600 dark:bg-ocean-300",
  learning: "bg-amber-600 dark:bg-signal-300",
};

export function Stack({ categories }: { categories?: StackCategory[] } = {}) {
  const list = categories?.length ? categories : seedStack;

  return (
    <section id="stack" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Stack"
            title="The tools I reach for."
            description="Core day-one tools, what I'm actively working with, and what I'm sharpening next."
          />
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-12 flex flex-wrap justify-center gap-5 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 dark:text-white/60">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-600 shadow-glow-sm dark:bg-ok-400" /> core
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-ocean-600 shadow-glow-sm dark:bg-ocean-300" /> working
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-amber-600 shadow-glow-sm dark:bg-signal-300" /> learning
            </span>
          </div>
        </ScrollReveal>

        <div className="mt-16 md:mt-20 grid gap-8 md:grid-cols-2">
          {list.map((cat, i) => {
            const CatIcon = iconFromKey(cat.iconKey);
            return (
              <ScrollReveal
                key={cat.id}
                from={i % 2 === 0 ? "left" : "right"}
                amount={50}
                className={clsx(i === list.length - 1 && list.length % 2 === 1 && "md:col-span-2")}
              >
                <Card className="h-full border-slate-200/80 !bg-white/95 p-7 shadow-sm dark:border-transparent dark:!bg-ink-100/50 md:p-8">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 4 }}
                      transition={{ type: "spring", stiffness: 420, damping: 20 }}
                      title={cat.label}
                      className={clsx("inline-flex size-10 cursor-default items-center justify-center rounded-lg border", accent[cat.accent])}
                    >
                      <CatIcon className="size-5" />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-xl tracking-tight text-slate-900 dark:text-white">{cat.label}</h3>
                      <p className="text-xs text-slate-500 dark:text-white/65">{cat.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {cat.items.map((item) => {
                      const ItemIcon = iconFromKey(item.iconKey);
                      return (
                        <div
                          key={item.name}
                          className="group inline-flex items-center gap-2 rounded-lg border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-800 transition-all hover:-translate-y-0.5 hover:border-ocean-400/50 hover:shadow-glow-sm hover:text-slate-900 dark:border-white/10 dark:bg-ink-50/80 dark:text-white/80 dark:hover:border-ocean-300/35 dark:hover:text-white"
                        >
                          <ItemIcon className="size-4 text-ocean-600 dark:text-ocean-300/90" />
                          <span className="font-medium">{item.name}</span>
                          {item.level && (
                            <span
                              className={clsx(
                                "ml-1 size-1.5 rounded-full shadow-glow-sm",
                                levelDot[item.level]
                              )}
                              aria-label={`level: ${item.level}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
