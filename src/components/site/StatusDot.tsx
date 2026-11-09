/**
 * Live-signal status dot with a breathing halo (CSS-driven, aria-hidden by default).
 */
export function StatusDot({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="fx-pulse inline-block h-[7px] w-[7px] rounded-full bg-[var(--signal)] text-[var(--signal)]"
      />
      {label ? (
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">{label}</span>
      ) : null}
    </span>
  );
}
