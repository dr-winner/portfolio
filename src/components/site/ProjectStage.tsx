"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CaseDiagram, type CaseDiagramVariant } from "@/components/site/CaseDiagram";
import { Badge } from "@/components/ui/Badge";

export type ProjectStageItem = {
  slug: string;
  title: string;
  year: string;
  domain: string;
  summary: string;
  risk: string;
  built: string;
  proof: string;
  tags: string[];
};

/**
 * Selected work as a stage, not a stack. On desktop the section pins and one
 * opaque card holds the frame at a time: the outgoing card scales and wipes
 * out while the next wipes in from the right. On small screens the cards
 * stick and hand over to each other, each entering behind a clip mask and
 * fading as the next one covers it. No card ever shows through another.
 */
export function ProjectStage({ items }: { items: ProjectStageItem[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || items.length === 0) return;
    let raf = 0;

    function update() {
      raf = 0;
      if (!wrap) return;
      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const box = wrap.getBoundingClientRect();
      const progress = Math.min(0.9999, Math.max(0, (-box.top + 84) / total));
      const next = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive((current) => (current === next ? current : next));
    }

    function onScroll() {
      if (!raf) raf = window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [items.length]);

  useEffect(() => {
    const wrap = mobileRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(wrap.querySelectorAll<HTMLElement>("[data-stage-card]"));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    cards.forEach((card) => {
      card.classList.add("stage-armed");
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    const wrap = mobileRef.current;
    if (!wrap) return;
    let raf = 0;

    function update() {
      raf = 0;
      if (!wrap) return;
      const cards = Array.from(wrap.querySelectorAll<HTMLElement>("[data-stage-card]"));
      if (cards.length === 0) return;
      const top = parseFloat(window.getComputedStyle(cards[0]).top) || 84;
      for (let i = 0; i < cards.length; i += 1) {
        const next = cards[i + 1];
        if (!next) {
          cards[i].style.setProperty("--leave", "0");
          continue;
        }
        const height = Math.max(1, cards[i].offsetHeight);
        const nextTop = next.getBoundingClientRect().top;
        const leave = Math.min(1, Math.max(0, (top + height - nextTop) / height));
        cards[i].style.setProperty("--leave", leave.toFixed(3));
      }
    }

    function onScroll() {
      if (!raf) raf = window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [items.length]);

  return (
    <>
      <div
        ref={wrapRef}
        className="stage-desktop"
        style={{ "--stage-count": items.length } as CSSProperties}
      >
        <div className="stage-sticky">
          <div className="stage-frame">
            {items.map((item, index) => (
              <article
                key={item.slug}
                className="stage-card"
                data-state={index === active ? "active" : "idle"}
                aria-hidden={index !== active}
              >
                <CardLink item={item} index={index} total={items.length} tabbable={index === active} />
              </article>
            ))}

            <div aria-hidden className="stage-meter">
              {items.map((item, index) => (
                <span key={item.slug} className="stage-meter-item" data-on={index === active}>
                  <span className="stage-meter-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="stage-meter-line" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={mobileRef} className="stage-mobile">
        {items.map((item, index) => (
          <article key={item.slug} className="stage-mobile-card" data-stage-card>
            <div className="stage-mobile-inner">
              <CardLink item={item} index={index} total={items.length} tabbable />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function CardLink({
  item,
  index,
  total,
  tabbable,
}: {
  item: ProjectStageItem;
  index: number;
  total: number;
  tabbable: boolean;
}) {
  return (
    <Link
      href={`/work/${item.slug}`}
      tabIndex={tabbable ? undefined : -1}
      className="stage-link group"
    >
      <div className="stage-copy">
        <div className="stage-meta">
          <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--signal)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Badge>{item.domain}</Badge>
          <span className="font-mono text-[11px] text-[var(--fg-subtle)]">{item.year}</span>
        </div>

        <h3 className="stage-title">{item.title}</h3>

        <p className="stage-summary">{item.summary}</p>

        <dl className="stage-facts">
          <div>
            <dt>Risk</dt>
            <dd>{item.risk}</dd>
          </div>
          <div>
            <dt>Built</dt>
            <dd>{item.built}</dd>
          </div>
        </dl>

        <div className="stage-proof">
          <span className="stage-proof-label">Proof</span>
          <span className="stage-proof-value">{item.proof}</span>
        </div>

        <ul className="stage-tags" aria-label="Focus areas">
          {item.tags.slice(0, 5).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <span className="stage-read">
          Read the case study
          <span aria-hidden className="arrow-shift">→</span>
        </span>
      </div>

      <div className="stage-figure">
        <div className="stage-figure-top">
          <span>Tested surface</span>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="stage-figure-art">
          <CaseDiagram variant={item.slug as CaseDiagramVariant} className="h-auto w-full" />
        </div>
        <div className="stage-figure-legend" aria-hidden>
          <span>
            <span className="stage-legend-mark" />
            Boundary
          </span>
          <span>
            <span className="stage-legend-mark is-control" />
            Control
          </span>
          <span>
            <span className="stage-legend-mark is-threat" />
            Threat
          </span>
        </div>
        <p className="stage-figure-note">Abstract map of the trust boundaries in this case.</p>
      </div>
    </Link>
  );
}
