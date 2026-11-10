import type { Metadata } from "next";
import Link from "next/link";
import { mailto, site } from "@/content/site";
import { work } from "@/content/work";
import { certifications } from "@/content/certifications";
import { classicHref } from "@/os/href";
import { StatusDot } from "@/components/site/StatusDot";

/* The classic one pager, brief 7.1: the home content as a single fast
   document that works without JavaScript. Links inside keep the
   ?view=classic param so visitors browsing here stay here. */

export const metadata: Metadata = {
  title: "drWinner, classic view",
  description: site.availabilityShort,
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

const proofStrip = [
  { value: "5", label: "OWASP LLM Top 10 attack paths tested" },
  { value: "6", label: "AWS detections mapped to MITRE ATT&CK" },
  { value: "2", label: "certifications earned, 2 in progress" },
];

const whatIDo = [
  {
    title: "Web and API testing",
    text: "I test web applications and APIs for broken access control, authentication flaws and injection, following the OWASP Top 10 and the OWASP API Security Top 10.",
  },
  {
    title: "Findings teams can act on",
    text: "Every finding comes with the steps to reproduce it, a CVSS v3.1 score and a clear recommendation, like moving to parameterized queries or enforcing role checks on the server.",
  },
  {
    title: "AI and LLM app security",
    text: "Prompt injection, unsafe output handling and tools with more access than they need, framed with the OWASP Top 10 for LLM Applications.",
  },
  {
    title: "Cloud detection",
    text: "Six AWS threat detections written in Terraform, mapped to MITRE ATT&CK and checked by Checkov in CI.",
  },
];

const featured = work.filter((item) => item.kind === "case-study");

export default function ClassicHome() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)]">
      <section className="pt-[clamp(56px,8vh,88px)]">
        <StatusDot label={site.availabilityShort} />
        <p className="mt-6 font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]">{site.name}</p>
        <h1 className="mt-3 text-[length:var(--step-6)] font-medium leading-[var(--leading-tight)] tracking-[-0.035em]">
          {site.headline}
        </h1>
        <p className="mt-5 text-[length:var(--step-1)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
          {site.headlineSub}. Penetration testing.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={classicHref("/work")}
            className="rounded-[8px] border border-[var(--line-strong)] bg-[var(--surface)] px-5 py-3 text-[length:var(--step--1)] no-underline hover:border-[var(--signal)] hover:text-[var(--signal)]"
          >
            See the work
          </Link>
          <a href={mailto} className="text-[length:var(--step--1)] text-[var(--fg-muted)] underline underline-offset-4 hover:text-[var(--fg)]">
            Email me
          </a>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {proofStrip.map((item) => (
            <li key={item.label} className="border-t border-[var(--line)] pt-4">
              <p className="text-[28px] font-medium tabular-nums">{item.value}</p>
              <p className="mt-1 text-[length:var(--step--1)] text-[var(--fg-muted)]">{item.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-[clamp(56px,8vh,88px)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Selected work</p>
        <ul className="mt-6 flex flex-col divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {featured.map((item) => (
            <li key={item.slug}>
              <Link
                href={classicHref(`/work/${item.slug}`)}
                className="group flex flex-col gap-1 py-5 no-underline hover:bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="text-[length:var(--step-1)] font-medium text-[var(--fg)]">{item.title}</span>
                  <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
                </span>
                <span className="max-w-[64ch] text-[length:var(--step--1)] text-[var(--fg-muted)]">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={classicHref("/work")} className="mt-5 inline-block text-[length:var(--step--1)] text-[var(--fg-muted)] underline underline-offset-4 hover:text-[var(--fg)]">
          All projects and labs
        </Link>
      </section>

      <section className="pt-[clamp(56px,8vh,88px)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">What I do</p>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          {whatIDo.map((block) => (
            <div key={block.title}>
              <h2 className="text-[length:var(--step-2)] font-medium">{block.title}</h2>
              <p className="mt-3 max-w-[60ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-[clamp(56px,8vh,88px)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Certifications</p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {certifications.map((cert) => (
            <li key={cert.name} className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
              <span className="text-[length:var(--step--1)] text-[var(--fg)]">{cert.name}</span>
              <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{cert.status === "earned" ? "Earned" : "In progress"}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <a href={mailto} className="text-[length:var(--step-0)] underline underline-offset-4 hover:text-[var(--signal)]">
            {site.email}
          </a>
          <span className="text-[length:var(--step--1)] text-[var(--fg-muted)]">{site.location}</span>
        </div>
      </section>
    </div>
  );
}
