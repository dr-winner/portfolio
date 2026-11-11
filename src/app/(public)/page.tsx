import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CertificationCard } from "@/components/site/CertificationCard";
import { CopyEmail } from "@/components/site/CopyEmail";
import { FindingExample } from "@/components/site/FindingExample";
import { ProofStrip } from "@/components/site/ProofStrip";
import { RequestTrace } from "@/components/site/RequestTrace";
import { SectionLabel } from "@/components/site/SectionLabel";
import { SeeItWork } from "@/components/site/SeeItWork";
import { StatementLine } from "@/components/site/StatementLine";
import { StatusDot } from "@/components/site/StatusDot";
import { WorkCard } from "@/components/site/WorkCard";
import { cvHref, mailto, site } from "@/content/site";
import { skills } from "@/content/skills";
import { work } from "@/content/work";
import { personSchema, profilePageSchema, webSiteSchema } from "@/lib/structured-data";

const proofStrip = [
  { value: "5", label: "OWASP LLM Top 10 attack paths tested" },
  { value: "6", label: "AWS detections mapped to MITRE ATT&CK" },
  { value: "2", label: "certifications earned, 2 in progress" },
];

const whatIDo = {
  large: [
    {
      title: "Web and API testing",
      text: "I test web applications and APIs for broken access control, authentication flaws and injection, following the OWASP Top 10 and the OWASP API Security Top 10.",
    },
    {
      title: "Findings teams can act on",
      text: "Every finding comes with the steps to reproduce it, a CVSS v3.1 score and a clear recommendation, like moving to parameterized queries or enforcing role checks on the server.",
    },
  ],
  small: [
    {
      title: "AI and LLM app security",
      text: "Prompt injection, unsafe output handling and tools with more access than they need, framed with the OWASP Top 10 for LLM Applications.",
    },
    {
      title: "Cloud detection",
      text: "Six AWS threat detections written in Terraform, mapped to MITRE ATT&CK and checked by Checkov in CI.",
    },
  ],
};

export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const featured = work.filter((item) => item.kind === "case-study");

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema()) }} />

      <section id="hero" data-hero className="hero-frame px-[clamp(20px,4vw,40px)] pt-4 lg:pt-6">
        <div className="hero-lights" aria-hidden>
          <div className="hero-navy" />
          <div className="hero-teal" />
          <div className="hero-grid" />
          <div className="hero-cursor" />
        </div>
        <div className="relative z-[1] mx-auto grid w-full max-w-[1200px] flex-1 items-center gap-8 pb-8 lg:min-h-[inherit] lg:grid-cols-12 lg:pb-16">
          <div className="lg:col-span-6">
            <div className="enter-up" style={{ ["--enter-y" as string]: "8px" }}>
              <StatusDot pulse label={site.availabilityShort} />
            </div>
            <p className="enter-up mt-4 font-mono text-[12px] tracking-[0.08em] text-[var(--fg-subtle)]" style={{ animationDelay: "40ms", ["--enter-y" as string]: "8px" }}>
              Richard Winner Duvor
            </p>
            <h1 className="hero-title mt-3 text-[var(--fg-strong)]">
              Application
              <br />
              <span className="hero-security">Security</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-[17px] leading-[1.45] text-[var(--fg-muted)]">
              Web, API and AI/LLM application security. Penetration testing.
            </p>
            <p className="enter-up mt-4 max-w-[52ch] text-[17px] leading-[1.6] text-[var(--fg-muted)]" style={{ animationDelay: "80ms", ["--enter-y" as string]: "12px" }}>
              I test web applications and APIs for security flaws and write CVSS-scored findings that engineering teams can act on. A software engineering background lets me read an app from the inside before I test it from the outside.
            </p>
            <div className="enter-up mt-6 flex flex-wrap gap-3" style={{ animationDelay: "120ms", ["--enter-y" as string]: "12px" }}>
              <Button href="/work" magnet>
                View my work
              </Button>
              <Button href={cvHref} variant="secondary" download magnet>
                Download CV
              </Button>
            </div>
          </div>
          <div className="hero-scroll-card lg:col-span-6 lg:-mb-12">
            <RequestTrace />
          </div>
        </div>
      </section>

      <ProofStrip items={proofStrip} />

      <section id="work" className="selected-work mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)] pt-[var(--space-2xl)]">
        <span aria-hidden className="trust-rail" />
        <SectionLabel title="Selected work" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featured.map((item) => (
            <div key={item.slug} className="relative">
              <span aria-hidden className="work-node" />
              <WorkCard item={item} />
            </div>
          ))}
        </div>
        <Link href="/work" className="link-sweep mt-8 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-[var(--signal)] no-underline">
          All work
          <span aria-hidden className="arrow-shift">
            →
          </span>
        </Link>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)]">
        <SectionLabel title="What I do" />
        <StatementLine text="I look for what breaks, and I explain how to fix it." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={0} y={16} className="min-w-0 lg:col-span-2">
            <BentoTile title={whatIDo.large[0].title} text={whatIDo.large[0].text} />
          </Reveal>
          <Reveal delay={40} y={16} className="min-w-0">
            <BentoTile title={whatIDo.small[0].title} text={whatIDo.small[0].text} />
          </Reveal>
          <Reveal delay={80} y={16} className="min-w-0">
            <BentoTile title={whatIDo.small[1].title} text={whatIDo.small[1].text} />
          </Reveal>
          <Reveal delay={120} y={16} className="min-w-0 lg:col-span-2">
            <BentoTile title={whatIDo.large[1].title} text={whatIDo.large[1].text} finding />
          </Reveal>
        </div>
      </section>

      <SeeItWork />

      <section className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)]">
        <SectionLabel title="Credentials" />
        <div className="mt-8">
          <Reveal delay={40} y={16}>
            <CertificationCard />
          </Reveal>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill.title} className="inline-flex h-8 items-center rounded-full border border-[var(--line)] px-3 font-mono text-[12px] text-[var(--fg-subtle)]">
              {skill.title}
            </span>
          ))}
        </div>
        <Link href="/about" className="link-sweep mt-8 inline-block font-mono text-[12px] tracking-[0.08em] text-[var(--signal)] no-underline">
          Full background →
        </Link>
      </section>

      <Reveal as="section" className="contact-band border-t border-[var(--line)] bg-[var(--bg-raised)]">
        <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-[var(--space-2xl)]">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Contact</p>
          <h2 className="heading-reveal mt-6 max-w-[16ch] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--fg-strong)] [font-size:var(--h2-size)]">
            Hiring for application security? Let&apos;s talk.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.6] text-[var(--fg-muted)]">{site.availability}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button href={mailto} magnet>
              Email me
            </Button>
            <Button href={cvHref} variant="secondary" download>
              Download CV
            </Button>
          </div>
          <div className="mt-6">
            <CopyEmail />
          </div>
        </div>
      </Reveal>
    </>
  );
}

function BentoTile({ title, text, finding = false }: { title: string; text: string; finding?: boolean }) {
  return (
    <div className="flex h-full flex-col rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-6">
      <span aria-hidden className="edge-light" />
      <h3 className="text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-[var(--fg-strong)]">{title}</h3>
      <p className="mt-3 text-[16px] leading-[1.6] text-[var(--fg-muted)]">{text}</p>
      {finding ? <FindingExample /> : null}
    </div>
  );
}
