import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "How this site is secured",
  description: "How duvorrichardwinner.me is hardened, and how to report a security issue.",
  alternates: { canonical: "/security" },
};

const sections = [
  {
    title: "Headers",
    text: "Responses send a per-request nonce Content Security Policy, HSTS on the public host, nosniff, a strict referrer policy, COOP/CORP isolation, and framing limits.",
  },
  {
    title: "Small attack surface",
    text: "Portfolio content lives in typed source files reviewed in Git. There is no public admin interface, database, file upload endpoint, or runtime secret in the browser.",
  },
  {
    title: "Dependencies and code",
    text: "Type checking, linting, and production dependency audits run in CI, with Dependabot and secret scanning enabled on the repository.",
  },
  {
    title: "Privacy",
    text: "Page views use the host's aggregate analytics. There are no ad trackers or third-party marketing scripts.",
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Security</p>
      <h1 className="mt-3 max-w-[16ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">How this site is secured</h1>
      <p className="mt-6 max-w-[68ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
        This is a personal site, but I hold it to the standard I&apos;d expect from a product team. Here&apos;s what that means in practice.
      </p>
      <dl className="mt-10 grid max-w-[68ch] gap-6">
        {sections.map((section) => (
          <div key={section.title} className="border-t border-[var(--line)] pt-4">
            <dt className="text-[length:var(--step-1)]">{section.title}</dt>
            <dd className="mt-2 leading-[var(--leading-body)] text-[var(--fg-muted)]">{section.text}</dd>
          </div>
        ))}
      </dl>
      <section id="report" className="mt-12 max-w-[68ch]">
        <h2 className="text-[length:var(--step-3)]">Report a problem</h2>
        <p className="mt-4 leading-[var(--leading-body)]">
          If you find a security issue on this site, please email me at {site.email}. Please don&apos;t run automated scanners against it, try to take it down, or access data that isn&apos;t yours. I&apos;ll reply, and I&apos;m happy to credit you here if you&apos;d like.
        </p>
        <p className="mt-4">
          <Link href="/.well-known/security.txt">security.txt</Link>
        </p>
      </section>
    </div>
  );
}
