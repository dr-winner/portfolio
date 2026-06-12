"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Command as CommandIcon, Mail, SquareTerminal, TerminalSquare } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MagneticButton } from "@/components/MagneticButton";
import { useOpenShell } from "@/components/ClientChrome";
import { profile } from "@/content/profile";

const scrollNavItems = [
  { id: "capabilities", label: "Capabilities" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certs" },
  { id: "about", label: "About" },
] as const;

export function Header() {
  const openShell = useOpenShell();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const sectionIds = useMemo(() => [...scrollNavItems.map((n) => n.id), "github-activity", "contact"], []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPaletteOpen(false);
        return;
      }
      const modK =
        (e.metaKey || e.ctrlKey) && (e.code === "KeyK" || e.key === "k" || e.key === "K");
      if (!modK) return;
      const el = e.target as HTMLElement | null;
      const inField = el?.closest("input, textarea, select, [contenteditable='true']");
      if (inField && !paletteOpen) return;
      e.preventDefault();
      e.stopPropagation();
      setPaletteOpen((p) => !p);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [paletteOpen]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header
        className={clsx(
          "font-sans fixed inset-x-0 top-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top,0px)]",
          scrolled
            ? "border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-ink/70"
            : "bg-transparent"
        )}
      >
        <div className="container grid h-14 min-h-14 w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 sm:gap-2 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex min-w-0 items-center gap-1.5 justify-self-start text-left text-sm font-mono text-slate-700 transition-colors hover:text-slate-950 dark:text-white/80 dark:hover:text-white sm:gap-2"
            aria-label="Go to top"
          >
            <TerminalSquare className="size-4 shrink-0 text-ocean-500 dark:text-ocean-300" />
            <span className="min-w-0 truncate font-semibold tracking-tight">{profile.handle}</span>
            <span className="hidden shrink-0 text-ocean-500 animate-cursor-blink dark:text-ocean-300 sm:inline">
              _
            </span>
          </button>

          <nav
            aria-label="Sections"
            className="hidden max-h-14 max-w-full min-w-0 items-center gap-0.5 overflow-x-auto overflow-y-hidden overscroll-x-contain whitespace-nowrap rounded-full border border-slate-200/80 bg-white/80 p-0.5 backdrop-blur [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 dark:bg-ink-100/60 lg:flex lg:justify-center [&::-webkit-scrollbar]:hidden"
          >
            {scrollNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jump(item.id)}
                data-active={active === item.id}
                className="nav-item"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1 md:gap-1.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={openShell}
              className="inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:border-ocean-400/40 hover:text-slate-900 md:h-9 md:w-auto md:gap-1.5 md:px-2.5 md:py-1.5 md:text-xs dark:hover:border-ocean-300/35 dark:hover:text-ocean-200 border-slate-300/85 bg-white text-slate-600 dark:border-white/10 dark:bg-ink-100/60 dark:text-white/75"
              aria-label="Open site console: ask a question in plain language, or type help"
              title="Site console (same look as a terminal; just type a question or help)"
            >
              <SquareTerminal className="size-3.5" aria-hidden />
              <span className="hidden md:inline">Console</span>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:border-ocean-400/35 hover:text-slate-900 md:h-9 md:w-auto md:gap-1.5 md:px-2.5 md:py-1.5 md:text-xs dark:hover:border-ocean-300/40 dark:hover:text-white border-slate-300/85 bg-white text-slate-600 dark:border-white/10 dark:bg-ink-100/60 dark:text-white/75"
              aria-label="Open command menu (sections and links)"
              title="Quick nav (⌘K)"
            >
              <CommandIcon className="size-3.5" aria-hidden />
              <span className="hidden md:inline">Menu</span>
              <span className="hidden lg:inline kbd">⌘K</span>
            </button>

            <MagneticButton strength={0.4}>
              <button
                onClick={() => jump("contact")}
                className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-ocean-300 to-signal-300 px-2.5 text-[11px] font-semibold leading-none text-ink shadow-glow-sm transition-shadow hover:shadow-glow md:h-10 md:min-w-10 md:gap-1.5 md:px-4 md:text-xs"
                aria-label="Go to contact section"
              >
                <Mail className="size-3.5 md:hidden" aria-hidden />
                <span className="hidden md:inline">Contact</span>
              </button>
            </MagneticButton>
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
