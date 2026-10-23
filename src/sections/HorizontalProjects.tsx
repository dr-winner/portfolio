"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { ArrowUpRight, Clock } from "lucide-react";
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
  Pentest:
    "border-rose-400/40 bg-rose-50 text-rose-900 dark:border-threat-300/50 dark:bg-ink-200 dark:text-threat-200",
  "Web Security":
    "border-cyan-400/40 bg-cyan-50 text-cyan-900 dark:border-ocean-300/55 dark:bg-ink-200 dark:text-ocean-200",
  Recon:
    "border-violet-400/40 bg-violet-50 text-violet-900 dark:border-violet-300/50 dark:bg-ink-200 dark:text-violet-200",
};

const FEATURED_PROJECT_ORDER = [
  "healthcare-pentest-case-study",
  "aws-threat-detection-lab",
  "ghostpass",
  "osint-and-network-recon-assessment",
  "cryptanalysis-and-hash-recovery-assessment",
  "proof9",
];
const OTHER_BUILD_ORDER = ["aix-market-analyzer", "motifi-ai"];
const REPORT_PROJECTS = new Set([
  "healthcare-pentest-case-study",
  "osint-and-network-recon-assessment",
  "cryptanalysis-and-hash-recovery-assessment",
]);

function projectHref(project: Project) {
  return project.link ?? project.repo;
}

function projectActionLabel(project: Project) {
  if (REPORT_PROJECTS.has(project.slug)) return "Read report";
  return project.repo ? "View source" : "Open project";
}

function progressLabel(project: Project) {
  if (project.status === "in-progress") return "In progress";
  if (project.status === "upcoming") return "Coming soon";
  return null;
}

function TerminalAuditPreview({ project }: { project: Project }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-[#090d16] p-5 shadow-2xl dark:border-white/10 dark:bg-[#06080d] flex flex-col justify-between">
      {/* Chrome header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-threat-500/80" />
          <span className="size-2.5 rounded-full bg-signal-300/80" />
          <span className="size-2.5 rounded-full bg-ok-400/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400 dark:text-white/60">
            ~ /audit/{project.slug} - zsh
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ocean-400 dark:text-ocean-300">
          TLP:CLEAR · VERIFIED
        </span>
      </div>

      {/* Terminal audit body */}
      <div className="my-auto space-y-2.5 py-3 font-mono text-xs">
        <p className="text-[11px] text-slate-400 dark:text-white/50">
          <span className="text-ok-400">$</span> audit --scope <span className="text-amber-300">&quot;{project.company}&quot;</span> --target <span className="text-ocean-300">&quot;{project.slug}&quot;</span>
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/40">
          Key Findings &amp; Outcomes:
        </p>
        <div className="space-y-2">
          {project.results?.slice(0, 4).map((res, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-200 dark:text-slate-300 text-[11px] leading-relaxed">
              <span className="text-ocean-400 shrink-0 font-semibold">[0{i + 1}]</span>
              <span className="line-clamp-2">{res}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal footer */}
      <div className="flex items-center justify-between border-t border-white/[0.08] pt-2.5 text-[10px] font-mono text-slate-400 dark:text-white/50">
        <span className="truncate">Status: All exploit chains &amp; patches verified</span>
        <span className="shrink-0 text-ok-400">● 100% PASS</span>
      </div>
    </div>
  );
}

// ─── Full-width project card ───────────────────────────────────────────────────

function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const hasImage = !!(project.imageUrl || project.image);
  const href = projectHref(project);
  const pendingStatus = progressLabel(project);

  return (
    <div
      className="project-card flex flex-shrink-0 items-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-20">
          {/* ── Left: text ──────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Counter + status */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/55">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                {project.company ? ` · ${project.company}` : ""}
              </span>
              {pendingStatus && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-700 dark:text-signal-300">
                  <Clock className="size-3.5" />
                  {pendingStatus}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display text-4xl leading-[1.06] tracking-tight text-slate-900 dark:text-white sm:text-5xl xl:text-[3.5rem]">
              {project.title}
            </h2>

            {/* Year */}
            {project.year ? (
              <p className="font-mono text-[12px] text-slate-400 dark:text-white/50">{project.year}</p>
            ) : null}

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
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/50">Chips</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span key={t} className="rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-[12px] text-slate-700 dark:border-white/10 dark:bg-ink-50/70 dark:text-white/85">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Link */}
            <div className="pt-1">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50 px-5 py-3 text-[14px] font-semibold text-slate-900 transition-colors hover:border-ocean-400/40 hover:bg-white dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-50 dark:hover:border-ocean-300/40"
                >
                  {projectActionLabel(project)}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 font-mono text-[13px] text-slate-400 dark:text-white/45">
                  <Clock className="size-4" />
                  {project.slug === "healthcare-pentest-case-study"
                    ? "Report link pending review"
                    : pendingStatus ?? "No public link yet"}
                </span>
              )}
            </div>
          </div>

          {/* ── Right: image or terminal audit preview ───────────── */}
          <div className="relative hidden lg:block">
            {hasImage ? (
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
            ) : (
              <TerminalAuditPreview project={project} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OtherBuilds({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="relative py-16 md:py-20">
      <div className="container">
        <SectionHeader
          eyebrow="Selected software work"
          title="Other builds"
          description="A smaller selection from my AI, Web3, and product engineering work."
        />
        <div
          className={clsx(
            "mt-10 grid gap-6",
            projects.length === 1
              ? "mx-auto max-w-lg"
              : projects.length === 2
                ? "mx-auto max-w-4xl md:grid-cols-2"
                : "md:grid-cols-2 xl:grid-cols-3"
          )}
        >
          {projects.map((project) => {
            const href = projectHref(project);
            return (
              <Card key={project.slug} className="flex h-full flex-col gap-4 p-5 md:p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-white/55">
                    {project.year} · {project.company}
                  </p>
                  <h3 className="mt-2 font-display text-xl tracking-tight text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-white/75">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={clsx("inline-flex rounded-md border px-2 py-0.5 text-[10px] font-semibold", tagPill[tag])}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-ocean-500 dark:text-white/80 dark:hover:text-ocean-300"
                  >
                    {projectActionLabel(project)}
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HorizontalProjects({ items }: { items?: Project[] }) {
  const allProjects = items?.length ? items : seedProjects;
  const { list, otherBuilds } = useMemo(() => {
    const bySlug = new Map(allProjects.map((project) => [project.slug, project]));
    return {
      list: FEATURED_PROJECT_ORDER.flatMap((slug) => {
        const project = bySlug.get(slug);
        return project ? [project] : [];
      }),
      otherBuilds: OTHER_BUILD_ORDER.flatMap((slug) => {
        const project = bySlug.get(slug);
        return project ? [project] : [];
      }),
    };
  }, [allProjects]);
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
        // One timeline per card spans the card's full travel distance
        // (enters from right → centres → exits to left) so there are
        // zero gaps between entry and exit: no blank-screen moments
        // in either scroll direction.
        const cards = track.querySelectorAll<HTMLElement>(".project-card");
        cards.forEach((card, i) => {
          gsap.set(card, { transformPerspective: 1400 });

          if (i === 0) {
            // First card is already visible: only needs an exit tween.
            gsap.to(card, {
              opacity: 0, scale: 0.7, y: -120, rotateY: -22, filter: "blur(14px)",
              ease: "expo.in",
              scrollTrigger: {
                containerAnimation: mainTween,
                trigger: card,
                start: "left 5%",
                end: "right 5%",
                scrub: 1.6,
              },
            });
          } else {
            // Cards 2–N: unified entry → linger → exit timeline.
            // start = card just entering viewport from the right
            // end   = card fully off-screen to the left
            const tl = gsap.timeline({
              scrollTrigger: {
                containerAnimation: mainTween,
                trigger: card,
                start: "left 100%",
                end: "right 0%",
                scrub: 1.6,
              },
            });

            // First half: entry (card travels from off-right to centre)
            tl.fromTo(
              card,
              { opacity: 0, scale: 0.68, y: 130, rotateY: 24, filter: "blur(16px)" },
              { opacity: 1, scale: 1,    y: 0,   rotateY: 0,  filter: "blur(0px)",
                ease: "expo.out", duration: 1 }
            );
            // Second half: exit (card travels from centre to off-left)
            tl.to(card, {
              opacity: 0, scale: 0.68, y: -130, rotateY: -24, filter: "blur(16px)",
              ease: "expo.in", duration: 1,
            });
          }

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
      <>
        <section id="projects" className="relative py-20 md:py-28 lg:py-32">
        <div className="container">
          <SectionHeader
            eyebrow="Ethical hacking · pentesting · AppSec"
            title="Security work"
            description="Tested, documented, and written up so it can be fixed."
          />
          <div className="mt-16 flex flex-col gap-8">
            {list.map((p, i) => {
              const hasImage = !!(p.imageUrl || p.image);
              const href = projectHref(p);
              const pendingStatus = progressLabel(p);
              return (
                <Card key={p.slug} className="flex flex-col gap-5 p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/55">
                      {String(i + 1).padStart(2, "0")} · {p.company}
                    </span>
                    {pendingStatus ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-amber-700 dark:text-signal-300">
                        <Clock className="size-3" />{pendingStatus}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl tracking-tight text-slate-900 dark:text-white sm:text-3xl">{p.title}</h3>
                    {p.year ? (
                      <p className="mt-1 font-mono text-[12px] text-slate-500 dark:text-white/50">{p.year}</p>
                    ) : null}
                  </div>
                  {hasImage ? (
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-ink-200">
                      <Image src={p.imageUrl ?? p.image!} alt={`${p.title} preview`} fill sizes="100vw" className="object-contain object-center p-2" unoptimized={!!p.imageUrl} />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200/80 bg-slate-900 p-3.5 font-mono text-xs dark:border-white/10 dark:bg-[#07090e]">
                      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 text-[10px] text-slate-400 dark:text-white/50">
                        <span>~ /audit/{p.slug}</span>
                        <span className="text-ok-400">● VERIFIED</span>
                      </div>
                      <div className="space-y-1.5">
                        {p.results?.slice(0, 3).map((res, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                            <span className="text-ocean-400 shrink-0 font-semibold">[0{idx + 1}]</span>
                            <span className="line-clamp-2">{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="flex-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{p.summary}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className={clsx("inline-flex rounded-md border px-2.5 py-1 text-[12px] font-semibold", tagPill[t])}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-2">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition-colors hover:border-ocean-400/40 hover:bg-white dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-50 dark:hover:border-ocean-300/40">
                        {projectActionLabel(p)} <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-mono text-[12px] text-slate-400"><Clock className="size-3.5" />{p.slug === "healthcare-pentest-case-study" ? "Report link pending review" : pendingStatus ?? "No public link yet"}</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        </section>
        <OtherBuilds projects={otherBuilds} />
      </>
    );
  }

  // ── Desktop: GSAP-pinned horizontal scroll ────────────────────────────────
  return (
    <>
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

      {/* Heading: absolute so it overlays the track without pushing it down */}
      <div
        ref={headingRef}
        className="absolute top-0 left-0 right-0 z-20 container pt-20 pb-8 pointer-events-none"
      >
        <SectionHeader
          eyebrow="Ethical hacking · pentesting · AppSec"
          title="Security work"
          description="Tested, documented, and written up so it can be fixed."
        />
      </div>

      {/* Dot nav: right edge */}
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

      {/* Track: absolutely positioned at top-left so cards fill the full 100vh */}
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
      <OtherBuilds projects={otherBuilds} />
    </>
  );
}
