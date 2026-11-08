"use client";

import { useEffect, useState } from "react";

function currentTheme() {
  if (document.documentElement.classList.contains("light")) return "light";
  if (document.documentElement.classList.contains("dark")) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setTheme(next);
  }

  const checked = theme === "light";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-[6px] border border-[var(--line)] text-[var(--fg)]"
    >
      <span aria-hidden>{theme === null ? "◐" : checked ? "◑" : "◐"}</span>
    </button>
  );
}
