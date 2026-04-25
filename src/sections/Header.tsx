"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Command as CommandIcon, Mail, SquareTerminal, TerminalSquare } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { useOpenShell } from "@/components/ClientChrome";

const navItems = [
  { id: "capabilities", label: "Capabilities" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certs" },
  { id: "about", label: "About" },
  { id: "github-activity", label: "GitHub" },
];

export function Header() {
  const openShell = useOpenShell();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const sectionIds = useMemo(() => [...navItems.map((n) => n.id), "contact"], []);

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
          scrolled ? "bg-ink/70 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="container grid h-14 min-h-14 w-full max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto]">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex min-w-0 items-center gap-1.5 justify-self-start text-left text-sm font-mono text-white/80 transition-colors hover:text-white sm:gap-2"
            aria-label="Go to top"
          >
            <TerminalSquare className="size-4 shrink-0 text-cyber-300" />
            <span className="min-w-0 truncate font-semibold tracking-tight">dr_winner</span>
            <span className="hidden shrink-0 text-cyber-300 animate-cursor-blink sm:inline">_</span>
          </button>

          <nav className="hidden w-full min-w-0 items-center justify-center gap-0.5 rounded-full border border-white/10 bg-ink-100/60 p-0.5 backdrop-blur md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => jump(item.id)}
                data-active={active === item.id}
                className="nav-item"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={openShell}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-ink-100/60 text-white/60 transition-colors hover:border-cyber-300/35 hover:text-cyber-200 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs"
              aria-label="Open site console: ask a question in plain language, or type help"
              title="Site console (same look as a terminal; just type a question or help)"
            >
              <SquareTerminal className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Console</span>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-ink-100/60 text-white/60 transition-colors hover:border-cyber-300/40 hover:text-white sm:h-9 sm:w-auto sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs"
              aria-label="Open command menu (sections and links)"
              title="Quick nav (⌘K)"
            >
              <CommandIcon className="size-3.5" aria-hidden />
              <span className="hidden sm:inline">Menu</span>
              <span className="hidden sm:inline kbd">⌘K</span>
            </button>
            <button
              onClick={() => jump("contact")}
              className="inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-cyber-300 to-signal-300 px-3 text-xs font-semibold text-ink shadow-glow-sm transition-shadow hover:shadow-glow sm:min-w-0 sm:gap-1.5 sm:px-4"
              aria-label="Go to contact section"
            >
              <Mail className="size-3.5 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
