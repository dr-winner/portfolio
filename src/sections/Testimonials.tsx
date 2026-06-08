"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

const SLIDE_DURATION = 6000;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
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

        <div
          className="relative mt-14 md:mt-20"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Decorative large quote mark */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-display text-[9rem] leading-none text-cyber-300/10 dark:text-cyber-300/8 md:-top-8 md:text-[12rem]"
          >
            &ldquo;
          </span>

          {/* Slide area */}
          <div className="relative overflow-hidden">
            {/* Fixed height so layout doesn't shift between slides */}
            <div className="relative min-h-[240px] sm:min-h-[220px] md:min-h-[200px]">
              <AnimatePresence initial={false} custom={dir} mode="sync">
                <motion.div
                  key={current}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center md:px-0"
                >
                  {/* Quote text — constrained for readability */}
                  <p className="mx-auto max-w-2xl text-[17px] leading-[1.75] text-slate-700 md:text-xl md:leading-[1.7] dark:text-slate-200">
                    {t.text}
                  </p>

                  {/* Attribution */}
                  <div className="mt-8 flex items-center gap-3">
                    <Avatar initials={t.initials} accent={t.accent} size={40} />
                    <div className="text-left">
                      <div className="text-[14px] font-semibold text-slate-900 dark:text-white">
                        {t.name}
                      </div>
                      <div className="text-[13px] text-slate-500 dark:text-slate-400">
                        {t.position}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={clsx(
                  "h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-300",
                  i === current
                    ? "w-6 bg-cyber-400"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-white/15 dark:hover:bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
