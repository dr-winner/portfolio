"use client";

import { useEffect, useState } from "react";

export type RailItem = {
  id: string;
  label: string;
  score?: string;
};

export function CaseRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -60% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [items]);

  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <>
      <p className="case-rail-mobile font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--signal)] lg:hidden">
        {current?.label}
        {current?.score ? ` · ${current.score}` : ""}
      </p>
      <nav className="case-rail" aria-label="On this page">
        <ol>
          {items.map((item) => {
            const on = item.id === active;
            return (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={on ? "true" : undefined} className={on ? "is-active" : undefined}>
                  <span>{item.label}</span>
                  {item.score ? <span className="font-mono tabular-nums text-[var(--fg-subtle)]">{item.score}</span> : null}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
