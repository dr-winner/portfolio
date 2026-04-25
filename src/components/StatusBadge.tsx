import React from "react";
import clsx from "clsx";

export function StatusBadge({
  label,
  status = "online",
  className,
}: {
  label: string;
  status?: "online" | "idle" | "offline";
  className?: string;
}) {
  const dot =
    status === "online"
      ? "bg-ok-400"
      : status === "idle"
      ? "bg-signal-300"
      : "bg-white/40";

  return (
    <div
      className={clsx(
        "font-sans inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-100/80 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur",
        className
      )}
    >
      <span className="relative flex size-2">
        <span className={clsx("absolute inset-0 rounded-full opacity-60 animate-ping-large", dot)} />
        <span className={clsx("relative inline-flex size-2 rounded-full", dot)} />
      </span>
      <span className="tracking-tight">{label}</span>
    </div>
  );
}
