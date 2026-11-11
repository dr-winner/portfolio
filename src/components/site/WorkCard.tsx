"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { Badge } from "@/components/ui/Badge";
import type { WorkItem } from "@/content/work";
import { prefersReducedMotion } from "@/lib/motion";

const labels: Record<string, string> = {
  "llm-agent-security-lab": "AI / LLM",
  "healthcare-portal-pentest-lab": "Web / API",
  "aws-threat-detection-as-code": "Cloud",
  ghostpass: "Threat modeling",
  "osint-network-recon": "Lab",
  "offline-password-recovery": "Lab",
};

export function WorkCard({ item, className = "" }: { item: WorkItem; className?: string }) {
  const [live, setLive] = useState(false);
  const ref = useRef<HTMLAnchorElement | null>(null);
  const played = useRef(false);

  function play() {
    if (prefersReducedMotion()) return;
    setLive(false);
    requestAnimationFrame(() => setLive(true));
  }

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return undefined;
    if (window.matchMedia("(pointer: fine)").matches) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          play();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const category = labels[item.slug] ?? item.badges[1] ?? item.badges[0];

  return (
    <Link
      ref={ref}
      href={`/work/${item.slug}`}
      data-tilt=""
      data-live={live ? "true" : "false"}
      onMouseEnter={() => {
        if (window.matchMedia("(pointer: fine)").matches) play();
      }}
      onFocus={() => play()}
      className={`depth-card group ${className}`}
    >
      <span aria-hidden className="depth-shadow" />
      <span aria-hidden className="depth-spot" />
      <span aria-hidden className="edge-light" />
      <div className="depth-visual" style={{ viewTransitionName: `work-${item.slug}` }}>
        <ProjectVisual slug={item.slug} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{category}</Badge>
          {item.badges.includes("Training lab") ? <Badge>Training lab</Badge> : null}
          <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
        </div>
        <h3
          className="mt-3 text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--fg-strong)]"
          style={{ viewTransitionName: `work-title-${item.slug}` }}
        >
          {item.title}
        </h3>
        <p className="mt-2 text-[16px] leading-[1.6] text-[var(--fg-muted)]">{item.card}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-4 font-mono text-[12px] tracking-[0.06em] text-[var(--signal)]">
          Read case study
          <span aria-hidden className="arrow-shift">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
