import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
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

  return (
    <article className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
        <Link href="/work" className="text-[var(--fg-muted)]">Work</Link>
        {" / "}
        {item.title}
      </p>
      <h1 className="mt-4 max-w-[18ch] text-balance text-[length:var(--step-4)] leading-[var(--leading-tight)]">{item.title}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.badges.map((badge) => (
          <Badge key={badge}>{badge}</Badge>
        ))}
      </div>
      {item.scope ? (
        <aside className="mt-8 max-w-[68ch] rounded-[12px] border border-[var(--amber)] bg-[var(--surface)] p-5">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--amber)]">
            {item.context === "Training lab" ? "Scope and authorization" : "Scope"}
          </p>
          <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)]">{item.scope}</p>
        </aside>
      ) : null}
      <dl className="mt-8 grid max-w-[68ch] gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-2">
        {item.role ? <div><dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Role</dt><dd className="mt-1">{item.role}</dd></div> : null}
        <div><dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Scope</dt><dd className="mt-1">{item.context}</dd></div>
        {item.stack ? <div><dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Stack</dt><dd className="mt-1">{item.stack.join(", ")}</dd></div> : null}
        {item.outcome ? <div><dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Outcome</dt><dd className="mt-1">{item.outcome}</dd></div> : null}
      </dl>
      <div className="mt-10 flex max-w-[68ch] flex-col gap-8">
        {item.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-[length:var(--step-2)]">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-pretty text-[length:var(--step-0)] leading-[var(--leading-body)]">{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-6 border-t border-[var(--line)] pt-6">
        {item.repo ? <a href={item.repo} className="text-[var(--signal)]" target="_blank" rel="noreferrer">Repository</a> : null}
        {previous ? <Link href={`/work/${previous.slug}`}>Previous</Link> : null}
        {next ? <Link href={`/work/${next.slug}`}>Next</Link> : null}
      </div>
    </article>
  );
}
