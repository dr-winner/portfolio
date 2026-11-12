import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import { Badge } from "@/components/ui/Badge";
import { CaseFigure } from "@/components/site/CaseFigure";
import { CaseToc } from "@/components/site/CaseToc";
import { LlmAgentLabInspector } from "@/components/site/LlmAgentLabInspector";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
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
          <tr className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_42%,transparent)]">
            {["ID", "Finding", "Severity", "CVSS v3.1", "Status"].map((h) => (
              <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-subtle)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {findings.map((finding) => (
            <tr key={finding.id} className="border-b border-[var(--line)] align-top last:border-b-0">
              <td className="px-4 py-4 font-mono text-[11px] text-[var(--signal)]">{finding.id}</td>
              <td className="min-w-[260px] px-4 py-4">
                <p className="text-[13.5px] font-medium leading-[var(--leading-snug)] text-[var(--fg)]">{finding.title}</p>
                <p className="mt-1.5 max-w-[52ch] text-[12.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{finding.detail}</p>
                <p className="mt-1.5 font-mono text-[10.5px] text-[var(--fg-subtle)]">{finding.refs}</p>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] ${
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
                <span className="inline-flex whitespace-nowrap rounded-full border border-[var(--signal)]/50 px-2.5 py-0.5 font-mono text-[10.5px] text-[var(--signal)]">
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
    <article className="shell pb-[clamp(72px,9vw,128px)] pt-[clamp(32px,5vh,56px)]">
      {/* ── Hero: breadcrumb, two-line title, tags, one meta bar ─────────── */}
      <Reveal y={8}>
        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
          <Link href="/work" className="link-sweep shrink-0 text-[var(--fg-muted)] no-underline hover:text-[var(--fg)]">
            Work
          </Link>
          <span aria-hidden className="shrink-0 text-[var(--line-strong)]">/</span>
          <span className="min-w-0 truncate">{item.documentTitle}</span>
        </p>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start lg:gap-14">
        <header className="min-w-0">
          <Reveal delay={60} y={10}>
            <div className="flex flex-wrap gap-2">
              {item.badges.map((badge) => (
                <Badge key={badge}>{badge}</Badge>
              ))}
            </div>
          </Reveal>
          <SplitHeadline
            as="h1"
            lines={sub ? [main, sub] : [main]}
            delay={120}
            className={`mt-5 text-[clamp(36px,5.8vw,66px)] font-medium leading-[0.98] tracking-[-0.04em] ${
              sub ? "[&>span:last-child]:text-[var(--fg-muted)]" : ""
            }`}
          />
          <Reveal delay={260} y={10}>
            <p className="mt-6 max-w-[58ch] text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              {item.description}
            </p>
          </Reveal>
          {item.outcome ? (
            <Reveal delay={320} y={10}>
              <p className="mt-5 flex max-w-[58ch] items-start gap-2.5 border-t border-[var(--line)] pt-4 text-[13px] leading-relaxed text-[var(--fg)]">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--signal)]" />
                {item.outcome}
              </p>
            </Reveal>
          ) : null}
        </header>

        <Reveal delay={220} y={12} className="min-w-0">
          <dl className="panel grid grid-cols-2 gap-x-4 gap-y-5 p-5 sm:p-6">
            {meta.map((entry) => (
              <div key={entry.label} className="min-w-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">{entry.label}</dt>
                <dd className="mt-1.5 break-words text-[12.5px] leading-[var(--leading-snug)] text-[var(--fg-muted)]">{entry.value}</dd>
              </div>
            ))}
            {item.repo ? (
              <div className="col-span-2 border-t border-[var(--line)] pt-4">
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Repository</dt>
                <dd className="mt-1.5 min-w-0">
                  <a
                    href={item.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="link-sweep inline-flex max-w-full items-center gap-1.5 break-all font-mono text-[12px] text-[var(--fg)] no-underline hover:text-[var(--signal)]"
                  >
                    {new URL(item.repo).hostname}/{new URL(item.repo).pathname.split("/").filter(Boolean).slice(0, 2).join("/")}
                    <span aria-hidden className="shrink-0">↗</span>
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </Reveal>
      </div>

      {/* ── Large per-case diagram, always the final static drawing ─────── */}
      <Reveal delay={160} y={14}>
        <div className="panel case-figure mt-12 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Figure</span>
            <span className="font-mono text-[10px] text-[var(--fg-subtle)]">{item.year}</span>
          </div>
          <CaseFigure slug={item.slug} />
        </div>
      </Reveal>

      {/* ── Two-column reading layout: sticky TOC + body (section 5.3) ──── */}
      <div className="mt-14 grid grid-cols-1 gap-12 min-[1100px]:grid-cols-[220px_minmax(0,1fr)] min-[1100px]:gap-16">
        <aside className="min-w-0 self-start min-[1100px]:sticky min-[1100px]:top-28">
          <div className="hidden min-[1100px]:block">
            <CaseToc sections={item.sections.map((section) => ({ id: section.id, heading: section.heading }))} />
          </div>
        </aside>

        <div className="min-w-0">
          {item.scope ? (
            <Reveal delay={120} y={10}>
              <aside className="panel-quiet border-l-2 border-l-[var(--amber)] p-5 sm:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--amber)]">
                  {item.context === "Training lab" ? "Scope and authorization" : "Scope"}
                </p>
                <p className="mt-3 text-pretty text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.scope}</p>
              </aside>
            </Reveal>
          ) : null}

          {item.slug === "llm-agent-security-lab" ? (
            <Reveal delay={180} y={10}>
              <LlmAgentLabInspector highlighted={highlights} />
            </Reveal>
          ) : null}

          <Reveal as="div" delay={220} y={0} className="mt-14 flex max-w-[74ch] flex-col gap-12">
            {item.sections.map((section, i) => {
              const findings = item.slug === "llm-agent-security-lab" && section.id === "findings-and-controls"
                ? parseFindings(section.paragraphs)
                : null;
              return (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="font-mono text-[10.5px] tracking-[0.14em] text-[var(--signal)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-[var(--line)]" />
                  </div>
                  <h2 className="mt-3 text-[length:var(--step-2)] font-medium leading-[var(--leading-snug)] tracking-[-0.02em]">
                    {section.heading}
                  </h2>
                  {findings ? (
                    <FindingsTable findings={findings} />
                  ) : (
                    <div className="mt-4 flex flex-col gap-4">
                      {section.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
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
                  className="group panel px-5 py-4 no-underline"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Previous</span>
                  <span className="mt-2 flex items-start justify-between gap-3 text-[13.5px] font-medium leading-snug text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                    {previous.title}
                    <span aria-hidden className="arrow-shift shrink-0">←</span>
                  </span>
                </Link>
              ) : (
                <span aria-hidden className="hidden sm:block" />
              )}
              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className={`group panel px-5 py-4 no-underline ${previous ? "" : "sm:col-span-2"}`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Next</span>
                  <span className="mt-2 flex items-start justify-between gap-3 text-[13.5px] font-medium leading-snug text-[var(--fg)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                    {next.title}
                    <span aria-hidden className="arrow-shift shrink-0">→</span>
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
