"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
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
  AI: "border-cyan-400/40 bg-cyan-50 text-cyan-900 dark:border-cyber-300/55 dark:bg-ink-200 dark:text-cyber-200",
  "Full-Stack":
    "border-emerald-400/40 bg-emerald-50 text-emerald-900 dark:border-ok-400/50 dark:bg-ink-200 dark:text-ok-400",
  Web3: "border-slate-300/80 bg-slate-100 text-slate-800 dark:border-white/25 dark:bg-ink-200 dark:text-slate-100",
};

const statusMeta = {
  live: { label: "Live", Icon: CheckCircle2, cls: "text-emerald-700 dark:text-ok-400" },
  "in-progress": { label: "In progress", Icon: Clock, cls: "text-amber-700 dark:text-signal-300" },
  upcoming: { label: "Upcoming", Icon: Hourglass, cls: "text-cyan-700 dark:text-cyber-300" },
};

// ─── Tilt card ────────────────────────────────────────────────────────────────

function TiltCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 280, damping: 30 });
  const sRotY = useSpring(rotY, { stiffness: 280, damping: 30 });

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    rotX.set(-dy * 6);
    rotY.set(dx * 6);
  }

  function onLeave() {
    rotX.set(0);
    rotY.set(0);
  }

  const { label: statusLabel, Icon: StatusIcon, cls: statusCls } =
    statusMeta[project.status];

  return (
    <motion.div
      ref={ref}
      className="h-card flex h-full w-[360px] flex-shrink-0 flex-col sm:w-[420px]"
      style={
        reduced
          ? {}
          : {
              rotateX: sRotX,
              rotateY: sRotY,
              transformPerspective: 900,
            }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Card className="flex h-full flex-col gap-5 p-6 sm:p-8">
        {/* Number + status */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/40">
            {String(index + 1).padStart(2, "0")} — {project.company}
          </span>
          <span
            className={clsx(
              "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]",
              statusCls
            )}
          >
            <StatusIcon className="size-3" />
            {statusLabel}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display text-2xl tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mt-1 font-mono text-[12px] text-slate-500 dark:text-white/40">
            {project.year}
          </p>
        </div>

        {/* Image */}
        {(project.imageUrl || project.image) && (
          <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-ink-200">
            <Image
              src={project.imageUrl ?? project.image!}
              alt={`${project.title} preview`}
              fill
              sizes="420px"
              className="object-contain object-center p-2"
              unoptimized={!!project.imageUrl}
            />
          </div>
        )}

        {/* Summary */}
        <p className="line-clamp-3 flex-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          {project.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className={clsx(
                "tech-chip inline-flex rounded-md border px-2.5 py-1 text-[12px] font-semibold",
                tagPill[t]
              )}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/35">
            Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 5).map((t) => (
              <span
                key={t}
                className="tech-chip rounded-md border border-slate-200/90 bg-white px-2.5 py-1 text-[12px] text-slate-700 dark:border-white/10 dark:bg-ink-50/70 dark:text-white/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Link */}
        <div className="mt-auto pt-2">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-[13px] font-semibold text-slate-900 transition-colors hover:border-cyber-400/40 hover:bg-white dark:border-white/12 dark:bg-white/[0.04] dark:text-slate-50 dark:hover:border-cyber-300/40"
            >
              Open project
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 font-mono text-[12px] text-slate-400">
              <Clock className="size-3.5" />
              Coming soon
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function HorizontalProjects({
  items,
}: {
  items?: Project[];
}) {
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
    if (!section || !track || !heading || !bar) return;

    let ctx: { revert: () => void } | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const getDistance = () =>
          track.scrollWidth - window.innerWidth;

        // ── Main horizontal tween ─────────────────────────────────────────
        const mainTween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.5,
            start: "top top",
            end: () => `+=${getDistance()}`,
            invalidateOnRefresh: true,
          },
        });

        // ── Heading fades out ─────────────────────────────────────────────
        gsap.to(heading, {
          opacity: 0,
          y: -20,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=280",
            scrub: 1,
          },
        });

        // ── Progress bar ──────────────────────────────────────────────────
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

        // ── Per-card animations ───────────────────────────────────────────
        const cards = track.querySelectorAll<HTMLElement>(".h-card");

        cards.forEach((card, i) => {
          if (i < 3) {
            gsap.set(card, { y: 20, scale: 0.96, opacity: 0 });
            gsap.to(card, {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                containerAnimation: mainTween,
                trigger: card,
                start: "left right",
                end: "left 55%",
                scrub: 1,
              },
            });
          } else {
            gsap.set(card, { opacity: 0 });
            gsap.to(card, {
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: {
                containerAnimation: mainTween,
                trigger: card,
                start: "left right",
                end: "left 70%",
                scrub: 1,
              },
            });
          }

          // Tech chips stagger when card is ~50% visible
          const chips = card.querySelectorAll<HTMLElement>(".tech-chip");
          if (chips.length) {
            gsap.set(chips, { opacity: 0, y: 8 });
            gsap.to(chips, {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              ease: "power2.out",
              duration: 0.4,
              scrollTrigger: {
                containerAnimation: mainTween,
                trigger: card,
                start: "left 55%",
                end: "left 30%",
                toggleActions: "play none none none",
              },
            });
          }

          // Track which card is centered
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

  // ── Fallback: vertical stack on mobile / reduced-motion ──────────────────
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
            {list.map((p, i) => (
              <TiltCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Progress bar */}
      <div
        ref={progressRef}
        aria-hidden
        className="absolute top-0 left-0 z-10 h-[1px] w-full bg-cyber-300/70"
        style={{ transformOrigin: "left", transform: "scaleX(0)" }}
      />

      {/* Heading */}
      <div
        ref={headingRef}
        className="relative z-10 container pt-16 pb-10 md:pt-20 md:pb-14"
      >
        <SectionHeader
          eyebrow="Selected work"
          title="Projects that shipped"
          description="Built, deployed, and defended."
        />

        {/* Counter */}
        <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.22em] text-slate-500 dark:text-white/40">
          <span className="text-cyber-600 dark:text-cyber-300">
            {String(activeIdx + 1).padStart(2, "0")}
          </span>{" "}
          / {String(list.length).padStart(2, "0")}
        </p>
      </div>

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="absolute bottom-0 left-0 flex items-center gap-6 pl-[max(2rem,env(safe-area-inset-left,0px))] pr-24 will-change-transform"
        style={{ top: "auto", height: "calc(100vh - 220px)" }}
      >
        {list.map((p, i) => (
          <TiltCard key={p.slug} project={p} index={i} />
        ))}
        {/* trailing breathing room */}
        <div className="w-16 flex-shrink-0" />
      </div>

      {/* Mobile fallback hint */}
      <noscript>
        <style>{`#projects { height: auto !important; overflow: visible !important; }`}</style>
      </noscript>
    </section>
  );
}
