"use client";

/* Menu bar, brief 6.9. Left: the winnerOS mark opening the system menu
   (Welcome, About winnerOS, Settings, Keyboard shortcuts, Classic view,
   Restart), then the focused app name in weight 600. Right: the shield,
   the search icon, the control quick toggles, an SSR fixed width clock
   placeholder filled by Intl after mount with an Accra tooltip on hover,
   and the CV and Hire me quick actions. Menus open in 120ms with opacity
   and a 4px drop, arrows and Esc navigate them, brief 3.5 puts the
   focused scenario's app name front and centre for the shell to wire. */

import { useEffect, useRef, useState } from "react";
import { MarkIcon, ShieldIcon, SearchIcon, ControlIcon } from "../icons";
import { emitIntent } from "./bus";
import { useWm, wmStore } from "../wm/store";
import { WM_STORAGE_KEY } from "../wm/store";

const CLOCK_PLACEHOLDER = "--:--";

function useClock(): { text: string | null; accra: string | null } {
  const [text, setText] = useState<string | null>(null);
  const [accra, setAccra] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });
    const accraFormat = new Intl.DateTimeFormat(undefined, { timeZone: "Africa/Accra", hour: "numeric", minute: "2-digit" });
    const tick = () => {
      setText(format.format(new Date()));
      setAccra(accraFormat.format(new Date()));
    };
    tick();
    const timer = window.setInterval(tick, 30000);
    return () => window.clearInterval(timer);
  }, []);
  return { text, accra };
}

export function MenuBar() {
  const focused = useWm((s) => s.focused);
  const { text, accra } = useClock();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* Focus drives the title, brief 3.5: with no window focused the bar
     reads winnerOS. */
  const appTitle = (focused ? wmStore.getState().windows[focused]?.title : null) ?? "winnerOS";

  const systemItems: { id: string; label: string; action(): void }[] = [
    { id: "welcome", label: "Welcome", action: () => emitIntent({ type: "app:open", app: "welcome" }) },
    { id: "about-os", label: "About winnerOS", action: () => emitIntent({ type: "app:open", app: "about" }) },
    { id: "settings", label: "Settings", action: () => emitIntent({ type: "app:open", app: "settings" }) },
    { id: "shortcuts", label: "Keyboard shortcuts", action: () => emitIntent({ type: "app:open", app: "settings", slug: "shortcuts" }) },
    {
      id: "classic",
      label: "Classic view",
      action: () => {
        window.location.assign("/?view=classic");
      },
    },
    {
      /* Restart replays the boot and clears session state, brief 6.9. The
         boot replay lands with the boot sequence; clearing the stored
         session works today. */
      id: "restart",
      label: "Restart",
      action: () => {
        try {
          sessionStorage.removeItem(WM_STORAGE_KEY);
        } catch {
          /* Storage may be blocked, restart still reloads. */
        }
        window.location.reload();
      },
    },
  ];

  const onMenuKey = (event: React.KeyboardEvent) => {
    const items = Array.from(barRef.current?.querySelectorAll<HTMLElement>("[data-wos-menubar-item]") ?? []);
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = (Math.max(0, current) + (event.key === "ArrowRight" ? 1 : items.length - 1)) % items.length;
      items[next]?.focus();
      setOpenMenu(null);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpenMenu(null);
      emitIntent({ type: "menus:close" });
    }
  };

  return (
    <div
      className="wos-menubar"
      data-wos-region="menubar"
      ref={barRef}
      role="menubar"
      aria-label="winnerOS menu bar"
      onKeyDown={onMenuKey}
    >
      <div className="wos-menubar-inner">
        <div className="wos-menubar-left">
          <button
            type="button"
            data-wos-menubar-item
            data-wos-region-focus
            aria-expanded={openMenu === "system" ? "true" : "false"}
            aria-haspopup="menu"
            aria-label="System menu"
            className="wos-menubar-brand"
            data-open={openMenu === "system" ? "true" : "false"}
            onClick={() => setOpenMenu(openMenu === "system" ? null : "system")}
          >
            <MarkIcon width={16} />
          </button>
          {openMenu === "system" ? (
            <div className="wos-menu" role="menu" aria-label="System menu">
              {systemItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  className="wos-menu-item"
                  onClick={() => {
                    setOpenMenu(null);
                    item.action();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
          <span className="wos-menubar-app">{appTitle}</span>
        </div>
        <div className="wos-menubar-right">
          <a href="/security" className="wos-menubar-quick" aria-label="Security" data-wos-menubar-item>
            <ShieldIcon width={16} />
          </a>
          <button type="button" className="wos-menubar-quick" aria-label="Search" data-wos-menubar-item onClick={() => emitIntent({ type: "search:open" })}>
            <SearchIcon width={16} />
          </button>
          <button type="button" className="wos-menubar-quick" aria-label="Quick controls" data-wos-menubar-item onClick={() => emitIntent({ type: "toggles:open" })}>
            <ControlIcon width={16} />
          </button>
          <span className="wos-menubar-clock" data-wos-menubar-item tabIndex={0} title={accra ? `Richard is in Accra: ${accra}` : undefined}>
            {/* The server renders a fixed width placeholder and this fills
                after mount, no hydration mismatch, no layout shift. */}
            {text ?? CLOCK_PLACEHOLDER}
          </span>
          <a href="/cv.pdf" download className="wos-menubar-pill" data-wos-menubar-item>
            CV
          </a>
          <a href="/contact" className="wos-menubar-pill wos-menubar-pill-accent" data-wos-menubar-item>
            Hire me
          </a>
        </div>
      </div>
    </div>
  );
}
