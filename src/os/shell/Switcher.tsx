"use client";

/* Window switcher, brief 3.9: a horizontal strip centred on screen with
   12px padding on the glass layer. One item per open window, minimized
   windows dim and restore when chosen. Opens in 120ms with scale 0.98 to
   1. Arrow keys or Alt backtick move, Alt release or Enter chooses. */

import { appIcons } from "../icons";

export interface SwitcherEntry {
  id: string;
  title: string;
  mode: "normal" | "maximized" | "snapped-left" | "snapped-right" | "minimized";
  app: Parameters<(typeof appIcons)[keyof typeof appIcons]>[0];
}

export function Switcher({
  entries,
  index,
  onSelect,
  onAccept,
  onClose,
}: {
  entries: { id: string; app: string; title: string; mode: string }[];
  index: number;
  onSelect(index: number): void;
  onAccept(): void;
  onClose(): void;
}) {
  if (!entries.length) return null;
  return (
    <div className="wos-switcher-backdrop" onClick={onClose} role="presentation">
      <div
        className="wos-switcher"
        role="dialog"
        aria-label="Window switcher"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            onAccept();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            onSelect(index + 1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onSelect(index - 1);
          }
        }}
      >
        {entries.map((entry, i) => {
          const Icon = appIcons[(entry.app as keyof typeof appIcons) ?? "welcome"] ?? appIcons.welcome;
          return (
            <button
              type="button"
              key={entry.id}
              tabIndex={-1}
              data-selected={i === index ? "true" : "false"}
              data-minimized={entry.mode === "minimized" ? "true" : "false"}
              onMouseEnter={() => onSelect(i)}
              onClick={() => {
                onSelect(i);
                onAccept();
              }}
              className="wos-switcher-item"
            >
              <span className="wos-tile">
                <Icon width={28} height={28} />
              </span>
              <span className="wos-switcher-title">{entry.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
