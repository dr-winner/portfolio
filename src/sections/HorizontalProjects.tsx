"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { ArrowUpRight, CheckCircle2, Clock, Hourglass } from "lucide-react";
import {
  projects as seedProjects,
  type Project,
  type ProjectTag,
} from "@/content/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";

const tagPill: Record<ProjectTag, string> = {
  Security:
    "border-amber-400/40 bg-amber-50 text-amber-900 dark:border-signal-300/50 dark:bg-ink-200 dark:text-signal-200",
  AI: "border-cyan-400/40 bg-cyan-50 text-cyan-900 dark:border-ocean-300/55 dark:bg-ink-200 dark:text-ocean-200",
  "Full-Stack":
    "border-emerald-400/40 bg-emerald-50 text-emerald-900 dark:border-ok-400/50 dark:bg-ink-200 dark:text-ok-400",
  Web3: "border-slate-300/80 bg-slate-100 text-slate-800 dark:border-white/25 dark:bg-ink-200 dark:text-slate-100",
};

const statusMeta = {
  live: { label: "Live", Icon: CheckCircle2, cls: "text-emerald-700 dark:text-ok-400" },
  "in-progress": { label: "In progress", Icon: Clock, cls: "text-amber-700 dark:text-signal-300" },
  upcoming: { label: "Coming soon", Icon: Hourglass, cls: "text-cyan-700 dark:text-ocean-300" },
};

// ─── Full-width project card ───────────────────────────────────────────────────

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const { label: statusLabel, Icon: StatusIcon, cls: statusCls } = statusMeta[project.status];
  const hasImage = !!(project.imageUrl || project.image);

  return (
    <div
      className="project-card flex flex-shrink-0 items-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="container">
        <div
          className={clsx(
            "grid items-center gap-12 lg:gap-20",
            hasImage ? "lg:grid-cols-[1.1fr_0.9fr]" : "max-w-3xl"
          )}
        >
          {/* ── Left: text ──────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Counter + status */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/55">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                {project.company ? ` — ${project.company}` : ""}
              </span>
              <span className={clsx("inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]", statusCls)}>
                <StatusIcon className="size-3.5" />
                {statusLabel}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl leading-[1.06] tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-[3.5rem]">
              {project.title}
            </h2>

            {/* Year */}
            <p className="font-mono text-[12px] text-slate-400 dark:text-white/50">{project.year}</p>

            {/* Summary */}
            <p className="max-w-lg text-[17px] leading-relaxed text-slate-600 dark:text-slate-300">
              {project.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className={clsx("inline-flex rounded-md border px-2.5 py-1 text-[12px] font-semibold", tagPill[t])}>
                  {t}
                </span>
              ))}
            </div>

            {/* Stack */}
            {project.techStack?.length ? (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 6).map((t) => (
                    <span key={t} className="rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-[12px] text-slate-700 dark:border-white/10 dark:bg-ink-50/70 dark:text-white/85">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Link */}
            <div className="pt-1">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50 px-5 py-3 text-[14px] font-semibold text-slate-900 transition-colors hover:border-ocean-400/40 hover:bg-white dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-50 dark:hover:border-ocean-300/40"
                >
                  Open project
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-mono text-[13px] text-slate-400 dark:text-white/45">
                  <Clock className="size-4" /> Not shipped yet
                </span>
              )}
            </div>
          </div>

          {/* ── Right: image ───────────────────────────── */}
          {hasImage && (
            <div className="relative hidden lg:block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-2xl dark:border-white/8 dark:bg-ink-200">
                <Image
                  src={project.imageUrl ?? project.image!}
                  alt={`${project.title} preview`}
                  fill
                  sizes="45vw"
                  className="object-contain object-center p-4"
                  unoptimized={!!project.imageUrl}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HorizontalProjects({ items }: { items?: Project[] }) {
  const list = items?.length ? items : seedProjects;
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || isMobile) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const heading = headingRef.current;
    const bar = progressRef.current;
    if (!section || !track) return;

    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Scroll distance = (n-1) card widths
        const getDistance = () => (list.length - 1) * window.innerWidth;

        // ── Main horizontal tween ─────────────────────
        const mainTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
          },
        });

        // ── Heading fades as scroll starts ────────────
        if (heading) {
          gsap.to(heading, {
            opacity: 0,
            y: -24,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=300",
              scrub: 1,
            },
          });
        }

        // ── Progress bar ──────────────────────────────
        if (bar) {
          gsap.context(() => {
            gsap.set(bar, { scaleX: 0, transformOrigin: "left" });
            gsap.to(bar, {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${getDistance()}`,
                scrub: 1,
              },
            });
          });
        }

        // ── Per-card cinematic animations ─────────────
        const cards = track.querySelectorAll<HTMLElement>(".project-card");
        cards.forEach((card, i) => {
          gsap.set(card, { transformPerspective: 1400 });

          // ── Entry: materialises from the right ───────
          // (scrub reversal = graceful re-entry when scrolling back up)
          if (i > 0) {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                scale: 0.65,
                y: 140,
                rotateY: 28,
                filter: "blur(18px)",
              },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateY: 0,
                filter: "blur(0px)",
                ease: "expo.out",
                scrollTrigger: {
                  containerAnimation: mainTween,
                  trigger: card,
                  start: "left 98%",
                  end: "left 2%",
                  scrub: 1.8,
                },
              }
            );
          }

          // ── Exit: dissolves to the left ───────────────
          // Starts only when card centre has passed halfway — gives
          // a clean "linger then vanish" feel; reversal on scroll-up
          // means the card pulls back into focus before re-centring.
          gsap.to(card, {
            opacity: 0,
            scale: 0.65,
            y: -140,
            rotateY: -28,
            filter: "blur(18px)",
            ease: "expo.in",
            scrollTrigger: {
              containerAnimation: mainTween,
              trigger: card,
              start: "left -15%",
              end: "left -85%",
              scrub: 1.8,
            },
          });

          // ── Active index tracker ──────────────────────
          ScrollTrigger.create({
            containerAnimation: mainTween,
            trigger: card,
            start: "left 60%",
            end: "right 40%",
            onEnter: () => setActiveIdx(i),
            onEnterBack: () => setActiveIdx(i),
          });
        });
      }, section);
    })();

    return () => ctx?.revert();
  }, [list, reduced, isMobile]);

  // ── Mobile / reduced-motion: vertical stack ───────────────────────────────
  if (reduced || isMobile) {
    return (
      <section id="projects" className="relative py-20 md:py-28 lg:py-32">
        <div className="container">
          <SectionHeader
            eyebrow="Selected work"
            title="Projects that shipped"
            description="Built, deployed, and defended."
          />
          <div className="mt-16 flex flex-col gap-8">
            {list.map((p, i) => {
              const { label: statusLabel, Icon: StatusIcon, cls: statusCls } = statusMeta[p.status];
              const hasImage = !!(p.imageUrl || p.image);
              return (
                <Card key={p.slug} className="flex flex-col gap-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/55">
                      {String(i + 1).padStart(2, "0")} — {p.company}
                    </span>
                    <span className={clsx("inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]", statusCls)}>
                      <StatusIcon className="size-3" />{statusLabel}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl tracking-tight text-slate-900 dark:text-white sm:text-3xl">{p.title}</h3>
                    <p className="mt-1 font-mono text-[12px] text-slate-500 dark:text-white/50">{p.year}</p>
                  </div>
                  {hasImage && (
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-ink-200">
                      <Image src={p.imageUrl ?? p.image!} alt={`${p.title} preview`} fill sizes="100vw" className="object-contain object-center p-2" unoptimized={!!p.imageUrl} />
                    </div>
                  )}
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{p.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className={clsx("inline-flex rounded-md border px-2.5 py-1 text-[12px] font-semibold", tagPill[t])}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-2">
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition-colors hover:border-ocean-400/40 hover:bg-white dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-50 dark:hover:border-ocean-300/40">
                        Open project <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-mono text-[12px] text-slate-400"><Clock className="size-3.5" /> Coming soon</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop: GSAP-pinned horizontal scroll ────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Top progress bar */}
      <div
        ref={progressRef}
        aria-hidden
        className="absolute top-0 left-0 z-30 h-[2px] w-full bg-ocean-400/70 dark:bg-ocean-300/70"
        style={{ transformOrigin: "left", transform: "scaleX(0)" }}
      />

      {/* Heading — absolute so it overlays the track without pushing it down */}
      <div
        ref={headingRef}
        className="absolute top-0 left-0 right-0 z-20 container pt-20 pb-8 pointer-events-none"
      >
        <SectionHeader
          eyebrow="Selected work"
          title="Projects that shipped"
          description="Built, deployed, and defended."
        />
      </div>

      {/* Dot nav — right edge */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {list.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: i === activeIdx ? 16 : 6,
              width: i === activeIdx ? 4 : 4,
              opacity: i === activeIdx ? 1 : 0.35,
            }}
            transition={{ duration: 0.3 }}
            className={clsx(
              "rounded-full",
              i === activeIdx ? "bg-ocean-400 dark:bg-ocean-300" : "bg-slate-400 dark:bg-white/40"
            )}
          />
        ))}
      </div>

      {/* Track — absolutely positioned at top-left so cards fill the full 100vh */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex will-change-transform"
        style={{ width: `${list.length * 100}vw`, height: "100vh" }}
      >
        {list.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} total={list.length} />
        ))}
      </div>
    </section>
  );
}
