"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import clsx from "clsx";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

const SLIDE_DURATION = 6000;

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const transition = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

export function Testimonials({ items }: { items?: Testimonial[] } = {}) {
  const list = items?.length ? items : seedTestimonials;
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  const goTo = useCallback(
    (idx: number) => {
      setDir(idx >= current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const next = useCallback(() => {
    setDir(1);
    setCurrent((c) => (c + 1) % list.length);
  }, [list.length]);

  // Auto-advance — disabled under reduced-motion
  useEffect(() => {
    if (reduced || paused) return;
    const t = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(t);
  }, [next, paused, reduced]);

  const t = list[current];

  return (
    <section id="testimonials" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal from="none" fadeOut={false}>
          <SectionHeader
            eyebrow="Trust"
            title="What people I've worked with say"
            description="Colleagues and clients — across security, AI, and product."
          />
        </ScrollReveal>

        <div className="mt-12 md:mt-16">
          <div className="rounded-2xl border border-slate-200/90 bg-slate-100/70 p-1 dark:border-white/[0.1] dark:bg-ink-100/55">
            <div
              className="relative overflow-hidden rounded-[14px]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="relative h-[320px] sm:h-[280px] md:h-[260px]">
                <AnimatePresence initial={false} custom={dir} mode="sync">
                  <motion.div
                    key={current}
                    custom={dir}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transition}
                    className="absolute inset-0 flex items-center px-6 py-8 sm:px-8 md:px-10"
                  >
                    <Card className="w-full p-6 md:p-8">
                      <Quote className="size-5 text-cyber-600 dark:text-cyber-300" />
                      <p className="mt-4 text-[15px] leading-relaxed text-slate-700 md:text-base dark:text-slate-200">
                        {t.text}
                      </p>
                      <div className="mt-6 flex items-center gap-3 border-t border-slate-200/90 pt-4 dark:border-white/14">
                        <Avatar initials={t.initials} accent={t.accent} size={40} />
                        <div>
                          <div className="text-[15px] font-semibold text-slate-900 dark:text-white">
                            {t.name}
                          </div>
                          <div className="max-w-[240px] text-[13px] leading-snug text-slate-600 dark:text-slate-400">
                            {t.position}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-2 pb-5">
                {list.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={clsx(
                      "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-300",
                      i === current
                        ? "w-6 bg-cyber-400"
                        : "w-1.5 bg-slate-400/40 hover:bg-slate-400/70 dark:bg-white/20 dark:hover:bg-white/40"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
