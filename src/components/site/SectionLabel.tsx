type SectionLabelProps = {
  index?: string;
  title: string;
  tone?: "signal" | "ai" | "muted";
};

const tones = {
  signal: "text-[var(--signal)]",
  ai: "text-[var(--ai)]",
  muted: "text-[var(--fg-muted)]",
} as const;

/**
 * Console-style section header: `[ 01 · EVIDENCE ] ───────`
 */
export function SectionLabel({ index, title, tone = "signal" }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`shrink-0 font-mono text-[12px] uppercase tracking-[0.14em] ${tones[tone]}`}>
        {index ? `[ ${index} · ${title} ]` : `[ ${title} ]`}
      </span>
      <span aria-hidden className="fx-rule h-px w-auto flex-1 bg-[var(--line)]" />
    </div>
  );
}
