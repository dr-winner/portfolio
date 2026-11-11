"use client";

/* Desktop icons, brief line 101 and 814: a top right column of 88px cells
   in this order, Projects (folder), CV.pdf, README.md, Contact, then Agent
   Lab and Proxy as app shortcuts. Labels 12px, 2 lines max, never
   truncated mid word. Brief 123 gives openings: CV.pdf opens Preview,
   Contact opens Mail. Fix 3 of the phase 1 review: each icon carries
   data-wos-open, so with the shell mounted the document capture listener
   opens the matching window instead of navigating, README.md opens the
   README document window and never leaves the site for GitHub, and the
   href stays as the no JavaScript fallback path. */

import { useRef, useState } from "react";
import { appIcons, FolderIcon } from "../icons";
import type { AppId } from "../types";

interface DesktopIcon {
  label: string;
  /* The extension stays glued to its dot at every width, fix 9. */
  ext?: string;
  href: string;
  app: AppId | "folder";
  /* The interception target for the shell, fix 3. */
  open?: string;
}

const ICONS: DesktopIcon[] = [
  { label: "Projects", href: "/work", app: "folder", open: "files" },
  { label: "CV", ext: ".pdf", href: "/cv.pdf", app: "preview", open: "preview" },
  { label: "README", ext: ".md", href: "/classic", app: "doc", open: "doc:readme" },
  { label: "Contact", href: "/contact", app: "mail", open: "mail" },
  { label: "Agent Lab", href: "/classic", app: "agent-lab", open: "agent-lab" },
  { label: "Proxy", href: "/classic", app: "proxy", open: "proxy" },
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
              {...(icon.open ? { "data-wos-open": icon.open } : {})}
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
