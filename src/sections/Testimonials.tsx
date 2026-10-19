"use client";

import { useState, type FocusEvent, type PointerEvent } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

function updatePointerTilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  event.currentTarget.style.setProperty("--pointer-x", `${x * 100}%`);
  event.currentTarget.style.setProperty("--pointer-y", `${y * 100}%`);
  event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
  event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
}

function resetPointerTilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--pointer-x", "50%");
  event.currentTarget.style.setProperty("--pointer-y", "50%");
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="testimonial-marquee-card group relative flex min-h-[280px] w-[min(84vw,390px)] shrink-0 flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-lg shadow-slate-950/5 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-ocean-400/50 hover:shadow-ocean-950/15 sm:min-h-[300px] sm:p-7 md:w-[410px] md:p-8 dark:border-white/10 dark:bg-ink-100/75 dark:shadow-black/20 dark:hover:border-ocean-300/35"
      onPointerMove={updatePointerTilt}
      onPointerLeave={resetPointerTilt}
    >
      <span
        aria-hidden="true"
        className="testimonial-marquee-card__glow pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <figure className="relative z-10 flex h-full flex-col">
        <span
          aria-hidden="true"
          className="mb-3 font-display text-6xl leading-[0.65] text-ocean-500/50 dark:text-ocean-300/55"
        >
          “
        </span>
        <blockquote className="flex-1 text-[15px] leading-[1.75] text-slate-700 sm:text-base dark:text-slate-200">
          {testimonial.text}
        </blockquote>
        <figcaption className="mt-7 flex items-center gap-3 border-t border-slate-200/80 pt-5 dark:border-white/10">
          <Avatar
            initials={testimonial.initials}
            accent={testimonial.accent}
            size={42}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {testimonial.name}
            </div>
            <div className="truncate text-[13px] text-slate-500 dark:text-slate-400">
              {testimonial.position}
            </div>
          </div>
        </figcaption>
      </figure>
    </article>
  );
}

export function Testimonials({ items }: { items?: Testimonial[] } = {}) {
  const list = items?.length ? items : seedTestimonials;
  const reducedMotion = useReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const isPaused = userPaused || pointerPaused || focusPaused;

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "touch") setPointerPaused(true);
  }

  function handleFocusLeave(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocusPaused(false);
    }
  }

  const renderCards = (copy: string) =>
    list.map((testimonial, index) => (
      <TestimonialCard
        key={`${copy}-${testimonial.name}-${index}`}
        testimonial={testimonial}
      />
    ));

  return (
    <section id="testimonials" className="relative overflow-hidden py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal from="none" fadeOut={false}>
          <SectionHeader
            eyebrow="Trust"
            title="What people I've worked with say"
            description="Colleagues and clients — across security, AI, and product."
          />
        </ScrollReveal>

        <div className="mt-12 md:mt-16">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setUserPaused((paused) => !paused)}
              disabled={reducedMotion || !list.length}
              aria-pressed={userPaused}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-4 text-[12px] font-medium text-slate-700 transition-colors hover:border-ocean-400/60 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 disabled:cursor-default disabled:opacity-60 dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:border-ocean-300/40 dark:hover:text-white"
            >
              {reducedMotion ? <Play className="size-3.5" /> : userPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              {reducedMotion ? "Motion reduced" : userPaused ? "Resume motion" : "Pause motion"}
            </button>
          </div>

          <div
            role="region"
            aria-label="Testimonials"
            aria-roledescription="carousel"
            aria-live="off"
            className={clsx(
              "testimonial-marquee mask-fade-x-rail",
              reducedMotion && "testimonial-marquee--reduced"
            )}
            data-paused={isPaused || reducedMotion ? "true" : "false"}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={() => setPointerPaused(false)}
            onFocusCapture={() => setFocusPaused(true)}
            onBlurCapture={handleFocusLeave}
          >
            <div className="testimonial-marquee__track">
              <div className="testimonial-marquee__group" role="list">
                {renderCards("primary")}
              </div>
              {!reducedMotion && (
                <div className="testimonial-marquee__group" role="list" aria-hidden="true">
                  {renderCards("duplicate")}
                </div>
              )}
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500/80 dark:text-white/35">
            {reducedMotion ? "Scroll to explore" : "Hover to pause · Move your pointer over a card"}
          </p>
        </div>
      </div>
    </section>
  );
}
