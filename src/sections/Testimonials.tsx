"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import {
  testimonials as seedTestimonials,
  type Testimonial,
} from "@/content/testimonials";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import { TESTIMONIAL, EASE } from "@/config/motion.config";

export function Testimonials({ items }: { items?: Testimonial[] } = {}) {
  const list = items?.length ? items : seedTestimonials;
  const reduced = useReducedMotion();

  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = forward, -1 = backward
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number, direction: 1 | -1) => {
      setDir(direction);
      setIdx((next + list.length) % list.length);
    },
    [list.length],
  );

  const prev = useCallback(() => go(idx - 1, -1), [go, idx]);
  const next = useCallback(() => go(idx + 1, 1), [go, idx]);

  // Auto-advance — disabled under reduced motion
  useEffect(() => {
    if (reduced || paused) return;
    timerRef.current = setTimeout(() => go(idx + 1, 1), TESTIMONIAL.interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx, paused, reduced, go]);

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 64 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: TESTIMONIAL.slideDur, ease: EASE.slide },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: reduced ? 0 : d * -64,
      transition: { duration: TESTIMONIAL.slideDur, ease: EASE.slide },
    }),
  };

  const current = list[idx];

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-28 lg:py-32"
      aria-label="Testimonials"
    >
      <div className="container">
        <ScrollReveal from="none" fadeOut={false}>
          <SectionHeader
            eyebrow="Trust"
            title="What people I've worked with say"
            description="Honest words from people I've built and defended alongside."
          />
        </ScrollReveal>

        {/* Carousel */}
        <div
          className="relative mt-14 md:mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Card wrapper — fixed height so layout never jumps */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/[0.88] backdrop-blur-sm dark:border-white/10 dark:bg-ink-100/70 min-h-[260px] md:min-h-[220px]">
            {/* Decorative large quote mark */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-4 left-6 select-none font-display text-[8rem] leading-none text-cyber-300/10 dark:text-cyber-300/[0.07] md:text-[11rem]"
            >
              &#8220;
            </span>

            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={idx}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-8 md:p-10"
              >
                <Quote
                  className="size-6 text-cyber-500 dark:text-cyber-300"
                  aria-hidden
                />

                <blockquote className="mt-5 text-lg leading-relaxed text-slate-700 md:text-xl dark:text-slate-200">
                  &ldquo;{current.text}&rdquo;
                </blockquote>

                <div className="mt-8 flex items-center gap-4 border-t border-slate-200/80 pt-6 dark:border-white/10">
                  <Avatar
                    initials={current.initials}
                    accent={current.accent}
                    size={48}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {current.name}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      {current.position}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls row */}
          <div className="mt-6 flex items-center justify-between">
            {/* Dot indicators */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Select testimonial"
            >
              {list.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`Testimonial ${i + 1}`}
                  onClick={() => go(i, i > idx ? 1 : -1)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-300",
                    i === idx
                      ? "w-6 bg-cyber-400 dark:bg-cyber-300"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-white/25 dark:hover:bg-white/40",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200/90 bg-white/80 text-slate-600 transition-colors hover:border-cyber-400/40 hover:text-slate-900 dark:border-white/10 dark:bg-ink-100/60 dark:text-white/60 dark:hover:border-cyber-300/40 dark:hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200/90 bg-white/80 text-slate-600 transition-colors hover:border-cyber-400/40 hover:text-slate-900 dark:border-white/10 dark:bg-ink-100/60 dark:text-white/60 dark:hover:border-cyber-300/40 dark:hover:text-white"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
