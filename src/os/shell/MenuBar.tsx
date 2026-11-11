"use client";

/* Menu bar, brief 6.9, restructured in fix 2 of the phase 1 review. Left:
   a real menubar (role=menubar) with the winnerOS mark opening the system
   menu (Welcome, About winnerOS, Settings, Keyboard shortcuts, Classic
   view, Restart), then the app menus that follow the focused window
   (File, Window, Help, only real dispatches), then the focused app name
   in weight 600. Right: a toolbar (role=toolbar) with the shield, the
   search icon, the control quick toggles, an SSR fixed width clock
   placeholder filled by Intl after mount with an Accra tooltip, and the
   CV and Hire me quick actions. Menus open in 120ms with opacity and a
   4px drop, arrows and Esc navigate them, Esc and the shell close them
   through the menus close intent. */

import { useEffect, useRef, useState } from "react";
import { MarkIcon, ShieldIcon, SearchIcon, ControlIcon } from "../icons";
import { dispatchWm, useWm, wmStore } from "../wm/store";
import { WM_STORAGE_KEY } from "../wm/store";
import { emitIntent, onIntent } from "./bus";

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

type MenuItem = { id: string; label: string; disabled?: boolean; action(): void };
type Menu = { id: string; label: string; items: MenuItem[] };

export function MenuBar() {
  const focusedSig = useWm((s) =>
    s.focused ? `${s.focused}~${s.windows[s.focused]?.title ?? ""}~${s.windows[s.focused]?.mode ?? ""}` : "-",
  );
  const { text, accra } = useClock();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  /* The shell and the Escape key close menus through this intent. */
  useEffect(
    () =>
      onIntent((intent) => {
        if (intent.type === "menus:close") setOpenMenu(null);
      }),
    [],
  );

  /* A pointer down outside the bar closes any open menu. */
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (barRef.current?.contains(event.target as Node)) return;
      setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, [openMenu]);

  const [focusedId, focusedTitle] = focusedSig.split("~");
  const hasFocused = focusedId !== "-" && Boolean(wmStore.getState().windows[focusedId]);

  /* Focus drives the title, brief 3.5: with no window focused the bar
     reads winnerOS. */
  const appTitle = hasFocused ? focusedTitle : "winnerOS";

  const systemItems: MenuItem[] = [
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
      /* Restart replays the boot and clears the stored session. */
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

  /* App menus, brief 6.9: they follow the focused window and carry only
     real dispatches, no decoration items. Disabled without a window. */
  const appMenus: Menu[] = [
    {
      id: "file",
      label: "File",
      items: [
        {
          id: "close",
          label: "Close window",
          disabled: !hasFocused,
          action: () => dispatchWm({ type: "close", payload: { id: focusedId } }),
        },
        {
          id: "minimize",
          label: "Minimize window",
          disabled: !hasFocused,
          action: () => dispatchWm({ type: "minimize", payload: { id: focusedId } }),
        },
        {
          id: "copylink",
          label: "Copy page link",
          disabled: !hasFocused,
          action: () => {
            const slug = focusedId.startsWith("doc:") ? `/work/${focusedId.slice(4)}` : window.location.pathname;
            try {
              void navigator.clipboard.writeText(`${window.location.origin}${slug}`);
            } catch {
              /* Clipboard may be blocked, the item stays a no-op then. */
            }
          },
        },
        {
          id: "classicpage",
          label: "Open the classic page",
          action: () => window.location.assign(`${window.location.pathname}?view=classic`),
        },
      ],
    },
    {
      id: "window",
      label: "Window",
      items: [
        {
          id: "min",
          label: "Minimize",
          disabled: !hasFocused,
          action: () => dispatchWm({ type: "minimize", payload: { id: focusedId } }),
        },
        {
          id: "zoom",
          label: "Zoom",
          disabled: !hasFocused,
          action: () => dispatchWm({ type: "toggleMaximize", payload: { id: focusedId } }),
        },
        {
          id: "snapleft",
          label: "Snap left",
          disabled: !hasFocused,
          action: () => dispatchWm({ type: "snap", payload: { id: focusedId, side: "left" } }),
        },
        {
          id: "snapright",
          label: "Snap right",
          disabled: !hasFocused,
          action: () => dispatchWm({ type: "snap", payload: { id: focusedId, side: "right" } }),
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [
        { id: "about", label: "About winnerOS", action: () => emitIntent({ type: "app:open", app: "about" }) },
        { id: "keys", label: "Keyboard shortcuts", action: () => emitIntent({ type: "app:open", app: "settings", slug: "shortcuts" }) },
      ],
    },
  ];

  const trigger = (menu: { id: string; label: string; system?: boolean }) => (
    <button
      type="button"
      data-wos-menubar-item
      {...(menu.system ? { "data-wos-region-focus": true } : {})}
      aria-expanded={openMenu === menu.id ? "true" : "false"}
      aria-haspopup="menu"
      aria-label={menu.system ? `${menu.label} menu` : undefined}
      className={menu.system ? "wos-menubar-brand" : "wos-menubar-menu"}
      data-open={openMenu === menu.id ? "true" : "false"}
      onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
    >
      {menu.system ? <MarkIcon width={16} /> : menu.label}
    </button>
  );

  const dropdown = (menu: Menu | null) =>
    menu ? (
      <div className="wos-menu" role="menu" aria-label={menu.label}>
        {menu.items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="wos-menu-item"
            disabled={item.disabled}
            onClick={() => {
              setOpenMenu(null);
              item.action();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    ) : null;

  const onMenuKey = (event: React.KeyboardEvent) => {
    const items = Array.from(barRef.current?.querySelectorAll<HTMLElement>("[data-wos-menubar-item]:not(:disabled)") ?? []);
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
    <div className="wos-menubar" data-wos-region="menubar">
      <div className="wos-menubar-inner">
        <div className="wos-menubar-left" role="menubar" aria-label="winnerOS menus" ref={barRef} onKeyDown={onMenuKey}>
          {trigger({ id: "system", label: "System", system: true })}
          {openMenu === "system" ? dropdown({ id: "system", label: "System menu", items: systemItems }) : null}
          {hasFocused ? appMenus.map((menu) => <span key={menu.id} className="wos-menubar-group">{trigger(menu)}{openMenu === menu.id ? dropdown(menu) : null}</span>) : null}
          <span className="wos-menubar-app">{appTitle}</span>
        </div>
        <div className="wos-menubar-right" role="toolbar" aria-label="Quick actions">
          <a href="/security" className="wos-menubar-quick" aria-label="Security">
            <ShieldIcon width={16} />
          </a>
          <button type="button" className="wos-menubar-quick" aria-label="Search" onClick={() => emitIntent({ type: "search:open" })}>
            <SearchIcon width={16} />
          </button>
          <button type="button" className="wos-menubar-quick" aria-label="Quick controls" onClick={() => emitIntent({ type: "toggles:open" })}>
            <ControlIcon width={16} />
          </button>
          <span className="wos-menubar-clock" tabIndex={0} title={accra ? `Richard is in Accra: ${accra}` : undefined}>
            {/* The server renders a fixed width placeholder and this fills
                after mount, no hydration mismatch, no layout shift. */}
            {text ?? CLOCK_PLACEHOLDER}
          </span>
          <a href="/cv.pdf" download className="wos-menubar-pill">
            CV
          </a>
          <a href="/contact" className="wos-menubar-pill wos-menubar-pill-accent">
            Hire me
          </a>
        </div>
      </div>
    </div>
  );
}
