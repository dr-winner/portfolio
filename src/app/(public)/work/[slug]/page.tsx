import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CaseRail } from "@/components/site/CaseRail";
import { Diagram } from "@/components/site/Diagrams";
import { FindingsTable } from "@/components/site/FindingsTable";
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
    openGraph: {
      type: "article",
      title: item.documentTitle,
      description: item.description,
    },
    twitter: {
      card: "summary_large_image",
      title: item.documentTitle,
      description: item.description,
      creator: "@dr_winner6",
    },
  };
}

export default async function WorkCasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getWork(slug);
  if (!item) notFound();
  const index = publishedWork.findIndex((entry) => entry.slug === item.slug);
  const previous = publishedWork[index - 1];
  const next = publishedWork[index + 1];
  const scores = new Map((item.chain ?? []).map((node) => [node.id, node.score]));
  const rail = item.sections.map((section) => ({
    id: section.id,
    label: section.heading,
    score: scores.get(section.id),
  }));

  return (
    <article className="relative">
      <div className="scroll-progress" aria-hidden />
      <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
          <Link href="/work" className="text-[var(--fg-muted)] no-underline">
            Work
          </Link>
          {" / "}
          {item.title}
        </p>
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)]">
          <div>
            <h1 className="max-w-[18ch] text-balance text-[length:var(--step-4)] leading-[var(--leading-tight)]">{item.title}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.badges.map((badge) => (
                <Badge key={badge}>{badge}</Badge>
              ))}
            </div>
          </div>
          <div style={{ viewTransitionName: `case-${item.slug}` }}>
            <Diagram slug={item.slug} />
          </div>
        </div>

        {item.scope ? (
          <aside className="scope-callout mt-8 max-w-[68ch]">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--amber)]">
              {item.context === "Training lab" ? "Scope and authorization" : "Scope"}
            </p>
            <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)]">{item.scope}</p>
          </aside>
        ) : null}

        {item.quote ? <blockquote className="pull-quote">{item.quote}</blockquote> : null}

        <dl className="summary-grid mt-8">
          {item.role ? (
            <div>
              <dt>Role</dt>
              <dd>{item.role}</dd>
            </div>
          ) : null}
          <div>
            <dt>Scope</dt>
            <dd>{item.context}</dd>
          </div>
          {item.stack ? (
            <div>
              <dt>Stack</dt>
              <dd>{item.stack.join(", ")}</dd>
            </div>
          ) : null}
          {item.outcome ? (
            <div>
              <dt>Outcome</dt>
              <dd>{item.outcome}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-12 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <CaseRail items={rail} />
          <div className="flex max-w-[68ch] flex-col gap-10">
            {item.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-[length:var(--step-2)]">{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)]">
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className="mt-4 flex flex-col gap-2">
                    {section.list.map((line) => (
                      <li key={line} className="leading-[var(--leading-body)] text-[var(--fg-muted)]">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.id === "findings" && item.findings ? <FindingsTable rows={item.findings} /> : null}
                {section.id === "findings" ? (
                  <figure className="redacted-slot">
                    <div className="redacted-bars" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </div>
                    <figcaption>Lab screenshots stay in the repository. Names and documents are not republished here.</figcaption>
                  </figure>
                ) : null}
              </section>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 border-t border-[var(--line)] pt-6">
          {item.repo ? (
            <a href={item.repo} className="text-[var(--signal)]" target="_blank" rel="noreferrer">
              Repository
            </a>
          ) : null}
          {previous ? <Link href={`/work/${previous.slug}`}>Previous: {previous.title}</Link> : null}
          {next ? <Link href={`/work/${next.slug}`}>Next: {next.title}</Link> : null}
        </div>
      </div>
    </article>
  );
}
