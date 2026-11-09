import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/site/SectionLabel";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "How this site is secured",
  description: "How duvorrichardwinner.me is hardened, and how to report a security issue.",
  alternates: { canonical: "/security" },
};

const sections = [
  {
    index: "01",
    title: "Headers",
    text: "Responses send a per-request nonce Content Security Policy, HSTS on the public host, nosniff, a strict referrer policy, COOP/CORP isolation, and framing limits.",
  },
  {
    index: "02",
    title: "Small attack surface",
    text: "Portfolio content lives in typed source files reviewed in Git. There is no public admin interface, database, file upload endpoint, or runtime secret in the browser.",
  },
  {
    index: "03",
    title: "Dependencies and code",
    text: "Type checking, linting, and production dependency audits run in CI, with Dependabot and secret scanning enabled on the repository.",
  },
  {
    index: "04",
    title: "Privacy",
    text: "Page views use the host's aggregate analytics. There are no ad trackers or third-party marketing scripts.",
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <Reveal y={10}>
        <SectionLabel title="Security" />
      </Reveal>
      <Reveal delay={80} y={20}>
        <h1 className="mt-6 max-w-[16ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">How this site is secured</h1>
      </Reveal>
      <Reveal delay={160} y={16}>
        <p className="mt-6 max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
          This is a personal site, but I hold it to the standard I&apos;d expect from a product team. Here&apos;s what that means in practice.
        </p>
        <div className="fx-rule mt-8 h-px w-full bg-[var(--line)]" />
      </Reveal>

      <dl className="mt-4 grid max-w-[68ch]">
        {sections.map((section) => (
          <Reveal key={section.index} as="div" y={14}>
            <div className="group grid gap-1 border-t border-[var(--line)] py-5 transition-colors duration-[var(--dur-2)] hover:bg-[color-mix(in_srgb,var(--signal)_4%,transparent)] sm:grid-cols-[72px_1fr] sm:gap-6 sm:px-2">
              <dt className="font-mono text-[12px] text-[var(--fg-subtle)] transition-colors group-hover:text-[var(--signal)]">
                &gt; {section.index}
              </dt>
              <dd>
                <span className="text-[length:var(--step-1)]">{section.title}</span>
                <p className="mt-1.5 leading-[var(--leading-body)] text-[var(--fg-muted)]">{section.text}</p>
              </dd>
            </div>
          </Reveal>
        ))}
        <div aria-hidden className="border-t border-[var(--line)]" />
      </dl>

      <section id="report" className="mt-16 max-w-[68ch] scroll-mt-28">
        <Reveal>
          <div className="fx-corner console-card rounded-[12px] border border-[var(--amber)]/50 bg-[var(--surface)] p-6 md:p-8">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--amber)]">[ REPORT AN ISSUE ]</p>
            <p className="mt-4 leading-[var(--leading-body)]">
              If you find a security issue on this site, please email me at{" "}
              <a href={`mailto:${site.email}`} className="link-sweep is-active text-[var(--fg)] no-underline">
                {site.email}
              </a>
              . Please don&apos;t run automated scanners against it, try to take it down, or access data that isn&apos;t yours. I&apos;ll reply, and I&apos;m happy to credit you here if you&apos;d like.
            </p>
            <p className="mt-4">
              <Link href="/.well-known/security.txt" className="link-sweep font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--signal)] no-underline">
                security.txt →
              </Link>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
