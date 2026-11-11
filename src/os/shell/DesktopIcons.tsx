"use client";

/* Desktop icons, brief line 101 and 814: a top right column of 88px cells
   in this order, Projects (folder), CV.pdf, README.md, Contact, then Agent
   Lab and Proxy as app shortcuts. Labels 12px, 2 lines max, never
   truncated mid word. Brief 123 gives openings: CV.pdf opens Preview and
   Contact opens Mail once the desktop shell wires them in phase 9. Until
   then, and per the interim wiring documented in the phase report, each
   icon stays a real link to the matching route. The list is a group of
   links with roving tabindex, arrows move. */

import { useRef, useState } from "react";
import { appIcons, FolderIcon } from "../icons";
import { site } from "@/content/site";
import type { AppId } from "../types";

interface DesktopIcon {
  label: string;
  /* The extension stays glued to its dot at every width, fix 9. */
  ext?: string;
  href: string;
  app: AppId | "folder";
}

const ICONS: DesktopIcon[] = [
  { label: "Projects", href: "/work", app: "folder" },
  { label: "CV", ext: ".pdf", href: "/cv.pdf", app: "preview" },
  { label: "README", ext: ".md", href: site.links.github, app: "doc" },
  { label: "Contact", href: "/contact", app: "mail" },
  { label: "Agent Lab", href: "/work/llm-agent-security-lab", app: "agent-lab" },
  { label: "Proxy", href: "/work/llm-agent-security-lab", app: "proxy" },
];

export function DesktopIcons() {
  const listRef = useRef<HTMLUListElement>(null);
  const [roving, setRoving] = useState(0);

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[data-wos-icon]") ?? []);
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const next = (Math.max(0, current) + (forward ? 1 : items.length - 1)) % items.length;
    items[next].focus();
    setRoving(next);
  };

  return (
    <ul
      ref={listRef}
      className="wos-icons"
      data-wos-region="icons"
      aria-label="Desktop icons"
      onKeyDown={onKey}
    >
      {ICONS.map((icon, index) => {
        const Icon = icon.app === "folder" ? FolderIcon : appIcons[icon.app];
        return (
          <li key={icon.label}>
            <a
              href={icon.href}
              data-wos-icon
              tabIndex={index === roving ? 0 : -1}
              className="wos-icon wos-focusable"
              aria-label={`${icon.label}${icon.ext ?? ""}`}
              onFocus={() => setRoving(index)}
              {...(index === 0 ? { "data-wos-region-focus": true } : {})}
            >
              <span className="wos-icon-tile wos-tile" aria-hidden>
                <Icon width={24} height={24} />
              </span>
              <span className="wos-icon-label">
                {icon.label}
                {icon.ext ? <span className="wos-icon-ext">{icon.ext}</span> : null}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
