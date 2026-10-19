"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
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
  const [hovered, setHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const isFlipped = hovered || toggled;

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setToggled((flipped) => !flipped);
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${testimonial.text} — ${testimonial.name}, ${testimonial.position}. Activate to ${isFlipped ? "show quote" : "show author"}.`}
      aria-pressed={isFlipped}
      className="testimonial-marquee-card relative w-[min(84vw,390px)] shrink-0 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-300 focus-visible:ring-offset-4 focus-visible:ring-offset-ink-950 md:w-[410px]"
      data-flipped={isFlipped}
      onClick={() => setToggled((flipped) => !flipped)}
      onKeyDown={handleKeyDown}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerMove={updatePointerTilt}
      onPointerLeave={(event) => {
        setHovered(false);
        resetPointerTilt(event);
      }}
    >
      <div className="testimonial-marquee-card__inner">
        <div className="testimonial-marquee-card__face testimonial-marquee-card__front" aria-hidden={isFlipped}>
          <span aria-hidden="true" className="testimonial-marquee-card__quote-mark">“</span>
          <blockquote className="testimonial-marquee-card__quote">{testimonial.text}</blockquote>
          <span aria-hidden="true" className="testimonial-marquee-card__scanline" />
        </div>
        <div className="testimonial-marquee-card__face testimonial-marquee-card__back" aria-hidden={!isFlipped}>
          <div className="testimonial-marquee-card__author">
            <Avatar
              initials={testimonial.initials}
              accent={testimonial.accent}
              size={56}
            />
            <div className="max-w-full">
              <div className="testimonial-marquee-card__name">
                {testimonial.name}
              </div>
              <div className="testimonial-marquee-card__position">
                {testimonial.position}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Testimonials({ items }: { items?: Testimonial[] } = {}) {
  const list = items?.length ? items : seedTestimonials;
  const reducedMotion = useReducedMotion();

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
          <div
            role="region"
            aria-label="Testimonials"
            aria-roledescription="carousel"
            aria-live="off"
            className={clsx(
              "testimonial-marquee mask-fade-x-rail",
              reducedMotion && "testimonial-marquee--reduced"
            )}
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
            {reducedMotion ? "Scroll to explore · Tap a card to reveal the author" : "Hover or tap a card to reveal the author"}
          </p>
        </div>
      </div>
    </section>
  );
}
