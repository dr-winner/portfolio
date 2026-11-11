/**
 * Live-signal status dot with a breathing halo (CSS-driven, aria-hidden by default).
 */
export function StatusDot({ label, pulse = false }: { label?: string; pulse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={`inline-block h-2 w-2 rounded-full bg-[var(--signal)] ${pulse ? "status-ring" : ""}`}
      />
      {label ? (
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">{label}</span>
      ) : null}
    </span>
  );
}
