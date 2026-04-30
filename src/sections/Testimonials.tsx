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

        <div className="mt-12 w-full md:mt-16">
          <div className="rounded-2xl border border-slate-200/90 bg-slate-100/70 p-1 dark:border-white/[0.1] dark:bg-ink-100/55">
            <div className="overflow-hidden rounded-[14px] px-4 py-5 sm:px-6 md:px-8 md:py-6">
              <div className="mask-fade-x-rail">
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
                          <Quote className="size-5 text-cyber-600 dark:text-cyber-300" />
                          <p className="mt-3 text-[15px] leading-relaxed text-slate-700 md:text-base dark:text-slate-200">
                            {t.text}
                          </p>
                          <div className="mt-6 flex items-center gap-3 border-t border-slate-200/90 pt-4 dark:border-white/14">
                            <Avatar initials={t.initials} accent={t.accent} size={40} />
                            <div>
                              <div className="text-[15px] font-semibold text-slate-900 dark:text-white">
                                {t.name}
                              </div>
                              <div className="max-w-[220px] text-[13px] leading-snug text-slate-600 dark:text-slate-400">
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
