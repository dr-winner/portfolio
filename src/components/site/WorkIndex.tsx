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
    <div className="flex flex-col gap-14">
      <div className="work-filters flex flex-wrap gap-2">
        {chips.map((chip) => {
          const selected = active === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={selected}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 font-mono text-[12px] uppercase tracking-[0.12em] transition-all duration-[var(--dur-2)] ${
                selected
                  ? "border-[var(--signal)] bg-[color-mix(in_srgb,var(--signal)_10%,transparent)] text-[var(--signal)]"
                  : "border-[var(--line)] text-[var(--fg-muted)] hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
              }`}
              onClick={() => router.replace(chip.id === "all" ? "/work" : `/work?tag=${chip.id}`, { scroll: false })}
            >
              <span aria-hidden className={`h-1 w-1 rounded-full ${selected ? "bg-[var(--signal)]" : "bg-[var(--fg-subtle)]"}`} />
              {chip.label}
            </button>
          );
        })}
      </div>

      {active === "all" || featured.some((item) => visible(item.filters)) ? (
        <section>
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">[ Featured ]</p>
          <ul className="flex flex-col">
            {featured.filter((item) => visible(item.filters)).map((item, i) => (
              <li
                key={item.slug}
                className="group relative border-t border-[var(--line)] transition-colors duration-[var(--dur-2)] hover:bg-[color-mix(in_srgb,var(--signal)_4%,transparent)]"
              >
                <span aria-hidden className="absolute inset-y-0 left-0 w-0 border-l-2 border-[var(--signal)] transition-all duration-[var(--dur-2)] group-hover:w-3" />
                <Link href={`/work/${item.slug}`} className="block py-6 pl-4 no-underline md:pl-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.badges.map((badge) => (
                      <Badge key={badge}>{badge}</Badge>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span aria-hidden className="font-mono text-[12px] text-[var(--fg-subtle)] transition-colors group-hover:text-[var(--signal)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[length:var(--step-2)] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                      {item.title}
                    </h3>
                    <span aria-hidden className="arrow-shift ml-auto self-center font-mono text-[var(--signal)] opacity-0 transition-opacity group-hover:opacity-100">
                      ↗
                    </span>
                  </div>
                  <p className="mt-2 max-w-[68ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.card}</p>
                </Link>
              </li>
            ))}
            <li aria-hidden className="border-t border-[var(--line)]" />
          </ul>
        </section>
      ) : null}

      {active === "all" || labs.some((item) => visible(item.filters)) ? (
        <section>
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--amber)]">[ Labs ]</p>
          <ul className="flex flex-col">
            {labs.filter((item) => visible(item.filters)).map((item) => (
              <li
                key={item.slug}
                className="group relative border-t border-[var(--line)] transition-colors duration-[var(--dur-2)] hover:bg-[color-mix(in_srgb,var(--amber)_4%,transparent)]"
              >
                <span aria-hidden className="absolute inset-y-0 left-0 w-0 border-l-2 border-[var(--amber)] transition-all duration-[var(--dur-2)] group-hover:w-3" />
                <Link href={`/work/${item.slug}`} className="group inline-block py-4 pl-4 no-underline md:pl-6">
                  <span className="text-[length:var(--step-1)] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--amber)]">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[var(--fg-muted)]">{item.card}</span>
                </Link>
              </li>
            ))}
            <li aria-hidden className="border-t border-[var(--line)]" />
          </ul>
        </section>
      ) : null}

      {active === "all" ? (
        <section>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">[ Archive ]</p>
          <p className="mt-2 text-[var(--fg-muted)]">Earlier builds from before I moved into security.</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {archive.map((item) => (
              <li
                key={item.slug}
                className="console-card group rounded-[12px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)] p-5"
              >
                <div className="mb-2 flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <Badge key={badge}>{badge}</Badge>
                  ))}
                </div>
                <p className="text-[length:var(--step-0)] text-[var(--fg-muted)]">{item.title}</p>
                <p className="mt-1 text-[var(--fg-subtle)]">{item.card}</p>
                {item.link ? (
                  <a
                    href={item.link}
                    className="link-sweep mt-3 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--signal)] no-underline"
                    target="_blank"
                    rel="noreferrer"
                  >
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
