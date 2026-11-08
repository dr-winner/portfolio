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
    text: "Responses send a Content Security Policy, HSTS on the public host, nosniff, a referrer policy, and framing limits. Per-request script nonces are the next hardening step, so the policy still allows the framework's inline bootstrap.",
  },
  {
    title: "No secrets in the browser",
    text: "API keys stay on the server. Production builds do not publish browser source maps.",
  },
  {
    title: "Content management",
    text: "The editing area is not linked from the public site and requires a sign-in. Changes are checked on the server.",
  },
  {
    title: "The site assistant",
    text: "The assistant answers from the facts published on this site. Visitor messages are treated as data, not instructions.",
  },
  {
    title: "Dependencies and code",
    text: "Dependency review and secret scanning are turned on for the repository.",
  },
  {
    title: "Privacy",
    text: "Page views use the host's analytics. There are no ad trackers.",
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
