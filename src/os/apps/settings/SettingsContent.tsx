"use client";

/* Settings window content for Phase 1, fix 2 of the phase 1 review: the
   reduce motion toggle the brief asks for, plus the keyboard shortcuts
   dialog variant the system menu opens. The toggle writes
   data-wos-motion on the html element and persists it, and the shell
   chrome (dock magnification, window animations) reads that flag. */

import { useEffect, useState } from "react";

const MOTION_KEY = "wos:motion";

const SHORTCUTS = [
  { keys: "Alt W", action: "Close the focused window" },
  { keys: "Alt M or Alt Down", action: "Minimize the focused window" },
  { keys: "Alt Up", action: "Maximize or restore the focused window" },
  { keys: "Alt Left or Alt Right", action: "Snap the focused window to a screen half" },
  { keys: "Alt `", action: "Open the window switcher, Shift goes back" },
  { keys: "Cmd or Ctrl K", action: "Open search" },
  { keys: "F6", action: "Move focus across menu bar, windows, dock and icons" },
  { keys: "Esc", action: "Close menus, search or the switcher, never a window" },
];

export function SettingsContent({ shortcuts = false }: { shortcuts?: boolean }) {
  const [reduce, setReduce] = useState<boolean | null>(null);

  useEffect(() => {
    setReduce(document.documentElement.dataset.wosMotion === "reduce");
  }, []);

  const toggle = () => {
    const next = !(reduce ?? false);
    setReduce(next);
    document.documentElement.dataset.wosMotion = next ? "reduce" : "full";
    try {
      localStorage.setItem(MOTION_KEY, next ? "reduce" : "full");
    } catch {
      /* Storage may be blocked, the toggle still applies for the session. */
    }
  };

  if (shortcuts) {
    return (
      <div className="wos-settings">
        <p className="wos-window-note">Every shortcut also works from the menu bar and the dock.</p>
        <ul className="wos-shortcuts">
          {SHORTCUTS.map((item) => (
            <li key={item.keys}>
              <kbd className="wos-kbd">{item.keys}</kbd>
              <span>{item.action}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="wos-settings">
      <p className="wos-window-note">One preference for now, more arrive with the apps they belong to.</p>
      <section className="wos-filesgroup">
        <h3 className="wos-listhead">Motion</h3>
        <div className="wos-settingrow">
          <p className="wos-settingtext">Reduce motion</p>
          <button
            type="button"
            className="wos-btn wos-btn-ghost"
            aria-pressed={reduce ? "true" : "false"}
            disabled={reduce === null}
            onClick={toggle}
          >
            {reduce ? "On" : "Off"}
          </button>
        </div>
        <p className="wos-settingnote">Turns off dock magnification and the window minimize and restore animations. Your system reduced motion setting is always respected.</p>
      </section>
    </div>
  );
}
