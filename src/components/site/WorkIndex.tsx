"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { CaseDiagram, type CaseDiagramVariant } from "@/components/site/CaseDiagram";
import { SpotlightCard } from "@/components/site/SpotlightCard";
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

  const shownCount =
    featured.filter((item) => visible(item.filters)).length +
    labs.filter((item) => visible(item.filters)).length +
    (active === "all" ? archive.length : 0);

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
    <div ref={rootRef} className="flex flex-col gap-16">
      <div className="flex flex-col gap-4 border-y border-[var(--line)] py-4 sm:flex-row sm:items-center sm:justify-between">
        <div ref={chipsRef} className="work-filters relative flex flex-wrap gap-1.5" role="group" aria-label="Filter work by discipline">
          <span
            aria-hidden
            data-pill
            className="pointer-events-none absolute left-0 top-0 rounded-full border border-[var(--signal)]/40 bg-[var(--signal-soft)]"
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
                className={`relative z-10 inline-flex h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors duration-[var(--dur-2)] ${
                  selected
                    ? "border-transparent text-[var(--signal)]"
                    : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
          {shownCount} {shownCount === 1 ? "entry" : "entries"}
        </p>
      </div>

      {featured.some((item) => visible(item.filters)) ? (
        <section aria-labelledby="work-featured">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="work-featured" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
              Case studies
            </h2>
            <span className="font-mono text-[10.5px] text-[var(--fg-subtle)]">
              {String(featured.filter((item) => visible(item.filters)).length).padStart(2, "0")}
            </span>
          </div>
          <ul className="mt-5 grid gap-4">
            {featured
              .filter((item) => visible(item.filters))
              .map((item, i) => (
                <li key={item.slug} data-flip={`case-${item.slug}`} className="min-w-0">
                  <SpotlightCard className="panel console-card overflow-hidden">
                    <Link
                      href={`/work/${item.slug}`}
                      className={`group grid items-stretch gap-6 p-[clamp(20px,3vw,32px)] no-underline lg:flex lg:gap-10 ${
                        i % 2 === 1 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <div className="flex min-w-0 flex-col lg:flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-mono text-[10.5px] tracking-[0.14em] text-[var(--signal)]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <Badge>{item.badges[1] ?? item.badges[0]}</Badge>
                          <span className="font-mono text-[10.5px] text-[var(--fg-subtle)]">{item.year}</span>
                        </div>

                        <h3 className="mt-4 max-w-[26ch] text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                          {item.title}
                        </h3>

                        <p className="mt-3 max-w-[54ch] text-pretty text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                          {item.outcome ?? item.card}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="inline-flex h-7 items-center rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_60%,transparent)] px-2.5 font-mono text-[10.5px] text-[var(--fg-subtle)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-muted)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                          Read the case study
                          <span aria-hidden className="arrow-shift">→</span>
                        </span>
                      </div>

                      <div className="card-diagram-wrap flex min-w-0 items-center rounded-[16px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_62%,transparent)] p-4 lg:w-[320px] lg:shrink-0">
                        <CaseDiagram
                          variant={item.slug as CaseDiagramVariant}
                          className="card-diagram h-auto w-full transition-transform duration-[var(--dur-2)]"
                        />
                      </div>
                    </Link>
                  </SpotlightCard>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {labs.some((item) => visible(item.filters)) ? (
        <section aria-labelledby="work-labs">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="work-labs" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
              Training labs
            </h2>
            <span className="font-mono text-[10.5px] text-[var(--fg-subtle)]">
              {String(labs.filter((item) => visible(item.filters)).length).padStart(2, "0")}
            </span>
          </div>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {labs
              .filter((item) => visible(item.filters))
              .map((item) => (
                <li key={item.slug} data-flip={`lab-${item.slug}`} className="min-w-0">
                  <SpotlightCard className="panel console-card h-full">
                    <Link href={`/work/${item.slug}`} className="group flex h-full flex-col p-6 no-underline">
                      <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full border border-[var(--amber)]/50 px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--amber)]">
                        <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--amber)]" />
                        Training lab
                      </span>
                      <h3 className="mt-4 text-[length:var(--step-1)] font-medium leading-[var(--leading-snug)] tracking-[-0.015em] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--amber)]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-pretty text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                        {item.card}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--amber)]">
                        Open the lab
                        <span aria-hidden className="arrow-shift">→</span>
                      </span>
                    </Link>
                  </SpotlightCard>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {active === "all" ? (
        <section aria-labelledby="work-archive">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="work-archive" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
              Earlier builds
            </h2>
            <span className="font-mono text-[10.5px] text-[var(--fg-subtle)]">
              {String(archive.length).padStart(2, "0")}
            </span>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((item) => {
              const inner = (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[14px] font-medium leading-snug text-[var(--fg)]">{item.title}</h3>
                    <span className="shrink-0 font-mono text-[10.5px] text-[var(--fg-subtle)]">{item.year}</span>
                  </div>
                  <p className="mt-2 text-pretty text-[12.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                    {item.card}
                  </p>
                  {item.link ? (
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                      Live demo
                      <span aria-hidden className="arrow-shift">↗</span>
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={item.slug} data-flip={`archive-${item.slug}`} className="min-w-0">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] p-5 no-underline transition-colors duration-[var(--dur-2)] hover:border-[var(--line-strong)]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] p-5">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {shownCount === 0 ? (
        <p className="panel px-5 py-8 text-center text-[13.5px] text-[var(--fg-muted)]">
          Nothing published in this discipline yet. Choose another filter.
        </p>
      ) : null}
    </div>
  );
}
