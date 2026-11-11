import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { Badge } from "@/components/ui/Badge";
import { CaseFigure } from "@/components/site/CaseFigure";
import { CaseToc } from "@/components/site/CaseToc";
import { FigurePlay } from "@/components/site/FigurePlay";
import { LlmAgentLabInspector } from "@/components/site/LlmAgentLabInspector";
import { Reveal } from "@/components/motion/Reveal";
import { ATTACK_SCENARIOS } from "@/lab/llm-agent-security/engine";
import { getWork, publishedWork } from "@/content/work";

type Params = { slug: string };

export function generateStaticParams() {
  return publishedWork.map((item) => ({ slug: item.slug }));
}

/* Titles may carry a bracketed qualifier, e.g. "Healthcare Portal Pentest
   (NetworkWalks Training Lab)". The qualifier becomes the hero subtitle. */
function splitTitle(title: string): { main: string; sub: string | null } {
  const match = /^(.*?)\s*\((.+)\)\s*$/.exec(title);
  return match ? { main: match[1], sub: match[2] } : { main: title, sub: null };
}

/* The attack-paths section is written as five numbered paragraphs:
   "01. Title (CVSS 8.1 High, LLM01 / LLM06): detail". Parse them into table
   rows at build time; if a paragraph does not fit the shape, fall back to
   prose so no fact is ever dropped. */
type Finding = { id: string; title: string; cvss: string; severity: string; refs: string; detail: string };
const FINDING_RE = /^(\d{2})\. (.+?) \(CVSS ([\d.]+) (\w+), (.+?)\): ([\s\S]+)$/;

function parseFindings(paragraphs: string[]): Finding[] | null {
  const rows: Finding[] = [];
  for (const paragraph of paragraphs) {
    const match = FINDING_RE.exec(paragraph.trim());
    if (!match) return null;
    rows.push({ id: match[1], title: match[2], cvss: match[3], severity: match[4], refs: match[5], detail: match[6] });
  }
  return rows.length > 0 ? rows : null;
}

function FindingsTable({ findings }: { findings: Finding[] }) {
  return (
    <div className="findings-scroll mt-6">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--line)]">
            {["ID", "Finding", "Severity", "CVSS v3.1", "Status"].map((h) => (
              <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id} className="border-b border-[var(--line)] last:border-b-0 align-top">
              <td className="px-4 py-4 font-mono text-[12px] text-[var(--fg-subtle)]">{finding.id}</td>
              <td className="min-w-[260px] px-4 py-4">
                <p className="text-[13.5px] font-medium leading-[var(--leading-snug)] text-[var(--fg)]">{finding.title}</p>
                <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{finding.detail}</p>
                <p className="mt-1.5 font-mono text-[11px] text-[var(--fg-subtle)]">{finding.refs}</p>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                    finding.severity === "High"
                      ? "border-[var(--amber)]/60 text-[var(--amber)]"
                      : "border-[var(--line-strong)] text-[var(--fg-muted)]"
                  }`}
                >
                  {finding.severity}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-4 font-mono text-[12px] text-[var(--fg)]">{finding.cvss}</td>
              <td className="px-4 py-4">
                <span className="inline-flex whitespace-nowrap rounded-full border border-[var(--signal)]/50 px-2.5 py-0.5 font-mono text-[11px] text-[var(--signal)]">
                  Blocked in CI
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
    twitter: { card: "summary_large_image", title: item.documentTitle, description: item.description },
  };
}

/* Build-time syntax highlighting for the lab verifier's enforced-control
   snippets (shiki, section 2 + 5.3). Runs during static generation only. */
async function highlightedSnippets() {
  const entries = await Promise.all(
    ATTACK_SCENARIOS.map(async (scenario) => {
      try {
        return [
          scenario.id,
          await codeToHtml(scenario.controlSnippet, {
            lang: "ts",
            themes: { light: "vitesse-light", dark: "vitesse-dark" },
            defaultColor: false,
          }),
        ] as const;
      } catch {
        return [scenario.id, ""] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

export default async function WorkCasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) notFound();

  const index = publishedWork.findIndex((entry) => entry.slug === item.slug);
  const previous = publishedWork[index - 1];
  const next = publishedWork[index + 1];

  const { main, sub } = splitTitle(item.title);
  const highlights = item.slug === "llm-agent-security-lab" ? await highlightedSnippets() : undefined;

  const meta = [
    { label: "Role", value: item.role },
    { label: "Scope", value: item.context },
    { label: "Stack", value: item.stack?.join(" · ") },
    { label: "Year", value: item.year },
  ].filter((entry): entry is { label: string; value: string } => Boolean(entry.value));

  return (
    <article className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-[var(--space-2xl)]">
      {/* ── Hero: breadcrumb, two-line title, tags, one meta bar ─────────── */}
      <Reveal y={10}>
        <p className="flex items-baseline gap-1.5 font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">
          <Link href="/work" className="link-sweep shrink-0 text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
            Work
          </Link>
          <span aria-hidden className="shrink-0">/</span>
          <span className="min-w-0 truncate">{item.title}</span>
        </p>
      </Reveal>
      <Reveal delay={80} y={20}>
        <h1
          className="mt-6 max-w-[24ch] text-balance text-[length:var(--step-4)] font-semibold leading-[1.05] tracking-[-0.03em]"
          style={{ viewTransitionName: `work-title-${item.slug}` }}
        >
          {main}
        </h1>
        {sub ? <p className="mt-3 text-[length:var(--step-1)] text-[var(--fg-muted)]">{sub}</p> : null}
      </Reveal>
      <Reveal delay={160} y={12}>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>
        {/* One entry per line on mobile so long stack and scope values never
            break mid-word; horizontal wrap from sm up. */}
        <dl className="mt-8 grid grid-cols-1 gap-y-3 border-y border-[var(--line)] py-4 sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-10 sm:gap-y-3">
          {meta.map((entry) => (
            <div key={entry.label} className="min-w-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">{entry.label}</dt>
              <dd className="mt-1 text-[13.5px] text-[var(--fg-muted)]">{entry.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* ── Large per-case diagram, always the final static drawing ─────── */}
      <div className="case-figure mt-10">
        <FigurePlay slug={item.slug}>
          <CaseFigure slug={item.slug} />
        </FigurePlay>
      </div>

      {/* ── Two-column reading layout: sticky TOC + body (section 5.3) ──── */}
      <div className="mt-14 grid grid-cols-1 gap-12 min-[1100px]:grid-cols-[230px_minmax(0,1fr)] min-[1100px]:gap-14">
        <aside className="min-w-0 self-start min-[1100px]:sticky min-[1100px]:top-28">
          {/* The TOC is a desktop reading aid: it stays out of the narrow
              flow below 1100px. */}
          <div className="hidden min-[1100px]:block">
            <CaseToc sections={item.sections.map((section) => ({ id: section.id, heading: section.heading }))} />
          </div>
          {item.repo ? (
            <a
              href={item.repo}
              target="_blank"
              rel="noreferrer"
              className="group mt-8 block rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-4 no-underline"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Repository</span>
              <span className="mt-1 block break-all font-mono text-[13px] text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                {new URL(item.repo).pathname.split("/").filter(Boolean).slice(0, 2).join("/")}
                <span aria-hidden className="arrow-shift ml-1.5 inline-block">↗</span>
              </span>
            </a>
          ) : null}
        </aside>

        <div className="min-w-0">
          {item.scope ? (
            <Reveal delay={240} y={10}>
              <aside className="rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--bg-raised)] p-5">
                <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--amber)]">
                  {item.context === "Training lab" ? "Scope and authorization" : "Scope"}
                </p>
                <p className="mt-3 text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)]">{item.scope}</p>
              </aside>
            </Reveal>
          ) : null}

          {item.slug === "llm-agent-security-lab" ? (
            <Reveal delay={280} y={10} className="mt-10">
              <LlmAgentLabInspector highlighted={highlights} />
            </Reveal>
          ) : null}

          <Reveal as="div" delay={300} y={0} className="mt-10 flex max-w-[74ch] flex-col gap-10">
            {item.sections.map((section, i) => {
              const findings = item.slug === "llm-agent-security-lab" && section.id === "findings-and-controls"
                ? parseFindings(section.paragraphs)
                : null;
              return (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <p aria-hidden className="font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.01em]">
                    {section.heading}
                  </h2>
                  {findings ? (
                    <FindingsTable findings={findings} />
                  ) : (
                    section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-3 text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]"
                      >
                        {paragraph}
                      </p>
                    ))
                  )}
                </section>
              );
            })}
          </Reveal>

          {/* ── Prev / next case-study cards at the end of the body ───────── */}
          <Reveal delay={60} y={12}>
            <nav aria-label="More case studies" className="mt-16 grid gap-4 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
              {previous ? (
                <Link
                  href={`/work/${previous.slug}`}
                  className="group rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Previous</span>
                  <span className="mt-2 block text-[length:var(--step-0)] font-medium text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                    {previous.title}
                  </span>
                </Link>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className={`group rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline sm:text-right ${
                    previous ? "" : "sm:col-span-2"
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Next</span>
                  <span className="mt-2 block text-[length:var(--step-0)] font-medium text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
