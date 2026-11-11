"use client";

import { useEffect, useRef, useState } from "react";

type TocSection = { id: string; heading: string };

/**
 * Sticky table of contents (section 5.3). Highlights the section currently
 * in the reading band using an IntersectionObserver; the bar is the same
 * hairline vocabulary as the rest of the site.
 */
export function CaseToc({ sections }: { sections: TocSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const listRef = useRef<HTMLOListElement | null>(null);
  const [mark, setMark] = useState({ y: 0, h: 24 });

  useEffect(() => {
    const headings = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inBand = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inBand[0]) setActive(inBand[0].target.id);
      },
      { rootMargin: "-110px 0px -62% 0px" },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>("[aria-current='true']");
    if (!list || !current) return;
    const listBox = list.getBoundingClientRect();
    const box = current.getBoundingClientRect();
    setMark({ y: box.top - listBox.top, h: box.height });
  }, [active, sections]);

  return (
    <nav aria-label="On this page" className="hidden min-[1100px]:block">
      <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">On this page</p>
      <div className="relative mt-3">
        <span aria-hidden className="toc-mark" style={{ transform: `translateY(${mark.y}px)`, height: mark.h }} />
      <ol ref={listRef} className="flex flex-col">
        {sections.map((section, i) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-baseline gap-2.5 border-l py-1.5 pl-3 text-[13px] no-underline transition-colors duration-[var(--dur-1)] ${
                  isActive
                    ? "border-[var(--signal)] text-[var(--fg)]"
                    : "border-[var(--line)] text-[var(--fg-muted)] hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
                } ${i > 0 ? "-ml-px" : ""}`}
              >
                <span aria-hidden className={`font-mono text-[11px] ${isActive ? "text-[var(--signal)]" : "text-[var(--fg-subtle)]"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 whitespace-normal break-words">{section.heading}</span>
              </a>
            </li>
          );
        })}
      </ol>
      </div>
    </nav>
  );
}
