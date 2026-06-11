"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
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

// ─── Single fullscreen slide ───────────────────────────────────────────────────

function ProjectSlide({
  project,
  index,
  total,
  direction,
}: {
  project: Project;
  index: number;
  total: number;
  direction: 1 | -1;
}) {
  const { label: statusLabel, Icon: StatusIcon, cls: statusCls } =
    statusMeta[project.status];

  const hasImage = !!(project.imageUrl || project.image);

  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, y: direction * 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: direction * -60 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center"
    >
      <div className="container">
        <div
          className={clsx(
            "grid items-center gap-10 lg:gap-16",
            hasImage ? "lg:grid-cols-[1fr_1fr]" : "max-w-3xl"
          )}
        >
          {/* ── Left: text ─────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Counter + company + status */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/40">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                {project.company ? ` — ${project.company}` : ""}
              </span>
              <span
                className={clsx(
                  "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]",
                  statusCls
                )}
              >
                <StatusIcon className="size-3.5" />
                {statusLabel}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl leading-[1.06] tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-6xl">
              {project.title}
            </h2>

            {/* Year */}
            <p className="font-mono text-[12px] text-slate-500 dark:text-white/35">
              {project.year}
            </p>

            {/* Summary */}
            <p className="max-w-lg text-[17px] leading-relaxed text-slate-600 dark:text-slate-300">
              {project.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className={clsx(
                    "inline-flex rounded-md border px-2.5 py-1 text-[12px] font-semibold",
                    tagPill[t]
                  )}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Stack */}
            {project.techStack?.length ? (
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/35">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-[12px] text-slate-700 dark:border-white/10 dark:bg-ink-50/70 dark:text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Link */}
            <div className="pt-2">
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
                <span className="inline-flex items-center gap-2 font-mono text-[13px] text-slate-400 dark:text-white/30">
                  <Clock className="size-4" />
                  Not shipped yet
                </span>
              )}
            </div>
          </div>

          {/* ── Right: image ───────────────────────────── */}
          {hasImage && (
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-2xl dark:border-white/8 dark:bg-ink-200">
                <Image
                  src={project.imageUrl ?? project.image!}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain object-center p-4"
                  unoptimized={!!project.imageUrl}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function HorizontalProjects({ items }: { items?: Project[] }) {
  const list = items?.length ? items : seedProjects;
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Drive active index from scroll position
  useEffect(() => {
    if (reduced || isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    function onScroll() {
      const rect = section!.getBoundingClientRect();
      const scrolled = -rect.top;
      if (scrolled < 0) return;
      const idx = Math.min(
        Math.max(Math.floor(scrolled / window.innerHeight), 0),
        list.length - 1
      );
      setActiveIdx((prev) => {
        if (idx !== prev) setDirection(idx > prev ? 1 : -1);
        return idx;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [list.length, reduced, isMobile]);

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
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/40">
                      {String(i + 1).padStart(2, "0")} — {p.company}
                    </span>
                    <span className={clsx("inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]", statusCls)}>
                      <StatusIcon className="size-3" />
                      {statusLabel}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl tracking-tight text-slate-900 dark:text-white sm:text-3xl">{p.title}</h3>
                    <p className="mt-1 font-mono text-[12px] text-slate-500 dark:text-white/40">{p.year}</p>
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

  // ── Desktop: fullscreen sticky showcase ──────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ height: `${list.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section header — fades once scroll starts */}
        <motion.div
          animate={{ opacity: activeIdx === 0 ? 1 : 0, y: activeIdx === 0 ? 0 : -20 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-0 right-0 z-10 container pt-16 pb-6"
        >
          <SectionHeader
            eyebrow="Selected work"
            title="Projects that shipped"
            description="Built, deployed, and defended."
          />
        </motion.div>

        {/* Project slide */}
        <AnimatePresence mode="wait" custom={direction}>
          <ProjectSlide
            key={activeIdx}
            project={list[activeIdx]}
            index={activeIdx}
            total={list.length}
            direction={direction}
          />
        </AnimatePresence>

        {/* Dot nav — right edge */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {list.map((_, i) => (
            <div
              key={i}
              className={clsx(
                "rounded-full transition-all duration-300",
                i === activeIdx
                  ? "h-4 w-1.5 bg-ocean-400 dark:bg-ocean-300"
                  : "size-1.5 bg-slate-400/40 dark:bg-white/20"
              )}
            />
          ))}
        </div>

        {/* Progress bar — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-200/40 dark:bg-white/8">
          <motion.div
            className="h-full bg-ocean-400/70 dark:bg-ocean-300/70"
            animate={{ width: `${((activeIdx + 1) / list.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </section>
  );
}
