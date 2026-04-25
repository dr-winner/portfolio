"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { ArrowUpRight, CheckCircle2, Clock, Hourglass } from "lucide-react";
import { projects as seedProjects, type Project, type ProjectTag } from "@/content/projects";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { ScrollReveal } from "@/components/ScrollReveal";

const ALL_TAGS: (ProjectTag | "All")[] = ["All", "Security", "AI", "Full-Stack", "Web3"];

const tagPill: Record<ProjectTag, string> = {
  Security: "border-signal-300/35 bg-signal-300/[0.08] text-signal-200",
  AI: "border-cyber-300/40 bg-cyber-300/[0.08] text-cyber-100",
  "Full-Stack": "border-ok-400/35 bg-ok-400/[0.08] text-ok-300",
  Web3: "border-white/20 bg-white/[0.05] text-white/90",
};

const statusMeta = {
  live: { label: "Live", icon: CheckCircle2, className: "text-ok-400" },
  "in-progress": { label: "In progress", icon: Clock, className: "text-signal-300" },
  upcoming: { label: "Upcoming", icon: Hourglass, className: "text-cyber-300" },
} as const;

export function Projects({ items }: { items?: Project[] } = {}) {
  const [filter, setFilter] = useState<(ProjectTag | "All")>("All");
  const list = items?.length ? items : seedProjects;

  const filtered = useMemo(() => {
    if (filter === "All") return list;
    return list.filter((p) => p.tags.includes(filter));
  }, [filter, list]);

  return (
    <section id="projects" className="relative py-20 md:py-28 lg:py-32">
      <div className="container">
        <ScrollReveal from="none" fadeOut={false}>
          <SectionHeader
            eyebrow="Selected work"
            title="Projects that shipped, and work in the lab"
            description="Each row is one story: full detail on one side, the visual on the other. Scroll the page — the pair fades in together and eases out as you go."
          />
        </ScrollReveal>

        <ScrollReveal from="none" fadeOut={false} className="mt-12 md:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-3 font-sans">
            {ALL_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                className={clsx(
                  "rounded-full border px-4 py-2 text-xs font-medium tracking-tight transition-colors",
                  filter === t
                    ? "border-cyber-300/50 bg-cyber-300/10 text-white shadow-glow-sm"
                    : "border-white/10 bg-white/[0.02] text-white/55 hover:text-white hover:border-white/20"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-16 md:mt-20 space-y-20 md:space-y-24 lg:space-y-28">
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectRow key={project.slug} project={project} index={i} imageOnRight={i % 2 === 0} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProjectRow({
  project,
  index,
  imageOnRight,
}: {
  project: Project;
  index: number;
  imageOnRight: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Gentle in / out: stay readable longer
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [28, 0, 0, -18]);

  const Status = statusMeta[project.status];
  const StatusIcon = Status.icon;

  const detailBlock = (
    <Card className="flex h-full min-h-0 flex-col p-5 sm:p-8 md:p-10 lg:p-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
            {String(index + 1).padStart(2, "0")} — {project.company}
          </p>
          <h3 className="mt-2 font-display text-2xl md:text-3xl lg:text-[2rem] leading-[1.12] tracking-tight text-white">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-white/40">{project.year}</p>
        </div>
        <span
          className={clsx(
            "inline-flex shrink-0 self-start items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.16em]",
            Status.className
          )}
        >
          <StatusIcon className="size-3.5" />
          {Status.label}
        </span>
      </div>

      <p className="mt-7 text-base md:text-[17px] leading-relaxed text-white/70">{project.summary}</p>

      <div className="my-8 divider-hair" />

      <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Outcomes</h4>
      <ul className="mt-3 space-y-3 text-[15px] text-white/78">
        {project.results.map((r) => (
          <li key={r} className="flex gap-3">
            <span className="mt-2.5 size-1 shrink-0 rounded-full bg-cyber-300/90 shadow-glow-sm" />
            <span className="leading-relaxed">{r}</span>
          </li>
        ))}
      </ul>

      <div className="mt-9 space-y-4">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Type</h4>
        <div className="flex flex-wrap gap-2.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className={clsx(
                "inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide",
                tagPill[t]
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-7 space-y-3">
        <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Stack</h4>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2">
          {project.techStack.map((t) => (
            <li
              key={t}
              className="border-l-2 border-cyber-300/25 pl-3 text-sm text-white/70"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:border-cyber-300/40 sm:min-h-0 sm:w-auto sm:justify-start sm:py-3"
          >
            Open project
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 font-mono text-xs text-white/45">
            <Clock className="size-3.5" />
            Link when it ships
          </span>
        )}
      </div>
    </Card>
  );

  const visualBlock = (
    <Card className="h-full min-h-[280px] overflow-hidden p-0 lg:min-h-0">
      <div className="relative h-full min-h-[280px] w-full bg-ink-200/50 lg:aspect-[4/3] lg:min-h-full">
        {/* imageUrl (admin upload) first — must win over seed StaticImageData for same slug */}
        {project.imageUrl ? (
          <Image
            key={project.imageUrl}
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain object-center p-2 sm:p-3 md:p-4"
            unoptimized
            priority={false}
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain object-center p-2 sm:p-3 md:p-4"
          />
        ) : (
          <PlaceholderPreview tags={project.tags} />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-100/40 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
      </div>
    </Card>
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      layout
    >
      <div
        className={clsx(
          "grid items-stretch gap-10 md:gap-12 lg:gap-14",
          "lg:grid-cols-2"
        )}
      >
        {imageOnRight ? (
          <>
            <div className="min-w-0">{detailBlock}</div>
            <div className="min-w-0">{visualBlock}</div>
          </>
        ) : (
          <>
            <div className="min-w-0 lg:order-1">{visualBlock}</div>
            <div className="min-w-0 lg:order-2">{detailBlock}</div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function PlaceholderPreview({ tags }: { tags: ProjectTag[] }) {
  const isSecurity = tags.includes("Security");
  return (
    <div className="relative h-full w-full min-h-[280px] bg-ink-100">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(60,207,255,0.12), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <p className="text-center font-mono text-sm uppercase tracking-[0.35em] text-white/45">
          {isSecurity ? "lab · building" : "build · in progress"}
        </p>
      </div>
    </div>
  );
}
