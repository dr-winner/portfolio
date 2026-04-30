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
      : "bg-slate-400/80 dark:bg-white/40";

  return (
    <div
      className={clsx(
        "font-sans inline-flex max-w-full min-w-0 items-center gap-2.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur",
        "border-slate-300/80 bg-white/90 text-slate-800 dark:border-white/10 dark:bg-ink-100/80 dark:text-white/80",
        className
      )}
    >
      <span className="relative flex size-2">
        <span className={clsx("absolute inset-0 rounded-full opacity-60 animate-ping-large", dot)} />
        <span className={clsx("relative inline-flex size-2 rounded-full", dot)} />
      </span>
      <span className="min-w-0 break-words tracking-tight">{label}</span>
    </div>
  );
}
