import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { SectionLabel } from "@/components/site/SectionLabel";
import { WorkIndex } from "@/components/site/WorkIndex";
import { work } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Application security case studies, labs and builds by Richard Winner Duvor. Training labs are labelled as training labs.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const counts = {
    cases: work.filter((item) => item.kind === "case-study").length,
    labs: work.filter((item) => item.kind === "lab").length,
    archive: work.filter((item) => item.kind === "archive").length,
  };

  return (
    <div className="shell pb-[clamp(72px,9vw,128px)] pt-[clamp(40px,7vh,76px)]">
      <header className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
        <div className="min-w-0">
          <Reveal y={8}>
            <SectionLabel title="Work index" />
          </Reveal>
          <SplitHeadline
            as="h1"
            lines={["Case studies,", "labs and builds."]}
            delay={60}
            className="mt-7 text-[clamp(40px,7.2vw,82px)] font-medium leading-[0.96] tracking-[-0.045em]"
          />
          <Reveal delay={220} y={10}>
            <p className="mt-6 max-w-[54ch] text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              Each case study says where the work happened and what I was allowed to test. Training labs are marked as
              training labs.
            </p>
          </Reveal>
        </div>

        <Reveal delay={300} y={12} className="min-w-0">
          <dl className="grid grid-cols-3 divide-x divide-[var(--line)] rounded-[var(--radius-card)] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_66%,transparent)] px-2">
            {[
              { value: counts.cases, label: "Case studies" },
              { value: counts.labs, label: "Training labs" },
              { value: counts.archive, label: "Earlier builds" },
            ].map((entry) => (
              <div key={entry.label} className="px-3 py-5 text-center">
                <dt className="sr-only">{entry.label}</dt>
                <dd>
                  <span className="block font-mono text-[length:var(--step-2)] leading-none text-[var(--signal)]">
                    {String(entry.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                    {entry.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      <div className="mt-12">
        <WorkIndex />
      </div>
    </div>
  );
}
