import { certifications } from "@/content/certifications";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m3.2 8.4 3.2 3.2 6.4-6.8" />
    </svg>
  );
}

/**
 * Credentials block: earned and in-progress certifications in two quiet
 * panels. The same component is used on the home and about pages.
 */
export function CertificationCard() {
  const earned = certifications.filter((item) => item.status === "earned");
  const progress = certifications.filter((item) => item.status !== "earned");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        { title: "Earned", items: earned, done: true },
        { title: "In progress", items: progress, done: false },
      ].map((group) => (
        <div key={group.title} className="panel flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">{group.title}</p>
            <span
              className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                group.done
                  ? "border-[var(--signal)]/50 text-[var(--signal)]"
                  : "border-[var(--line-strong)] text-[var(--fg-subtle)]"
              }`}
            >
              {group.done ? <Check /> : <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
          </div>
          <ul className="mt-5 flex flex-col gap-4">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-baseline justify-between gap-4 border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
                <span className="min-w-0">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className="link-sweep text-[13.5px] text-[var(--fg)] no-underline hover:text-[var(--signal)]">
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-[13.5px] text-[var(--fg)]">{item.name}</span>
                  )}
                  <span className="block text-[11.5px] text-[var(--fg-subtle)]">{item.issuer}</span>
                </span>
                <span className="shrink-0 font-mono text-[10.5px] text-[var(--fg-subtle)]">{item.year}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
