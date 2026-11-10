import { cvHref } from "@/content/site";

/* Minimal line icons, drawn inline so no runtime icon library is added. */
function Icon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (name === "LinkedIn") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 11v5M8 8v.01M12 16v-3a2 2 0 0 1 4 0v3" />
      </svg>
    );
  }
  if (name === "GitHub") {
    return (
      <svg {...common}>
        <path d="M6 8a4 4 0 0 1 4 0v6a4 4 0 0 1-4 0" />
        <path d="M6 8v8" />
        <path d="M18 8a4 4 0 0 0-4 3.9V20a2 2 0 0 0 4 0" />
        <path d="M18 8v4" />
      </svg>
    );
  }
  if (name === "X") {
    return (
      <svg {...common}>
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    );
  }
  /* CV */
  return (
    <svg {...common}>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

export function LinkCard({ href, label, handle }: { href: string; label: string; handle: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : { download: "Richard-Winner-Duvor-AppSec-CV.pdf" })}
      className="group flex min-h-[64px] items-center gap-4 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 no-underline transition-colors duration-[var(--dur-1)] hover:border-[var(--line-strong)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-[var(--line)] text-[var(--fg-muted)] transition-colors duration-[var(--dur-1)] group-hover:border-[var(--signal)]/60 group-hover:text-[var(--signal)]">
        <Icon name={label} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium text-[var(--fg)]">{label}</span>
        <span className="block truncate font-mono text-[12px] text-[var(--fg-subtle)]">{handle}</span>
      </span>
      <span aria-hidden className="arrow-shift shrink-0 text-[var(--fg-subtle)] transition-colors duration-[var(--dur-1)] group-hover:text-[var(--signal)]">
        {external || href === cvHref ? "↗" : "→"}
      </span>
    </a>
  );
}
