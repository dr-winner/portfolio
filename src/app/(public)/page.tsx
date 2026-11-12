import Link from "next/link";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { HeroScene } from "@/components/hero/HeroScene";
import { CaseDiagram, type CaseDiagramVariant } from "@/components/site/CaseDiagram";
import { CertificationCard } from "@/components/site/CertificationCard";
import { CopyEmail } from "@/components/site/CopyEmail";
import { SectionLabel } from "@/components/site/SectionLabel";
import { SpotlightCard } from "@/components/site/SpotlightCard";
import { StatusDot } from "@/components/site/StatusDot";
import { cvHref, mailto, site } from "@/content/site";
import { skills } from "@/content/skills";
import { work } from "@/content/work";
import { personSchema, profilePageSchema, webSiteSchema } from "@/lib/structured-data";

/* ── Home page copy (facts only, read alongside src/content) ────────────── */

const proofStrip = [
  { value: "5", label: "OWASP LLM Top 10 attack paths tested" },
  { value: "6", label: "AWS detections mapped to MITRE ATT&CK" },
  { value: "2", label: "certifications earned, 2 in progress" },
];

const stories: Record<
  string,
  { risk: string; built: string; proof: string; domain: string }
> = {
  "llm-agent-security-lab": {
    domain: "AI / LLM",
    risk: "Untrusted ticket text can steer a model into calling a refund tool.",
    built: "A vulnerable and hardened RAG agent with deterministic controls at every boundary.",
    proof: "Five OWASP LLM Top 10 attack paths blocked in the test suite.",
  },
  "healthcare-portal-pentest-lab": {
    domain: "Web / API",
    risk: "A login form built its query from input, so the query could be rewritten.",
    built: "A full external pentest in a training lab, from recon to the written report.",
    proof: "A SQL injection login bypass and a CVSS v3.1 report with fixes.",
  },
  "aws-threat-detection-as-code": {
    domain: "Cloud",
    risk: "Root sign-ins, disabled logging and new access keys can pass unnoticed.",
    built: "Six AWS detections written in Terraform and mapped to MITRE ATT&CK.",
    proof: "Checkov scans every change before it ships.",
  },
  ghostpass: {
    domain: "Threat modeling",
    risk: "A payment can be linked back to the request it unlocks.",
    built: "A threat model of a private API subscription protocol.",
    proof: "Timing, replay and metadata leaks mapped with mitigations.",
  },
};

const method = [
  {
    n: "01",
    title: "Map the trust boundaries",
    text: "Before a payload, I map what trusts what: the session, the role, the data layer and the model output.",
  },
  {
    n: "02",
    title: "Test the boundary",
    text: "Manual testing against the OWASP Top 10 and the API Top 10. Every attempt is recorded so it can be repeated.",
  },
  {
    n: "03",
    title: "Leave proof",
    text: "Each finding gets steps to reproduce, a CVSS v3.1 score and a recommendation an engineering team can act on.",
  },
];

const workTiles = [
  {
    label: "Web and API",
    title: "Broken access control, authentication flaws, injection",
    text: "I test web applications and APIs against the OWASP Top 10 and the OWASP API Security Top 10, then prove each issue with a repeatable request.",
  },
  {
    label: "AI and LLM",
    title: "Prompt injection, retrieval leaks, excessive agency",
    text: "I treat model output and retrieved documents as untrusted input, then test the boundaries around tools, tenants and the browser.",
  },
  {
    label: "Cloud",
    title: "Detection written as code",
    text: "CloudTrail and GuardDuty feed EventBridge rules for six risky AWS behaviours, all defined in Terraform and checked in CI.",
  },
  {
    label: "Reporting",
    title: "Findings a team can fix",
    text: "Every finding ships with reproduction steps, a CVSS v3.1 score and a concrete recommendation, not just a severity label.",
  },
];

/* ── Page ───────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const featured = work.filter((item) => item.kind === "case-study");
  const [head, ...rest] = featured;

  return (
    <>
      <script suppressHydrationWarning nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script suppressHydrationWarning nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }} />
      <script suppressHydrationWarning nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema()) }} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section data-scene="hero" className="relative">
        <div className="shell grid items-center gap-12 pb-[clamp(48px,7vw,84px)] pt-[clamp(36px,7vh,76px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <StatusDot label="Available for AppSec roles" />
              <span aria-hidden className="h-3 w-px bg-[var(--line-strong)]" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                {site.location}
              </span>
            </div>

            <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
              Richard Winner Duvor
            </p>

            <h1 className="mt-3 text-[clamp(42px,9.4vw,104px)] font-medium leading-[0.9] tracking-[-0.055em]">
              <span className="block text-gradient">Application</span>
              <span className="block">
                Security<span className="text-[var(--signal)]">.</span>
              </span>
            </h1>

            <p className="mt-7 max-w-[46ch] text-[clamp(19px,2.1vw,25px)] font-medium leading-[1.28] tracking-[-0.015em] text-[var(--fg)]">
              I find the way in, show the evidence, and leave the team with a fix.
            </p>

            <p className="mt-4 max-w-[56ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              Application security and penetration testing across web, API and AI/LLM systems. I test how an application
              handles trust at each boundary, then write CVSS-scored findings that engineering teams can act on.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button href="/work">
                  See the work
                  <span aria-hidden className="text-[15px]">→</span>
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/work/llm-agent-security-lab" variant="secondary">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                  Open the live lab
                </Button>
              </Magnetic>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[var(--fg-subtle)]">
              <CopyEmail variant="icon" />
              <a
                href={cvHref}
                download
                className="link-sweep font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] no-underline transition-colors hover:text-[var(--fg)]"
              >
                Download CV
              </a>
              <Link
                href="/about"
                className="link-sweep font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] no-underline transition-colors hover:text-[var(--fg)]"
              >
                About the work
              </Link>
            </div>
          </div>

          <Reveal delay={220} y={18} className="min-w-0">
            <HeroScene />
          </Reveal>
        </div>
      </section>

      {/* ── Proof strip ──────────────────────────────────────────────────── */}
      <section aria-label="Proof points" className="border-y border-[var(--line)]">
        <div className="shell grid grid-cols-1 gap-y-0 md:grid-cols-3">
          {proofStrip.map((item, i) => (
            <Reveal key={item.label} delay={i * 70} y={8}>
              <div className={`flex items-baseline gap-3 py-5 ${i > 0 ? "border-t border-[var(--line)] md:border-l md:border-t-0 md:pl-8" : ""}`}>
                <span className="font-mono text-[length:var(--step-2)] font-medium leading-none tracking-[-0.03em] text-[var(--signal)]">
                  {item.value}
                </span>
                <span className="max-w-[30ch] text-[12.5px] leading-snug text-[var(--fg-muted)]">{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Selected work: sticky story stack ────────────────────────────── */}
      <section data-scene="work" className="shell section-pad">
        <Reveal>
          <SectionLabel title="Selected work" />
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SplitHeadline
            as="h2"
            lines={["Four ways into", "the same question."]}
            className="text-[length:var(--step-4)] font-medium leading-[var(--leading-heading)] tracking-[-0.03em]"
          />
          <Reveal delay={120} y={10}>
            <p className="max-w-[54ch] pb-1 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)] lg:justify-self-end">
              Each case says where the work happened, what I was allowed to test, and what the evidence shows. Training
              labs are labelled as training labs.
            </p>
          </Reveal>
        </div>

        <div className="story-stack mt-10">
          {featured.map((item, index) => {
            const story = stories[item.slug];
            if (!story) return null;
            return (
              <div key={item.slug} className="story-card">
                <SpotlightCard className="panel overflow-hidden">
                  <Link
                    href={`/work/${item.slug}`}
                    className="group grid gap-7 p-[clamp(20px,3.4vw,40px)] no-underline lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch lg:gap-10"
                  >
                    <div className="flex min-w-0 flex-col">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--signal)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Badge>{story.domain}</Badge>
                        <span className="font-mono text-[11px] text-[var(--fg-subtle)]">{item.year}</span>
                      </div>

                      <h3 className="mt-4 max-w-[24ch] text-[length:var(--step-3)] font-medium leading-[var(--leading-heading)] tracking-[-0.025em] text-[var(--fg)]">
                        {item.title}
                      </h3>

                      <dl className="mt-6 grid gap-4 border-t border-[var(--line)] pt-5 sm:grid-cols-2">
                        <div className="min-w-0">
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Risk</dt>
                          <dd className="mt-1.5 text-[13px] leading-snug text-[var(--fg)]">{story.risk}</dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Built</dt>
                          <dd className="mt-1.5 text-[13px] leading-snug text-[var(--fg-muted)]">{story.built}</dd>
                        </div>
                      </dl>

                      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Proof</span>
                        <span className="text-[12.5px] text-[var(--signal)]">{story.proof}</span>
                      </div>

                      <span className="mt-auto inline-flex items-center gap-2 pt-7 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                        Read the case study
                        <span aria-hidden className="arrow-shift">→</span>
                      </span>
                    </div>

                    <div className="card-diagram-wrap flex min-w-0 items-center rounded-[16px] border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_70%,transparent)] p-5">
                      <CaseDiagram
                        variant={item.slug as CaseDiagramVariant}
                        className="card-diagram h-auto w-full transition-transform duration-[var(--dur-2)]"
                      />
                    </div>
                  </Link>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        <Reveal delay={120} y={8}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/work" className="link-sweep font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--signal)] no-underline">
              All work and labs
            </Link>
            {head ? (
              <span className="font-mono text-[11px] text-[var(--fg-subtle)]">
                {rest.length + 1} case studies, {work.filter((item) => item.kind === "lab").length} training labs
              </span>
            ) : null}
          </div>
        </Reveal>
      </section>

      {/* ── What I do ────────────────────────────────────────────────────── */}
      <section data-scene="quiet" className="border-t border-[var(--line)]">
        <div className="shell section-pad">
          <Reveal>
            <SectionLabel title="What I do" />
          </Reveal>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <SplitHeadline
              as="h2"
              lines={["I look for what breaks,", "then explain the fix."]}
              className="max-w-[16ch] text-[length:var(--step-4)] font-medium leading-[var(--leading-heading)] tracking-[-0.03em]"
            />
            <Reveal delay={120} y={10}>
              <p className="max-w-[46ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)] lg:justify-self-end">
                The work is technical, but the output is not a pile of alerts. It is a path an engineer can follow and close.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {workTiles.map((tile, index) => (
              <Reveal key={tile.label} delay={index * 80} y={12} className="min-w-0">
                <SpotlightCard className="panel h-full p-[clamp(20px,2.6vw,30px)]">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--signal)]">{tile.label}</span>
                      <span className="font-mono text-[10.5px] text-[var(--fg-subtle)]">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-5 text-[length:var(--step-1)] font-medium leading-[var(--leading-snug)] tracking-[-0.015em] text-[var(--fg)]">
                      {tile.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{tile.text}</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Method ───────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--bg-raised)_55%,transparent)]">
        <div className="shell section-pad">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <Reveal>
                <SectionLabel title="How I work" />
              </Reveal>
              <SplitHeadline
                as="h2"
                lines={["Scope first.", "Proof last."]}
                className="mt-8 max-w-[10ch] text-[length:var(--step-4)] font-medium leading-[var(--leading-heading)] tracking-[-0.03em]"
              />
              <Reveal delay={160} y={10}>
                <p className="mt-6 max-w-[36ch] text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                  A repeatable way through an unfamiliar application. It keeps the testing honest and the report useful.
                </p>
              </Reveal>
            </div>

            <ol className="relative flex flex-col border-t border-[var(--line)]">
              {method.map((step, index) => (
                <Reveal key={step.n} as="li" delay={index * 90} y={12}>
                  <div className="group grid gap-3 border-b border-[var(--line)] py-7 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6">
                    <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--signal)]">{step.n}</span>
                    <div className="min-w-0">
                      <h3 className="text-[length:var(--step-1)] font-medium leading-snug tracking-[-0.015em] text-[var(--fg)]">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-[54ch] text-[13.5px] leading-[var(--leading-body)] text-[var(--fg-muted)]">{step.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Credentials ──────────────────────────────────────────────────── */}
      <section className="shell section-pad">
        <Reveal>
          <SectionLabel title="Credentials" />
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <Reveal delay={80} y={12}>
            <CertificationCard />
          </Reveal>
          <Reveal delay={180} y={12}>
            <div className="panel h-full p-6">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">Working toolkit</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.title}
                    className="inline-flex h-8 items-center rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface-2)_55%,transparent)] px-3 font-mono text-[10.5px] tracking-[0.04em] text-[var(--fg-muted)]"
                  >
                    {skill.title}
                  </span>
                ))}
              </div>
              <Link href="/about" className="link-sweep mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--signal)] no-underline">
                Full background →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section data-scene="quiet" className="relative overflow-hidden border-t border-[var(--line)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(70% 90% at 50% 120%, var(--glow-signal), transparent 66%)" }}
        />
        <div className="shell relative py-[clamp(72px,10vw,132px)]">
          <Reveal y={8}>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">Contact</p>
          </Reveal>
          <SplitHeadline
            as="h2"
            lines={["Hiring for application", "security? Let us talk."]}
            className="mt-6 max-w-[18ch] text-[clamp(38px,6.4vw,76px)] font-medium leading-[0.98] tracking-[-0.04em]"
          />
          <Reveal delay={160} y={12}>
            <p className="mt-6 max-w-[54ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              {site.availability}
            </p>
          </Reveal>
          <Reveal delay={220} y={12}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button href={mailto}>Email me</Button>
              </Magnetic>
              <Magnetic>
                <Button href={cvHref} variant="secondary" download>
                  Download CV
                </Button>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={280} y={10}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <CopyEmail />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">Accra, Ghana · GMT</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
