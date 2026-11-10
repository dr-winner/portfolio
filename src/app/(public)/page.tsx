import Link from "next/link";
import { headers } from "next/headers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CaseDiagram, type CaseDiagramVariant } from "@/components/site/CaseDiagram";
import { CertificationCard } from "@/components/site/CertificationCard";
import { CopyEmail } from "@/components/site/CopyEmail";
import { SectionLabel } from "@/components/site/SectionLabel";
import { StatusDot } from "@/components/site/StatusDot";
import { RequestTrace } from "@/components/site/RequestTrace";
import { cvHref, mailto, site } from "@/content/site";
import { skills } from "@/content/skills";
import { work } from "@/content/work";
import { personSchema, profilePageSchema, webSiteSchema } from "@/lib/structured-data";

/* ── Home page copy blocks (data untouched: reads from src/content) ───────── */

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

const domainTags: Record<string, string> = {
  "llm-agent-security-lab": "AI / LLM",
  "healthcare-portal-pentest-lab": "Web / API",
  "aws-threat-detection-as-code": "Cloud",
  ghostpass: "Threat modeling",
};

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const featured = work.filter((item) => item.kind === "case-study");
  const [head, ...restFeatured] = featured;

  return (
    <>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }} />
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema()) }} />

      {/* ── Hero: static type left, request trace right ───────────────────── */}
      <section className="px-[clamp(24px,4vw,40px)] pt-[clamp(72px,9vh,96px)]">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-[clamp(40px,6vw,64px)] pb-[clamp(56px,8vh,96px)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={0} y={10}>
              <StatusDot label={site.availabilityShort} />
            </Reveal>
            <Reveal delay={80} y={0} variant="mask">
              <h1 className="mt-6 text-[length:var(--step-6)] font-medium leading-[var(--leading-tight)] tracking-[-0.035em]">
                Application Security
              </h1>
            </Reveal>
            <Reveal delay={160} y={12}>
              <p className="mt-6 text-[length:var(--step-1)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
                Web, API and AI/LLM application security
              </p>
            </Reveal>
            <Reveal delay={240} y={14}>
              <p className="mt-5 max-w-[52ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                I test web applications and APIs for security flaws and write CVSS-scored findings that engineering teams
                can act on. I build frontends for a living, so I read an app from the inside before I test it from the
                outside.
              </p>
            </Reveal>
            <Reveal delay={320} y={12}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/work">View my work</Button>
                <Button href={cvHref} variant="secondary" download>
                  Download CV
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={260} y={16}>
              <RequestTrace />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Proof strip: full width, hairline separated facts ──────────────── */}
      <section className="border-y border-[var(--line)]">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-y-0 px-[clamp(24px,4vw,40px)] md:grid-cols-3">
          {proofStrip.map((item, i) => (
            <Reveal key={item.label} delay={i * 80} y={10}>
              <div
                className={`flex items-baseline gap-3 py-4 md:py-5 ${
                  i > 0 ? "border-t border-[var(--line)] md:border-l md:border-t-0 md:pl-8" : ""
                }`}
              >
                <span className="font-mono text-[length:var(--step-1)] font-medium leading-none tracking-[-0.02em] text-[var(--fg)]">
                  {item.value}
                </span>
                <span className="text-[length:var(--step--1)] leading-snug text-[var(--fg-subtle)]">{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Selected work ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)] pt-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel title="Selected work" />
        </Reveal>
        {head ? (
          <Reveal delay={100} y={16}>
            <Link
              href={`/work/${head.slug}`}
              className="group mt-8 grid grid-cols-1 gap-6 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-[clamp(20px,3vw,36px)] no-underline lg:grid-cols-[1fr_340px] lg:gap-10"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{domainTags[head.slug] ?? head.badges[1] ?? head.badges[0]}</Badge>
                  <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{head.year}</span>
                </div>
                <h2 className="mt-4 max-w-[24ch] text-[length:var(--step-3)] font-medium leading-[var(--leading-tight)] tracking-[-0.02em] text-[var(--fg)]">
                  {head.title}
                </h2>
                <p className="mt-4 max-w-[62ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
                  {head.card}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] text-[var(--signal)]">
                  Read case study
                  <span aria-hidden className="arrow-shift">→</span>
                </span>
              </div>
              <div className="flex items-center rounded-[var(--radius-control)] bg-[var(--surface-2)] p-5">
                <CaseDiagram
                  variant={head.slug as CaseDiagramVariant}
                  className="card-diagram h-auto w-full transition-transform duration-[var(--dur-2)]"
                />
              </div>
            </Link>
          </Reveal>
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {restFeatured.map((item, i) => (
            <Reveal key={item.slug} delay={140 + i * 90} y={14}>
              <Link
                href={`/work/${item.slug}`}
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-5 no-underline"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{domainTags[item.slug] ?? item.badges[0]}</Badge>
                  <span className="font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
                </div>
                <h3 className="mt-3 text-[length:var(--step-2)] font-medium leading-[var(--leading-tight)] text-[var(--fg)]">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[length:var(--step--1)] leading-[var(--leading-snug)] text-[var(--fg-muted)]">
                  {item.card}
                </p>
                <div className="mt-auto pt-4">
                  <div className="card-diagram-wrap rounded-[10px] bg-[var(--surface-2)] p-3">
                    <CaseDiagram
                      variant={item.slug as CaseDiagramVariant}
                      className="card-diagram h-auto w-full transition-transform duration-[var(--dur-2)]"
                    />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
                    Read case study
                    <span aria-hidden className="arrow-shift">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={300} y={8}>
          <Link href="/work" className="link-sweep mt-8 inline-block font-mono text-[12px] tracking-[0.08em] text-[var(--signal)] no-underline">
            All work →
          </Link>
        </Reveal>
      </section>

      {/* ── What I do: bento grid, two large tiles and two small ──────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel title="What I do" />
        </Reveal>
        <Reveal delay={80} y={0} variant="mask">
          <h2 className="mt-6 max-w-[20ch] text-[length:var(--step-4)] font-medium leading-[var(--leading-tight)] tracking-[-0.02em]">
            I look for what breaks, and I explain how to fix it.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Reveal delay={120} y={12} className="min-w-0 lg:col-span-2">
            <BentoTile title={whatIDo.large[0].title} text={whatIDo.large[0].text} large />
          </Reveal>
          <Reveal delay={200} y={12} className="min-w-0">
            <BentoTile title={whatIDo.small[0].title} text={whatIDo.small[0].text} />
          </Reveal>
          <Reveal delay={280} y={12} className="min-w-0">
            <BentoTile title={whatIDo.small[1].title} text={whatIDo.small[1].text} />
          </Reveal>
          <Reveal delay={360} y={12} className="min-w-0 lg:col-span-2">
            <BentoTile title={whatIDo.large[1].title} text={whatIDo.large[1].text} large finding />
          </Reveal>
        </div>
      </section>

      {/* ── Credentials: earned and in progress, skills as quiet tags ─────── */}
      <section className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] pb-[var(--space-2xl)]">
        <Reveal>
          <SectionLabel title="Credentials" />
        </Reveal>
        <div className="mt-8">
          <Reveal delay={100} y={12}>
            <CertificationCard />
          </Reveal>
        </div>
        <Reveal delay={260} y={10}>
          <div className="mt-6 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.title}
                className="inline-flex h-7 items-center rounded-full border border-[var(--line)] px-3 font-mono text-[11px] tracking-[0.04em] text-[var(--fg-subtle)]"
              >
                {skill.title}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={320} y={8}>
          <Link href="/about" className="link-sweep mt-8 inline-block font-mono text-[12px] tracking-[0.08em] text-[var(--signal)] no-underline">
            Full background →
          </Link>
        </Reveal>
      </section>

      {/* ── Contact: full width band on the raised background ─────────────── */}
      <section className="border-t border-[var(--line)] bg-[var(--bg-raised)]">
        <div className="mx-auto w-full max-w-[1200px] px-[clamp(24px,4vw,40px)] py-[var(--space-2xl)]">
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Contact</p>
          </Reveal>
          <Reveal delay={80} y={0} variant="mask">
            <h2 className="mt-6 max-w-[18ch] text-[length:var(--step-5)] font-medium leading-[var(--leading-tight)] tracking-[-0.02em]">
              Hiring for application security? Let&apos;s talk.
            </h2>
          </Reveal>
          <Reveal delay={160} y={12}>
            <p className="mt-5 max-w-[58ch] text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">
              {site.availability}
            </p>
          </Reveal>
          <Reveal delay={240} y={12}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button href={mailto}>Email me</Button>
              <Button href={cvHref} variant="secondary" download>
                Download CV
              </Button>
            </div>
          </Reveal>
          <Reveal delay={300} y={10}>
            <div className="mt-6">
              <CopyEmail />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ── Bento tile primitives ─────────────────────────────────────────────────── */

function BentoTile({
  title,
  text,
  large = false,
  finding = false,
}: {
  title: string;
  text: string;
  large?: boolean;
  finding?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-6">
      <h3 className={large ? "text-[length:var(--step-2)] font-medium leading-[var(--leading-tight)]" : "text-[length:var(--step-1)] font-medium leading-[var(--leading-tight)]"}>
        {title}
      </h3>
      <p className="mt-3 text-[length:var(--step-0)] leading-[var(--leading-body)] text-[var(--fg-muted)]">{text}</p>
      {finding ? (
        <div className="mt-5 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[12px]">
            <span className="rounded-full border border-[var(--danger)]/50 px-2 py-0.5 text-[11px] text-[var(--danger)]">High</span>
            <span className="text-[var(--fg-muted)]">CVSS 7.5</span>
            <span className="min-w-0 truncate text-[var(--fg)]">SQL injection login bypass</span>
          </div>
          <p className="mt-2 font-mono text-[11px] text-[var(--fg-subtle)]">Recommendation: parameterized queries on the username lookup</p>
        </div>
      ) : null}
    </div>
  );
}
