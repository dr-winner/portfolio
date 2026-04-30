"use client";

import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="inline-flex size-9 shrink-0" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={clsx(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors",
        "border-slate-300/80 bg-white text-slate-700 hover:border-cyber-400/50 hover:text-slate-900",
        "dark:border-white/10 dark:bg-ink-100/60 dark:text-white/65 dark:hover:border-cyber-300/35 dark:hover:text-white"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Sun className="size-3.5" aria-hidden /> : <Moon className="size-3.5" aria-hidden />}
    </button>
  );
}
