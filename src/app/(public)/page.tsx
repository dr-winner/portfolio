import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CopyEmail } from "@/components/site/CopyEmail";
import { certifications } from "@/content/certifications";
import { cvHref, mailto, site } from "@/content/site";
import { work } from "@/content/work";
import { personSchema, profilePageSchema, webSiteSchema } from "@/lib/structured-data";

const proof = [
  {
    index: "01",
    text: "A full web app pentest in a NetworkWalks training lab: SQL injection login bypass and a CVSS v3.1 report with remediation recommendations.",
    href: "/work/healthcare-portal-pentest-lab",
  },
  {
    index: "02",
    text: "Six AWS threat detections written in Terraform, mapped to MITRE ATT&CK and checked by Checkov in CI.",
    href: "/work/aws-threat-detection-as-code",
  },
  {
    index: "03",
    text: "Cybersecurity intern at TechBiz Security on the ethical hacking and SOC tracks.",
    href: "/about#experience",
  },
];

const practices = [
  {
    index: "01",
    title: "Web and API testing",
    text: "I test web applications and APIs for broken access control, authentication flaws and injection, following the OWASP Top 10 and the OWASP API Security Top 10.",
  },
  {
    index: "02",
    title: "Findings teams can act on",
    text: "Every finding comes with the steps to reproduce it, a CVSS v3.1 score and a clear recommendation, like moving to parameterized queries or enforcing role checks on the server.",
  },
  {
    index: "03",
    title: "AI and LLM app security",
    text: "My focus area is the security of LLM features: prompt injection, unsafe output handling and tools with more access than they need. I use the OWASP Top 10 for LLM Applications as the frame.",
  },
];

export default function HomePage() {
  const featured = work.filter((item) => item.kind === "case-study");
  const earned = certifications.filter((item) => item.status === "earned");
  const progress = certifications.filter((item) => item.status !== "earned");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema()) }} />

      <section className="relative flex min-h-[100svh] flex-col justify-end px-[clamp(20px,5vw,64px)] pb-16 md:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: "radial-gradient(circle, var(--line) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 72%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[1280px]">
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            {site.name} · {site.location}
          </p>
          <h1
            className="mt-4 max-w-[12ch] text-balance text-[length:var(--step-6)] font-medium leading-[var(--leading-tight)] tracking-[-0.035em]"
          >
            {site.headline}
          </h1>
          <p className="mt-3 text-[length:var(--step-3)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
            {site.headlineSub}
          </p>
          <p className="mt-6 max-w-[60ch] text-pretty text-[length:var(--step-1)] leading-[var(--leading-body)]">
            I test web applications and APIs for security flaws and write CVSS-scored findings that engineering teams can act on. I build frontends for a living, so I read an app from the{" "}
            <em className="font-serif text-[1.08em] not-italic" style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontStyle: "italic" }}>
              inside
            </em>{" "}
            before I test it from the outside.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/work">View my work</Button>
            <Button href={cvHref} variant="secondary" download>
              Download CV
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[length:var(--step--1)] text-[var(--fg-subtle)]">
            <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[var(--signal)]" />
            {site.availabilityShort}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Evidence</h2>
        <ol className="mt-6 grid gap-4 lg:grid-cols-3">
          {proof.map((item) => (
            <li key={item.index}>
              <Link href={item.href} className="block h-full border-t border-[var(--line-strong)] py-4 no-underline">
                <span className="font-mono text-[12px] text-[var(--signal)]">{item.index}</span>
                <span className="mt-2 block text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg)]">{item.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">What I do</p>
        <h2 className="mt-3 max-w-[18ch] text-balance text-[length:var(--step-4)] leading-[var(--leading-tight)] tracking-[-0.02em]">
          I look for what breaks, and I explain how to fix it.
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {practices.map((item) => (
            <article key={item.index} className="border-t border-[var(--line)] pt-4">
              <p className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.index}</p>
              <h3 className="mt-3 text-[length:var(--step-2)]">{item.title}</h3>
              <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Selected work</p>
        <h2 className="mt-3 text-[length:var(--step-4)] leading-[var(--leading-tight)]">Case studies</h2>
        <ul className="mt-8 grid gap-4 xl:grid-cols-3">
          {featured.map((item) => (
            <li key={item.slug}>
              <Link href={`/work/${item.slug}`} className="flex h-full flex-col rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline shadow-[var(--shadow)]">
                <div className="flex flex-wrap gap-2">
                  {item.badges.map((badge) => (
                    <Badge key={badge}>{badge}</Badge>
                  ))}
                </div>
                <h3 className="mt-4 text-[length:var(--step-2)] text-[var(--fg)]">{item.title}</h3>
                <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{item.card}</p>
                <span className="mt-6 text-[var(--signal)]">Read case study</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/work" className="mt-6 inline-block text-[var(--signal)]">
          All work
        </Link>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-[clamp(20px,5vw,64px)] pb-[var(--space-2xl)]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">Credentials</p>
        <p className="mt-4 text-[length:var(--step-0)]">
          <span className="text-[var(--fg-muted)]">Earned. </span>
          {earned.map((item) => item.name).join(" · ")}
        </p>
        <p className="mt-2 text-[length:var(--step-0)]">
          <span className="text-[var(--fg-muted)]">In progress. </span>
          {progress.map((item) => item.name).join(" · ")}
        </p>
        <Link href="/about" className="mt-4 inline-block text-[var(--signal)]">
          Full background
        </Link>
      </section>

      <section className="bg-[var(--surface)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-[clamp(20px,5vw,64px)] py-[var(--space-2xl)]">
          <h2 className="max-w-[16ch] text-balance text-[length:var(--step-5)] leading-[var(--leading-tight)]">
            Hiring for application security? Let&apos;s talk.
          </h2>
          <p className="max-w-[68ch] text-[length:var(--step-1)] leading-[var(--leading-body)]">{site.availability}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={mailto}>Email me</Button>
            <Button href={cvHref} variant="secondary" download>
              Download CV
            </Button>
          </div>
          <CopyEmail />
        </div>
      </section>
    </>
  );
}
