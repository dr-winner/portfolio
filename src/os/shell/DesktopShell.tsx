"use client";

/* The interactive desktop shell, brief 7.1 and fix 2 of the phase 1
   review. It mounts once on the OS frame and does five jobs:
   1. adopts the server rendered window shells in place, measuring their
      painted geometry and handing it to the window manager store, so
      nothing remounts and nothing shifts,
   2. restores a stored session (validated and clamped by persistence)
      and applies ?open= deep links on top,
   3. keeps the store and the DOM in sync, painting geometry, z order,
      focus and minimized state, with the genie minimize and restore
      choreography to the dock icon rect,
   4. runs the shell keyboard (search, switcher, menus) through
      installKeyboard, and the shell intents from the chrome,
   5. renders windows the store opens later (the Hello proof app, deep
      link documents) with the content registry below.
   Link interception, fix 3 of the phase 1 review: a capture phase
   document listener turns data-wos-open clicks into window opens, so
   dock tiles, desktop icons and in window links open windows instead of
   navigating. Their hrefs stay as the no JavaScript fallbacks. */

import { useEffect, useMemo, useRef, useState } from "react";
import { computeWorkArea, DEFAULT_TITLES, DOCK_RESERVE_DEFAULT } from "../wm/geometry";
import { dispatchWm, useWm, wmStore } from "../wm/store";
import { WM_STORAGE_KEY } from "../wm/store";
import { parseSession, parseDeepLink, serializeSession, sessionToState } from "../wm/persistence";
import { installKeyboard } from "../wm/keyboard";
import { bindWindow, createResizeZones, snapHintBus, type SnapHint } from "./window-adapter";
import { Window } from "./Window";
import { SnapPreview } from "./SnapPreview";
import { SearchDialog } from "./SearchDialog";
import { Switcher } from "./Switcher";
import { Toasts } from "./Toasts";
import { emitIntent, onIntent } from "./bus";
import type { AppId } from "../types";
import type { WinState } from "../wm/reducer";
import { WelcomeContent } from "../apps/welcome/WelcomeContent";
import { HelloContent } from "../apps/hello/HelloContent";
import { FilesWindowContent } from "../apps/files/FilesWindowContent";
import { AboutWindowContent } from "../apps/about/AboutWindowContent";
import { MailWindowContent } from "../apps/mail/MailWindowContent";
import { SecurityWindowContent } from "../apps/security/SecurityWindowContent";
import { TerminalContent } from "../apps/terminal/TerminalContent";
import { ProxyContent } from "../apps/proxy/ProxyContent";
import { AgentLabContent } from "../apps/agentlab/AgentLabContent";
import { FindingsContent } from "../apps/findings/FindingsContent";
import { DetectionsContent } from "../apps/detections/DetectionsContent";
import { PreviewContent } from "../apps/preview/PreviewContent";
import { SettingsContent } from "../apps/settings/SettingsContent";
import { DocContent } from "../apps/doc/DocContent";
import { publishedWork } from "@/content/work";

/* The mounted flag the review checks: set as early as this client chunk
   evaluates, guarded because the module also evaluates during SSR. */
if (typeof document !== "undefined") {
  document.documentElement.dataset.wosShell = "1";
}

const MOTION_KEY = "wos:motion";
const GENIE_MINIMIZE_MS = 380;
const GENIE_RESTORE_MS = 320;
const GENIE_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

/* Content registry for windows the shell renders itself. Adopted server
   shells keep their own DOM, this only runs for later opens and for
   windows restored from a stored session. */
function contentFor(win: WinState): React.ReactNode {
  switch (win.app) {
    case "welcome":
      return <WelcomeContent />;
    case "hello":
      return <HelloContent index={Number(win.id.split(":")[1] ?? 1) || 1} />;
    case "files":
      return <FilesWindowContent />;
    case "about":
      return <AboutWindowContent />;
    case "mail":
      return <MailWindowContent />;
    case "security":
      return <SecurityWindowContent />;
    case "terminal":
      return <TerminalContent />;
    case "proxy":
      return <ProxyContent />;
    case "agent-lab":
      return <AgentLabContent />;
    case "findings":
      return <FindingsContent />;
    case "detections":
      return <DetectionsContent />;
    case "preview":
      return <PreviewContent />;
    case "settings":
      return <SettingsContent shortcuts={win.props?.slug === "shortcuts"} />;
    case "doc":
      return <DocContent slug={win.props?.slug ?? win.id.slice(4)} />;
    default:
      return <p className="wos-window-note">This window has no content registered.</p>;
  }
}

function motionReduced(): boolean {
  if (document.documentElement.dataset.wosMotion === "reduce") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ── Link interception, fix 3 of the phase 1 review ──────────────────────
   Dock tiles, desktop icons and in window links carry data-wos-open. While
   the shell is mounted, a capture phase document listener turns those
   clicks into window opens, so a click on Projects or Files opens a window
   instead of landing on a full page under the chrome. Capture on document
   runs before the framework root handlers, so stopping there beats the
   client side navigation of a next/link anchor as well. Anchors without a
   known target are left alone: external links, the CV file and the classic
   view routes keep navigating, and with JavaScript disabled the href
   fallbacks are the only paths. */

/* Every app id a link may open. doc is not here, it needs a slug. */
const INTERCEPT_APPS: readonly AppId[] = [
  "welcome",
  "hello",
  "files",
  "terminal",
  "proxy",
  "agent-lab",
  "findings",
  "detections",
  "about",
  "mail",
  "preview",
  "settings",
  "security",
];

type OpenRequest = { kind: "app"; app: AppId } | { kind: "doc"; slug: string };

export function parseOpenTarget(value: string | null): OpenRequest | null {
  if (!value) return null;
  if (value.startsWith("doc:")) {
    const slug = value.slice(4);
    return /^[a-z0-9][a-z0-9-]*$/.test(slug) ? { kind: "doc", slug } : null;
  }
  return (INTERCEPT_APPS as readonly string[]).includes(value) ? { kind: "app", app: value as AppId } : null;
}

export function dispatchOpenTarget(request: OpenRequest): void {
  if (request.kind === "app") {
    dispatchWm({ type: "open", payload: { app: request.app, id: request.app, title: DEFAULT_TITLES[request.app] } });
    return;
  }
  const item = publishedWork.find((entry) => entry.slug === request.slug);
  const title = item?.title ?? (request.slug === "readme" ? "README.md" : DEFAULT_TITLES.doc);
  dispatchWm({ type: "open", payload: { app: "doc", id: `doc:${request.slug}`, title, props: { slug: request.slug } } });
}

function windowEl(id: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-wm-window="${id}"]`);
}

/* Dock rect for the genie animation: the minimized restore button when
   one exists, otherwise the app tile, otherwise nothing. */
function dockRectFor(app: AppId): DOMRect | null {
  const btn = document.querySelector<HTMLElement>(`[data-wos-dock-app="${app}"][data-wos-minimized="true"]`);
  const tile = btn ?? document.querySelector<HTMLElement>(`[data-wos-dock-app="${app}"]`);
  return tile?.getBoundingClientRect() ?? null;
}

/* One window painted from the store: geometry, z, focus and minimized
   visibility. Adopted server shells get lifted out of their CSS centring
   block exactly once, then the store owns every value. Paint pauses for
   a window that is mid drag (the adapter owns the box) or mid animation
   (the genie owns it until it finishes). */
function paintOne(id: string): void {
  const state = wmStore.getState();
  const win = state.windows[id];
  const el = windowEl(id);
  if (!win || !el) return;
  if (el.dataset.wosAnimating === "true" || el.dataset.dragging === "true") return;
  if (el.dataset.wosStatic === "true") {
    el.style.left = "0";
    el.style.top = "0";
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.margin = "0";
    el.dataset.wosStatic = "false";
  }
  el.style.transform = `translate3d(${Math.round(win.x)}px, ${Math.round(win.y)}px, 0)`;
  el.style.width = `${Math.round(win.w)}px`;
  el.style.height = `${Math.round(win.h)}px`;
  el.style.zIndex = String(win.z);
  const minimized = win.mode === "minimized";
  el.style.visibility = minimized ? "hidden" : "visible";
  el.style.contentVisibility = minimized ? "hidden" : "visible";
  el.dataset.wmMode = win.mode;
  el.dataset.state = state.focused === id && !minimized ? "focused" : "blur";
}

function paintAll(): void {
  for (const id of wmStore.getState().order) paintOne(id);
}

/* Genie minimize and restore, brief 3.4: the window box animates to or
   from the dock icon rect with the minimize curve. The minimize starts
   before the paint hides the window, the restore plays over the painted
   end state. Skipped for reduced motion or a missing dock icon. */
function genie(id: string, win: WinState, direction: "minimize" | "restore"): void {
  const el = windowEl(id);
  if (!el || motionReduced()) return;
  const dock = dockRectFor(win.app);
  if (!dock) return;
  const box = el.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const scale = Math.max(0.08, Math.min(0.6, dock.width / box.width));
  const atDock = `translate3d(${Math.round(dock.left + dock.width / 2 - box.width / 2)}px, ${Math.round(dock.top + dock.height / 2 - box.height / 2)}px, 0) scale(${scale.toFixed(3)})`;
  const atRest = `translate3d(${Math.round(box.left)}px, ${Math.round(box.top)}px, 0) scale(1)`;
  const keyframes =
    direction === "minimize"
      ? [{ transform: atRest, opacity: 1 }, { transform: atDock, opacity: 0.4 }]
      : [{ transform: atDock, opacity: 0.4 }, { transform: atRest, opacity: 1 }];
  const duration = direction === "minimize" ? GENIE_MINIMIZE_MS : GENIE_RESTORE_MS;
  el.style.transformOrigin = "center";
  el.dataset.wosAnimating = "true";
  const anim = el.animate(keyframes, { duration, easing: GENIE_EASING, fill: direction === "minimize" ? "both" : "backwards" });
  anim.addEventListener("finish", () => {
    el.dataset.wosAnimating = "false";
    anim.cancel();
    paintOne(id);
  });
}

export function DesktopShell() {
  const adoptedRef = useRef<Set<string>>(new Set());
  const cleanupsRef = useRef<(() => void)[]>([]);
  const readyRef = useRef(false);
  const searchOpenRef = useRef(false);
  const switcherRef = useRef<{ entries: { id: string; app: string; title: string; mode: string }[]; index: number } | null>(null);
  const [adopted, setAdopted] = useState<Set<string>>(() => new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [switcher, setSwitcher] = useState<{ entries: { id: string; app: string; title: string; mode: string }[]; index: number } | null>(null);

  searchOpenRef.current = searchOpen;
  switcherRef.current = switcher;

  const order = useWm((s) => s.order);

  /* ── Init: work area, session, adoption, deep link ─────────────────── */
  useEffect(() => {
    /* Motion preference before anything animates. */
    try {
      const storedMotion = localStorage.getItem(MOTION_KEY);
      if (storedMotion) document.documentElement.dataset.wosMotion = storedMotion;
    } catch {
      /* Storage may be blocked. */
    }

    const measureReserve = () => {
      const dock = document.querySelector<HTMLElement>(".wos-dock");
      if (!dock) return DOCK_RESERVE_DEFAULT;
      return Math.max(72, Math.round(window.innerHeight - dock.getBoundingClientRect().top + 8));
    };
    const reserve = measureReserve();

    /* Session first: the stored layout wins over a fresh adoption. */
    let stored: ReturnType<typeof parseSession> = null;
    try {
      stored = parseSession(sessionStorage.getItem(WM_STORAGE_KEY));
    } catch {
      /* Storage may be blocked. */
    }
    wmStore.setState(() => sessionToState(stored, window.innerWidth, window.innerHeight, reserve));

    /* Adopt every static, server rendered window in the DOM. Windows the
       stored session already contains are only bound, their geometry
       comes from the store. Missing ones are opened at their painted
       box. Elements the session dropped (closed last visit) are removed
       so the restored desktop is exactly what was stored. */
    const statics = Array.from(document.querySelectorAll<HTMLElement>("[data-wm-window][data-wos-static='true']"));
    const adoptedIds = new Set<string>();
    for (const el of statics) {
      const id = el.dataset.wmWindow;
      const app = (el.dataset.wosApp ?? "doc") as AppId;
      if (!id) continue;
      adoptedIds.add(id);
      if (!wmStore.getState().windows[id]) {
        const rect = el.getBoundingClientRect();
        const title = el.querySelector(".wos-window-title")?.textContent?.trim() || DEFAULT_TITLES[app];
        const props = app === "doc" ? { slug: id.slice(4) } : undefined;
        dispatchWm({ type: "open", payload: { app, id, title, props, at: { x: rect.left, y: rect.top, w: rect.width, h: rect.height } } });
      }
      const unbind = bindWindow({
        el,
        id,
        workArea: () => wmStore.getState().workArea,
        onSnapHint: (hint: SnapHint) => snapHintBus.emit(hint),
      });
      const zones = createResizeZones();
      for (const zone of zones) el.appendChild(zone);
      cleanupsRef.current.push(() => {
        unbind();
        for (const zone of zones) zone.remove();
      });
    }
    for (const el of statics) {
      const id = el.dataset.wmWindow;
      if (id && !wmStore.getState().windows[id]) el.remove();
    }
    adoptedRef.current = adoptedIds;
    setAdopted(new Set(adoptedIds));

    /* Deep links, brief 3.11: ?open=welcome or ?open=doc:slug on top of
       whatever was restored. Unknown ids are ignored. */
    try {
      const deep = parseDeepLink(new URLSearchParams(window.location.search).get("open"), publishedWork.map((item) => item.slug));
      if (deep) {
        const title = deep.app === "doc" ? publishedWork.find((item) => item.slug === deep.props?.slug)?.title : deep.title;
        dispatchWm({ type: "open", payload: { app: deep.app, id: deep.id, title, props: deep.props } });
      }
    } catch {
      /* Malformed search string, ignore. */
    }

    readyRef.current = true;
    paintAll();

    /* Viewport resize recomputes the work area; the reducer re-clamps
       every window, brief 3.1. */
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        dispatchWm({ type: "setWorkArea", payload: { workArea: computeWorkArea(window.innerWidth, window.innerHeight, measureReserve()) } });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
      for (const cleanup of cleanupsRef.current) cleanup();
      cleanupsRef.current = [];
    };
  }, []);

  /* ── Store to DOM sync + genie choreography ────────────────────────── */
  useEffect(() => {
    return wmStore.subscribe((state, prev) => {
      /* Minimize starts from the painted box, so flag it before the paint
         runs. Restore plays over the already painted end state. */
      for (const id of state.order) {
        const before = prev.windows[id];
        const after = state.windows[id];
        if (!before || !after || before.mode === after.mode) continue;
        if (after.mode === "minimized") genie(id, after, "minimize");
      }
      paintAll();
      for (const id of state.order) {
        const before = prev.windows[id];
        const after = state.windows[id];
        if (!before || !after || before.mode === after.mode) continue;
        if (before.mode === "minimized" && after.mode !== "minimized") genie(id, after, "restore");
      }
    });
  }, []);

  /* ── Link interception, fix 3: document capture beats the framework ── */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const el = (event.target as Element | null)?.closest?.("[data-wos-open]");
      if (!el) return;
      const request = parseOpenTarget(el.getAttribute("data-wos-open"));
      if (!request) return;
      event.preventDefault();
      event.stopPropagation();
      dispatchOpenTarget(request);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  /* ── Session persistence, debounced 300ms, brief 3.11 ──────────────── */
  useEffect(() => {
    let timer = 0;
    const unsub = wmStore.subscribe(() => {
      if (!readyRef.current) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        try {
          sessionStorage.setItem(WM_STORAGE_KEY, serializeSession(wmStore.getState()));
        } catch {
          /* Storage may be blocked. */
        }
      }, 300);
    });
    return () => {
      unsub();
      window.clearTimeout(timer);
    };
  }, []);

  /* ── Switcher state machine, driven by installKeyboard ─────────────── */
  const switcherEntries = () =>
    wmStore.getState().order.map((id) => {
      const win = wmStore.getState().windows[id];
      return { id, app: win.app, title: win.title, mode: win.mode };
    });

  const openSwitcher = (backward: boolean) => {
    const entries = switcherEntries();
    if (!entries.length) return;
    const frontMost = entries.reduce((best, entry, i) => (entry.mode !== "minimized" ? i : best), 0);
    const start = backward ? frontMost + 1 : frontMost - 1;
    setSwitcher({ entries, index: (start + entries.length) % entries.length });
  };
  const cycleSwitcher = (backward: boolean) => {
    const current = switcherRef.current;
    if (!current) return;
    const delta = backward ? 1 : -1;
    setSwitcher({ ...current, index: (current.index + delta + current.entries.length) % current.entries.length });
  };
  const acceptSwitcher = () => {
    const current = switcherRef.current;
    if (!current) return;
    const entry = current.entries[current.index];
    setSwitcher(null);
    if (!entry || !wmStore.getState().windows[entry.id]) return;
    if (entry.mode === "minimized") dispatchWm({ type: "restore", payload: { id: entry.id } });
    else dispatchWm({ type: "focus", payload: { id: entry.id } });
  };

  /* ── Shell keyboard, brief 3.8 ─────────────────────────────────────── */
  useEffect(() => {
    return installKeyboard({
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      searchOpen: () => searchOpenRef.current,
      openSwitcher,
      cycleSwitcher,
      acceptSwitcher,
      closeSwitcher: () => setSwitcher(null),
      switcherOpen: () => switcherRef.current !== null,
      closeMenus: () => emitIntent({ type: "menus:close" }),
      menusOpen: () => Boolean(document.querySelector('.wos-menubar [aria-expanded="true"]')),
    });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /* ── Shell intents from the chrome ─────────────────────────────────── */
  useEffect(
    () =>
      onIntent((intent) => {
        switch (intent.type) {
          case "search:open":
            setSearchOpen(true);
            break;
          case "toggles:open":
            dispatchWm({ type: "open", payload: { app: "settings", id: "settings", title: "Settings" } });
            break;
          case "app:open": {
            if (intent.app === "welcome") {
              dispatchWm({ type: "open", payload: { app: "welcome", id: "welcome", title: "Welcome" } });
            } else if (intent.app === "about") {
              dispatchWm({ type: "open", payload: { app: "about", id: "about", title: "About" } });
            } else if (intent.app === "settings") {
              const shortcuts = intent.slug === "shortcuts";
              dispatchWm({
                type: "open",
                payload: {
                  app: "settings",
                  id: shortcuts ? "settings:shortcuts" : "settings",
                  title: shortcuts ? "Keyboard shortcuts" : "Settings",
                  props: shortcuts ? { slug: "shortcuts" } : undefined,
                },
              });
            }
            break;
          }
          default:
            break;
        }
      }),
    [],
  );

  const windows = useWm((s) => s.windows);
  const shellIds = useMemo(() => order.filter((id) => !adopted.has(id)), [order, adopted]);

  return (
    <>
      {shellIds.map((id) => {
        const win = windows[id];
        if (!win) return null;
        return (
          <Window key={id} id={id}>
            {contentFor(win)}
          </Window>
        );
      })}
      <SnapPreview />
      <Toasts />
      {switcher ? (
        <Switcher
          entries={switcher.entries}
          index={switcher.index}
          onSelect={(index) => setSwitcher((prev) => (prev ? { ...prev, index } : prev))}
          onAccept={acceptSwitcher}
          onClose={() => setSwitcher(null)}
        />
      ) : null}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
