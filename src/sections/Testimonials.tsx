"use client";

import { Fragment } from "react";
import { Quote } from "lucide-react";
import { testimonials as seedTestimonials, type Testimonial } from "@/content/testimonials";
import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { SectionHeader } from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";

export function Testimonials({ items }: { items?: Testimonial[] } = {}) {
  const list = items?.length ? items : seedTestimonials;

  return (
    <section id="testimonials" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal from="none" fadeOut={false}>
          <SectionHeader
            eyebrow="Trust"
            title="What people I've worked with say"
            description="A slow loop of past collaborators — not edge-to-edge; same readable width as the rest of the page."
          />
        </ScrollReveal>

        <div className="mt-12 md:mt-16 w-full max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200/90 bg-slate-100/70 p-1 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)] dark:border-white/[0.08] dark:bg-ink-100/45 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
            <div className="overflow-hidden rounded-[14px] px-4 sm:px-6 md:px-8 py-5 md:py-6">
              <div className="mask-fade-x-soft">
                <div
                  className="flex w-max gap-5 md:gap-7 pr-5 md:pr-7 animate-move-left will-change-transform [animation-duration:45s] hover:[animation-play-state:paused]"
                >
                  {[...Array(2)].map((_, pass) => (
                    <Fragment key={pass}>
                      {list.map((t) => (
                        <Card
                          key={`${pass}-${t.name}`}
                          className="w-[258px] sm:w-[300px] md:w-[360px] shrink-0 p-6 md:p-7"
                        >
                          <Quote className="size-5 text-cyber-600/70 dark:text-cyber-300/70" />
                          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-[15px] dark:text-white/75">
                            {t.text}
                          </p>
                          <div className="mt-6 flex items-center gap-3 border-t border-slate-200/90 pt-4 dark:border-white/10">
                            <Avatar initials={t.initials} accent={t.accent} size={40} />
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</div>
                              <div className="max-w-[220px] text-xs leading-snug text-slate-500 dark:text-white/50">
                                {t.position}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
