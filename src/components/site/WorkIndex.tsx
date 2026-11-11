"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { ProjectVisual } from "@/components/site/ProjectVisual";
import { Badge } from "@/components/ui/Badge";
import { work, type WorkFilter } from "@/content/work";

const chips: { id: "all" | WorkFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web and API" },
  { id: "ai", label: "AI and LLM" },
  { id: "cloud", label: "Cloud" },
  { id: "threat", label: "Threat modeling" },
  { id: "labs", label: "Labs" },
];

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function WorkIndex() {
  const router = useRouter();
  /* Filter state lives here, not in useSearchParams(): that hook suspends
     the prerender, so the whole index only mounted after hydration and
     shoved the footer down late (the one layout shift on this page). A
     mount effect reads the search string directly and honours a shareable
     ?tag= link without making the page stream. */
  const [active, setActive] = useState<"all" | WorkFilter>("all");

  const rootRef = useRef<HTMLDivElement | null>(null);
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const lastRects = useRef<Map<string, DOMRect>>(new Map());
  const pillArmed = useRef(false);

  const featured = work.filter((item) => item.kind === "case-study");
  const labs = work.filter((item) => item.kind === "lab");
  const archive = work.filter((item) => item.kind === "archive");

  function visible(filters: WorkFilter[]) {
    return active === "all" || filters.includes(active);
  }

  /* ── Filter chip pill: one measured highlight that slides between chips ── */
  const placePill = useCallback(() => {
    const container = chipsRef.current;
    const pill = container?.querySelector<HTMLSpanElement>("[data-pill]");
    if (!container || !pill) return;
    const btn = container.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!btn) {
      pill.style.opacity = "0";
      return;
    }
    const c = container.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    pill.style.opacity = "1";
    pill.style.width = `${Math.round(r.width)}px`;
    pill.style.height = `${Math.round(r.height)}px`;
    pill.style.transform = `translate(${Math.round(r.left - c.left)}px, ${Math.round(r.top - c.top)}px)`;
    if (!pillArmed.current) {
      pill.dataset.armed = "true";
      pillArmed.current = true;
    }
  }, []);

  /* Deep link support: honour a shareable ?tag= on arrival. Runs after
     hydration, so the prerendered page stays complete and static. */
  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (tag && chips.some((chip) => chip.id === tag)) setActive(tag as WorkFilter);
  }, []);

  /* Pill position is measured pre-paint (useLayoutEffect) so the highlight
     never paints unpositioned or flashes at the top-left corner. */
  useLayoutEffect(() => {
    placePill();
    window.addEventListener("resize", placePill);
    return () => window.removeEventListener("resize", placePill);
  }, [active, placePill]);

  /* ── FLIP: items that survive a filter change slide to their new slot ──── */
  function onChipClick(e: MouseEvent<HTMLButtonElement>) {
    const id = e.currentTarget.dataset.chip as "all" | WorkFilter;
    if (id === active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lastRects.current = new Map();
    } else {
      const map = new Map<string, DOMRect>();
      rootRef.current?.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
        map.set(el.getAttribute("data-flip") ?? "", el.getBoundingClientRect());
      });
      lastRects.current = map;
    }
    router.replace(id === "all" ? "/work" : `/work?tag=${id}`, { scroll: false });
    setActive(id);
  }

  useLayoutEffect(() => {
    const before = lastRects.current;
    lastRects.current = new Map();
    if (before.size === 0) return;
    let entering = 0;
    rootRef.current?.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const key = el.getAttribute("data-flip") ?? "";
      const from = before.get(key);
      const to = el.getBoundingClientRect();
      const dprMatch = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (dprMatch.matches) return;
      if (from) {
        const dx = Math.round(from.left - to.left);
        const dy = Math.round(from.top - to.top);
        if (dx || dy) {
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
            { duration: 320, easing: EASE },
          );
        }
      } else {
        const delay = Math.min(entering++ * 55, 220);
        el.animate(
          [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
          { duration: 380, delay, easing: EASE, fill: "backwards" },
        );
      }
    });
  }, [active]);

  return (
    <div ref={rootRef} className="flex flex-col gap-14">
      <div ref={chipsRef} className="work-filters relative flex flex-wrap gap-1.5">
        <span
          aria-hidden
          data-pill
          className="pointer-events-none absolute left-0 top-0 rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)]"
        />
        {chips.map((chip) => {
          const selected = active === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={selected}
              data-chip={chip.id}
              onClick={onChipClick}
              className={`relative z-10 inline-flex h-11 items-center gap-2 rounded-full border px-3.5 font-mono text-[12px] uppercase tracking-[0.06em] transition-colors duration-[var(--dur-2)] ${
                selected
                  ? "border-[var(--signal)] text-[var(--signal)]"
                  : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {featured.some((item) => visible(item.filters)) ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
            Featured case studies
          </h2>
          <ul className="flex flex-col gap-4">
            {featured
              .filter((item) => visible(item.filters))
              .map((item, i) => {
                const badge = item.badges.find((entry) => !item.title.toLowerCase().includes(entry.toLowerCase())) ?? item.badges[0];
                return (
                <li
                  key={item.slug}
                  data-flip={`case-${item.slug}`}
                >
                  <Link
                    href={`/work/${item.slug}`}
                    data-tilt=""
                    className={`tilt-row group grid grid-cols-1 items-stretch gap-6 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4 no-underline lg:flex lg:items-stretch lg:gap-8 ${
                      i % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="min-w-0 lg:flex lg:flex-1 lg:flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{badge}</Badge>
                        <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
                      </div>
                      <h3
                        className="mt-3 text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--fg-strong)] lg:min-h-[2em]"
                        style={{ viewTransitionName: `work-title-${item.slug}` }}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2 text-pretty text-[14px] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
                        {item.outcome ?? item.card}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="inline-flex h-6 items-center rounded-full border border-[var(--line)] px-2.5 text-[12px] text-[var(--fg-subtle)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)] lg:mt-auto lg:pt-4">
                        Read case study
                        <span aria-hidden className="arrow-shift">
                          →
                        </span>
                      </span>
                    </div>
                    <div className="depth-visual overflow-visible rounded-[12px] bg-[var(--bg-deep)] lg:w-[340px] lg:shrink-0" style={{ viewTransitionName: `work-${item.slug}` }}>
                      <ProjectVisual slug={item.slug} />
                    </div>
                  </Link>
                </li>
                );
              })}
          </ul>
        </section>
      ) : null}

      {labs.some((item) => visible(item.filters)) ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
            Training labs
          </h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {labs
              .filter((item) => visible(item.filters))
              .map((item) => (
                <li key={item.slug} data-flip={`lab-${item.slug}`}>
                  <Link
                    href={`/work/${item.slug}`}
                    data-tilt=""
                    className="tilt-row group flex h-full flex-col rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline"
                  >
                    <div className="depth-visual mb-4 overflow-visible rounded-[12px] bg-[var(--bg-deep)]" style={{ viewTransitionName: `work-${item.slug}` }}>
                      <ProjectVisual slug={item.slug} />
                    </div>
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex h-6 items-center rounded-full border border-[var(--amber)]/60 px-2.5 font-mono text-[12px] uppercase tracking-[0.06em] text-[var(--amber)]">
                        Training lab
                      </span>
                      <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
                    </span>
                    <h3 className="mt-3 text-[length:var(--step-1)] font-medium leading-[var(--leading-tight)] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--amber)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-pretty text-[14px] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
                      {item.card}
                    </p>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {active === "all" ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] font-normal uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
            Archive
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((item) => {
              const inner = (
                <>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[length:var(--step-0)] font-medium text-[var(--fg)]">{item.title}</h3>
                    <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
                  </div>
                  <p className="mt-2 text-pretty text-[14px] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
                    {item.card}
                  </p>
                  {item.link ? (
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                      Live demo
                      <span aria-hidden className="arrow-shift">
                        ↗
                      </span>
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={item.slug} data-flip={`archive-${item.slug}`}>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group block h-full rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline transition-colors duration-[var(--dur-2)] hover:border-[var(--line-strong)]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="h-full rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
