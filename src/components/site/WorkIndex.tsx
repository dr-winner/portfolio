"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CaseLink } from "@/components/site/CaseLink";
import { Diagram } from "@/components/site/Diagrams";
import { work, type WorkFilter } from "@/content/work";

const chips: { id: "all" | WorkFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web and API" },
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

  const shownFeatured = featured.filter((item) => visible(item.filters));
  const shownLabs = labs.filter((item) => visible(item.filters));

  return (
    <div className="flex flex-col gap-14">
      <div className="work-filters flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={active === chip.id}
            className={`h-9 rounded-full border px-3 font-mono text-[12px] uppercase tracking-[0.12em] ${
              active === chip.id ? "border-[var(--signal)] bg-[color-mix(in_srgb,var(--signal)_12%,transparent)] text-[var(--signal)]" : "border-[var(--line)] text-[var(--fg-muted)]"
            }`}
            onClick={() => router.replace(chip.id === "all" ? "/work" : `/work?tag=${chip.id}`, { scroll: false })}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {shownFeatured.length ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Featured</h2>
          <ul className="work-list flex flex-col">
            {shownFeatured.map((item) => (
              <li key={item.slug} className="work-row border-t border-[var(--line)]">
                <CaseLink href={`/work/${item.slug}`} className="group grid gap-6 py-8 no-underline lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)] lg:items-center">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {item.badges.map((badge) => (
                        <Badge key={badge}>{badge}</Badge>
                      ))}
                    </div>
                    <h3 className="text-[length:var(--step-3)] leading-[var(--leading-snug)] text-[var(--fg)]">{item.title}</h3>
                    <p className="mt-3 max-w-[62ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.card}</p>
                    <span className="mt-4 inline-block text-[var(--signal)]">Read case study</span>
                  </div>
                  <div className="work-preview" style={{ viewTransitionName: `case-${item.slug}` }}>
                    <Diagram slug={item.slug} />
                  </div>
                </CaseLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {shownLabs.length ? (
        <section>
          <h2 className="mb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Labs</h2>
          <ul className="work-list">
            {shownLabs.map((item) => (
              <li key={item.slug} className="work-row border-t border-[var(--line)]">
                <CaseLink href={`/work/${item.slug}`} className="grid gap-4 py-5 no-underline sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center">
                  <span>
                    <span className="block text-[length:var(--step-1)] text-[var(--fg)]">{item.title}</span>
                    <span className="mt-1 block text-[var(--fg-muted)]">{item.card}</span>
                  </span>
                  <Diagram slug={item.slug} />
                </CaseLink>
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
              <li key={item.slug} className="border-t border-[var(--line)] py-5">
                <div className="mb-2 flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <Badge key={badge}>{badge}</Badge>
                  ))}
                </div>
                <p className="text-[length:var(--step-0)] text-[var(--fg)]">{item.title}</p>
                <p className="mt-1 text-[var(--fg-muted)]">{item.card}</p>
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
