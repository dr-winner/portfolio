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
  cyber: "text-cyber-300 border-cyber-300/30 bg-cyber-300/[0.06]",
  signal: "text-signal-300 border-signal-300/30 bg-signal-300/[0.06]",
  ok: "text-ok-400 border-ok-400/30 bg-ok-400/[0.06]",
  threat: "text-threat-400 border-threat-400/30 bg-threat-400/[0.06]",
};

const levelDot: Record<StackLevel, string> = {
  core: "bg-ok-400",
  working: "bg-cyber-300",
  learning: "bg-signal-300",
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
          <div className="mt-12 flex flex-wrap justify-center gap-5 text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-ok-400 shadow-glow-sm" /> core</span>
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-cyber-300 shadow-glow-sm" /> working</span>
            <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-signal-300 shadow-glow-sm" /> learning</span>
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
                <Card className="h-full !bg-ink-100/50 p-7 md:p-8">
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
                      <h3 className="font-display text-xl tracking-tight text-white">{cat.label}</h3>
                      <p className="text-xs text-white/50">{cat.description}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {cat.items.map((item) => {
                      const ItemIcon = iconFromKey(item.iconKey);
                      return (
                        <div
                          key={item.name}
                          className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-ink-50/80 px-3.5 py-2.5 text-sm text-white/80 transition-all hover:-translate-y-0.5 hover:border-cyber-300/35 hover:shadow-glow-sm hover:text-white"
                        >
                          <ItemIcon className="size-4 text-cyber-300/90" />
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
