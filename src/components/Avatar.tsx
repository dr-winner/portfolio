import React from "react";
import clsx from "clsx";

const palettes = {
  ocean: "from-ocean-300 to-ocean-500",
  signal: "from-signal-300 to-signal-500",
  ok: "from-ok-400 to-ocean-500",
} as const;

export function Avatar({
  initials,
  accent = "ocean",
  size = 48,
  className,
}: {
  initials: string;
  accent?: keyof typeof palettes;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative inline-flex items-center justify-center rounded-full font-mono font-semibold text-ink-50 shadow-glow-sm",
        "bg-gradient-to-br",
        palettes[accent],
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      <span className="absolute inset-0 rounded-full border border-white/20" />
      <span className="relative tracking-tight">{initials}</span>
    </div>
  );
}
