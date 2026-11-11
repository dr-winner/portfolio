import { certifications } from "@/content/certifications";

/**
 * Credentials block: earned and in-progress certifications in two quiet
 * cards. This is the same component the home page uses.
 */
export function CertificationCard() {
  const earned = certifications.filter((item) => item.status === "earned");
  const progress = certifications.filter((item) => item.status !== "earned");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-full rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">Earned</p>
        <ul className="mt-4 flex flex-col gap-4">
          {earned.map((item) => (
            <li key={item.name} className="flex items-baseline justify-between gap-4">
              <span className="min-w-0">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg)] no-underline hover:text-[var(--signal)]">
                    {item.name}
                  </a>
                ) : (
                  <span className="text-[var(--fg)]">{item.name}</span>
                )}
                <span className="block text-[length:var(--step--1)] text-[var(--fg-subtle)]">{item.issuer}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] text-[var(--fg-subtle)]">{item.year}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-full rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--fg-subtle)]">In progress</p>
        <ul className="mt-4 flex flex-col gap-4">
          {progress.map((item) => (
            <li key={item.name} className="flex items-baseline justify-between gap-4">
              <span className="min-w-0">
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[var(--fg)] no-underline hover:text-[var(--signal)]">
                    {item.name}
                  </a>
                ) : (
                  <span className="text-[var(--fg)]">{item.name}</span>
                )}
                <span className="block text-[length:var(--step--1)] text-[var(--fg-subtle)]">{item.issuer}</span>
              </span>
              <span className="shimmer-pill shrink-0 rounded-full border border-[var(--line-strong)] px-2 py-0.5 font-mono text-[12px] text-[var(--fg-subtle)]">
                In progress
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
