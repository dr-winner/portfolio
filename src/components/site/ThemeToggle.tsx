"use client";

import { useEffect, useState } from "react";

/* The site's only default is dark. Light exists solely as the html.light
   class set by this toggle (plus its cookie), so class presence is the
   whole truth; the OS preference never answers for the site. */
function currentTheme() {
  if (document.documentElement.classList.contains("light")) return "light";
  return "dark";
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
  const known = theme !== null;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggle}
      className="group inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-[6px] border border-[var(--line)] text-[var(--fg-muted)] transition-colors hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
    >
      {/* Sun / moon crossfade + rotation; neutral dial paint until theme is known */}
      <span aria-hidden className="relative block h-4 w-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            known ? "opacity-0 scale-75" : "opacity-100 rotate-0"
          } ${known ? "pointer-events-none" : ""}`}
        >
          {/* Neutral half-dial while the stored theme resolves server-side */}
          <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.35" />
          <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            known && checked ? "rotate-0 opacity-100" : known ? "-rotate-90 opacity-0" : "opacity-0"
          }`}
        >
          <circle cx="12" cy="12" r="4.2" className="fill-current" stroke="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1="12" y1="3.4" x2="12" y2="5.4" transform={`rotate(${deg} 12 12)`} />
          ))}
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`absolute inset-0 h-full w-full transition-all duration-300 ${
            known && !checked ? "rotate-0 opacity-100" : known ? "rotate-90 opacity-0" : "opacity-0"
          }`}
        >
          <path d="M20 13.6A8.2 8.2 0 1 1 10.9 4a6.6 6.6 0 0 0 9.1 9.6Z" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
