"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cvHref, mailto, site } from "@/content/site";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/security", label: "Security" },
];

export function SiteMenu({ onClose }: { onClose: () => void }) {
  const [entered, setEntered] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className={`sheet-root ${entered ? "is-in" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="sheet-panel"
        onPointerDown={(event) => {
          if (event.currentTarget === event.target || (event.target as HTMLElement).dataset.handle === "true") {
            startY.current = event.clientY;
          }
        }}
        onPointerMove={(event) => {
          if (startY.current === null) return;
          const dy = event.clientY - startY.current;
          if (dy > 0) event.currentTarget.style.transform = `translateY(${dy}px)`;
        }}
        onPointerUp={(event) => {
          if (startY.current === null) return;
          const dy = event.clientY - startY.current;
          startY.current = null;
          event.currentTarget.style.transform = "";
          if (dy > 80) onClose();
        }}
      >
        <button type="button" data-handle="true" className="mx-auto mb-6 h-11 w-16" aria-label="Close menu" onClick={onClose}>
          <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-[var(--line-strong)]" />
        </button>
        <nav aria-label="Mobile">
          {links.map((link, index) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="sheet-link" style={{ animationDelay: `${index * 40}ms` }}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <a href={cvHref} download className="pressable inline-flex h-12 items-center justify-center rounded-[10px] bg-[var(--signal)] font-medium text-[var(--on-signal)] no-underline">
            Download CV
          </a>
          <a href={mailto} className="pressable inline-flex h-12 items-center justify-center rounded-[10px] border border-[var(--line-strong)] text-[var(--fg)] no-underline">
            Email {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
