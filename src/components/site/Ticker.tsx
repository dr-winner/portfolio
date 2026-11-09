/**
 * Infinite CSS marquee. Content is duplicated once (second copy aria-hidden)
 * and the track translates -50%, so the loop is seamless.
 */
export function Ticker({
  items,
  duration = 46,
  className = "",
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="m-0 flex shrink-0 list-none items-center gap-5 p-0 pr-5"
    >
      {items.map((item, i) => (
        <li
          key={`${hidden ? "b" : "a"}-${i}`}
          className="flex items-center gap-5 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]"
        >
          <span className="h-1 w-1 rounded-full bg-[var(--signal)] opacity-70" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  if (items.length === 0) return null;

  return (
    <div className={`fx-marquee relative overflow-hidden ${className}`} style={{ ["--marquee-duration" as string]: `${duration}s` }}>
      <div className="fx-marquee-track">
        {row(false)}
        {row(true)}
      </div>
      {/* Edge fades so entries dissolve instead of clipping */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-[linear-gradient(to_right,var(--bg),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-[linear-gradient(to_left,var(--bg),transparent)]" />
    </div>
  );
}
