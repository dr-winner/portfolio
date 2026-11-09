"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

export function WorkIndex() {
  const params = useSearchParams();
  const router = useRouter();
  const tag = params.get("tag");
  const active = chips.some((chip) => chip.id === tag) ? (tag as WorkFilter) : "all";
  const featured = work.filter((item) => item.kind === "case-study");
  const labs = work.filter((item) => item.kind === "lab");
  const archive = work.filter((item) => item.kind === "archive");

  function visible(filters: WorkFilter[]) {
    return active === "all" || filters.includes(active);
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="work-filters flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={active === chip.id}
            className={`h-9 rounded-full border px-3 font-mono text-[12px] uppercase tracking-[0.12em] ${
              active === chip.id ? "border-[var(--signal)] text-[var(--signal)]" : "border-[var(--line)] text-[var(--fg-muted)]"
            }`}
            onClick={() => router.replace(chip.id === "all" ? "/work" : `/work?tag=${chip.id}`, { scroll: false })}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {active === "all" || featured.some((item) => visible(item.filters)) ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Featured</h2>
          <ul className="flex flex-col">
            {featured.filter((item) => visible(item.filters)).map((item) => (
              <li key={item.slug} className="border-t border-[var(--line)] py-6">
                <Link href={`/work/${item.slug}`} className="group block no-underline">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.badges.map((badge) => (
                      <Badge key={badge}>{badge}</Badge>
                    ))}
                  </div>
                  <h3 className="text-[length:var(--step-2)] text-[var(--fg)] group-hover:underline">{item.title}</h3>
                  <p className="mt-2 max-w-[68ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.card}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {active === "all" || labs.some((item) => visible(item.filters)) ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Labs</h2>
          <ul>
            {labs.filter((item) => visible(item.filters)).map((item) => (
              <li key={item.slug} className="border-t border-[var(--line)] py-4">
                <Link href={`/work/${item.slug}`} className="no-underline">
                  <span className="text-[length:var(--step-1)] text-[var(--fg)]">{item.title}</span>
                  <span className="mt-1 block text-[var(--fg-muted)]">{item.card}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {active === "all" ? (
        <section>
          <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Archive</h2>
          <p className="mt-2 text-[var(--fg-muted)]">Earlier builds from before I moved into security.</p>
          <ul className="mt-4">
            {archive.map((item) => (
              <li key={item.slug} className="border-t border-[var(--line)] py-4 text-[var(--fg-subtle)]">
                <div className="mb-2 flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <Badge key={badge}>{badge}</Badge>
                  ))}
                </div>
                <p className="text-[length:var(--step-0)] text-[var(--fg-muted)]">{item.title}</p>
                <p className="mt-1">{item.card}</p>
                {item.link ? (
                  <a href={item.link} className="mt-2 inline-block text-[var(--signal)]" target="_blank" rel="noreferrer">
                    Live demo
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
