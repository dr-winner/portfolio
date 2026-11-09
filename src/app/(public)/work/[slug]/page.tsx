import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { LlmAgentLabInspector } from "@/components/site/LlmAgentLabInspector";
import { Reveal } from "@/components/motion/Reveal";
import { getWork, publishedWork } from "@/content/work";

type Params = { slug: string };

export function generateStaticParams() {
  return publishedWork.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) return {};
  return {
    title: item.documentTitle,
    description: item.description,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: { type: "article", title: item.documentTitle, description: item.description },
  };
}

export default async function WorkCasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) notFound();
  const index = publishedWork.findIndex((entry) => entry.slug === item.slug);
  const previous = publishedWork[index - 1];
  const next = publishedWork[index + 1];

  const facts = [
    item.role ? { label: "Role", value: item.role } : null,
    { label: "Engagement", value: item.context },
    item.stack ? { label: "Stack", value: item.stack.join(", ") } : null,
    item.outcome ? { label: "Outcome", value: item.outcome } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <Reveal y={10}>
        <p className="font-mono text-[12px] tracking-[0.14em] text-[var(--fg-subtle)]">
          <Link href="/work" className="link-sweep text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
            [ WORK ]
          </Link>
          <span aria-hidden> / </span>
          <span className="text-[var(--signal)]">/{item.slug}</span>
        </p>
      </Reveal>
      <Reveal delay={80} y={20}>
        <h1 className="mt-6 max-w-[18ch] text-balance text-[length:var(--step-4)] leading-[var(--leading-tight)]">{item.title}</h1>
      </Reveal>
      <Reveal delay={160} y={14}>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>
        <div className="fx-rule mt-8 h-px w-full bg-[var(--line)]" />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,68ch)_1fr] lg:items-start">
        <div className="min-w-0">
          {item.scope ? (
            <Reveal delay={200}>
              <aside className="fx-corner console-card relative overflow-hidden rounded-[12px] border border-[var(--amber)]/50 bg-[var(--surface)] p-5">
                <div aria-hidden className="absolute inset-0 fx-dots opacity-30" />
                <p className="relative font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--amber)]">
                  [ {item.context === "Training lab" ? "SCOPE & AUTHORIZATION" : "SCOPE"} ]
                </p>
                <p className="relative mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)]">{item.scope}</p>
              </aside>
            </Reveal>
          ) : null}

          <Reveal delay={260}>
            <dl className={`grid gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-2 ${item.scope ? "mt-6" : ""}`}>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">{fact.label}</dt>
                  <dd className="mt-1 text-[var(--fg-muted)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {item.slug === "llm-agent-security-lab" ? (
            <Reveal delay={300}>
              <div className="mt-8">
                <LlmAgentLabInspector />
              </div>
            </Reveal>
          ) : null}

          <div className="mt-12 flex max-w-[68ch] flex-col gap-10">
            {item.sections.map((section, i) => (
              <Reveal key={section.id} as="section" id={section.id} delay={Math.min(i * 60, 240)} className="scroll-mt-28">
                <p className="font-mono text-[12px] tracking-[0.14em] text-[var(--fg-subtle)]">
                  [ {String(i + 1).padStart(2, "0")} ]
                </p>
                <h2 className="mt-2 text-[length:var(--step-2)] leading-[var(--leading-snug)]">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </div>

        {/* Side rail — prev / next navigation */}
        <aside className="lg:sticky lg:top-28 lg:w-[260px]">
          <Reveal delay={320}>
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">[ NAV ]</p>
            <ul className="mt-4 flex flex-col gap-3 lg:flex-col">
              {previous ? (
                <li>
                  <Link
                    href={`/work/${previous.slug}`}
                    className="console-card group block rounded-[10px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)] p-4 no-underline"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">← Previous</span>
                    <span className="mt-1 block text-[length:var(--step-0)] text-[var(--fg)] transition-colors group-hover:text-[var(--signal)]">
                      {previous.title}
                    </span>
                  </Link>
                </li>
              ) : null}
              {next ? (
                <li>
                  <Link
                    href={`/work/${next.slug}`}
                    className="console-card group block rounded-[10px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)] p-4 no-underline"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Next →</span>
                    <span className="mt-1 block text-[length:var(--step-0)] text-[var(--fg)] transition-colors group-hover:text-[var(--signal)]">
                      {next.title}
                    </span>
                  </Link>
                </li>
              ) : null}
              {item.repo ? (
                <li>
                  <a
                    href={item.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="console-card group block rounded-[10px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_62%,transparent)] p-4 no-underline"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">External</span>
                    <span className="mt-1 inline-flex items-center gap-2 text-[length:var(--step-0)] text-[var(--fg)] transition-colors group-hover:text-[var(--signal)]">
                      Repository <span aria-hidden className="arrow-shift">↗</span>
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </aside>
      </div>
    </article>
  );
}
