"use client";

/* Dock, brief 6.8: Files, Terminal, Proxy, Agent Lab, Findings, Detections,
   About, Mail, divider, Preview (CV), Settings, then minimized windows
   after a second divider. Base icon 52px, 8px gap. Magnification on fine
   pointers only: scale = 1 + 0.6 * max(0, 1 - d / 140) against the icon
   centre, animated on the dock spring (500, 32, 0.6), neighbours make room
   through the same scaled widths, the bar grows and its baseline never
   moves. Tooltip 12px glass pill 10px above the icon after 300ms. First
   launch of an app bounces its icon once. role=toolbar with a roving
   tabindex, arrows move, Enter opens. Each open window shows its dot: teal
   for the focused app, text-3 for running unfocused.
   Interim wiring, documented in the phase report: until an app window
   ships, its tile stays a real link to the matching route and the desktop
   shell will intercept built apps from phase 9 on. */

import { useEffect, useMemo, useRef, useState } from "react";
import { appIcons } from "../icons";
import type { AppId } from "../types";
import { dispatchWm, useWm } from "../wm/store";

const DOCK_BASE = 52;
const DOCK_GAP = 8;
const MAG_TRAVEL = 140;
const MAG_EXTRA = 0.6;
/* The dock spring, brief 6.10. */
const SPRING_STIFFNESS = 500;
const SPRING_DAMPING = 32;
const SPRING_MASS = 0.6;
const TOOLTIP_DELAY_MS = 300;
const BOUNCE_MS = 480;

type AppEntry = { kind: "app"; app: AppId; label: string; href: string };
type Entry = AppEntry | { kind: "divider" };

const ENTRIES: Entry[] = [
  { kind: "app", app: "files", label: "Files", href: "/work" },
  { kind: "app", app: "terminal", label: "Terminal", href: "/writeups" },
  { kind: "app", app: "proxy", label: "Proxy", href: "/work/llm-agent-security-lab" },
  { kind: "app", app: "agent-lab", label: "Agent Lab", href: "/work/llm-agent-security-lab" },
  { kind: "app", app: "findings", label: "Findings", href: "/work/healthcare-portal-pentest-lab" },
  { kind: "app", app: "detections", label: "Detections", href: "/work/aws-threat-detection-as-code" },
  { kind: "app", app: "about", label: "About", href: "/about" },
  { kind: "app", app: "mail", label: "Mail", href: "/contact" },
  { kind: "divider" },
  { kind: "app", app: "preview", label: "Preview, the CV", href: "/cv.pdf" },
  { kind: "app", app: "settings", label: "Settings", href: "/security" },
];

const APPS = ENTRIES.filter((entry): entry is AppEntry => entry.kind === "app");

function targetScale(distance: number): number {
  return 1 + MAG_EXTRA * Math.max(0, 1 - distance / MAG_TRAVEL);
}

/* Window ids map to app names: welcome, doc:slug, terminal:2. */
function appOfId(id: string): AppId {
  return id.split(":")[0] as AppId;
}

/* "files~Files~o|doc:slug~Title~m" gives running apps, minimized windows
   and titles out of one primitive selector (useSyncExternalStore safe). */
type Minimized = { id: string; title: string; app: AppId };

function useOpenState(): { open: Set<AppId>; minimized: Minimized[]; focused: AppId | null } {
  const sig = useWm((s) =>
    s.order.map((id) => `${id}~${s.windows[id].title}~${s.windows[id].mode === "minimized" ? "m" : "o"}`).join("|"),
  );
  const focused = useWm((s) => (s.focused ? s.windows[s.focused]?.app ?? null : null));
  return useMemo(() => {
    const open = new Set<AppId>();
    const minimized: Minimized[] = [];
    if (sig) {
      for (const part of sig.split("|")) {
        const [id, title, state] = part.split("~");
        if (!id || !title) continue;
        if (state === "m") minimized.push({ id, title, app: appOfId(id) });
        else open.add(appOfId(id));
      }
    }
    return { open, minimized, focused };
  }, [sig, focused]);
}

export function Dock() {
  const barRef = useRef<HTMLDivElement>(null);
  /* One element per APPS entry for width and transform writes. */
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const scalesRef = useRef<number[]>(APPS.map(() => 1));
  const velRef = useRef<number[]>(APPS.map(() => 0));
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pointerRef = useRef<number | null>(null);
  const tipTimerRef = useRef<number | null>(null);
  const [tip, setTip] = useState<{ key: string; label: string } | null>(null);
  const [roving, setRoving] = useState(0);
  const [bounceApp, setBounceApp] = useState<AppId | null>(null);
  const { open, minimized, focused } = useOpenState();

  /* Magnification loop: targets from the brief formula against the current
     magnified centres (one fixed point iteration for stability), then a
     real spring integration per item. It runs only while the pointer is
     over the bar or the items are still settling back to rest. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.documentElement.dataset.wosMotion === "reduce") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const bar = barRef.current;
    if (!bar) return;

    const step = () => {
      rafRef.current = 0;
      const now = performance.now();
      const dt = Math.min(0.033, Math.max(0.001, (now - lastTimeRef.current) / 1000));
      lastTimeRef.current = now;
      const scales = scalesRef.current;
      const velocities = velRef.current;
      const pointer = pointerRef.current;

      /* Centres from the current width layout... */
      let cursor = 0;
      const centres: number[] = [];
      for (let i = 0; i < scales.length; i += 1) {
        const w = DOCK_BASE * scales[i];
        centres.push(cursor + w / 2);
        cursor += w + DOCK_GAP;
      }
      const targets = scales.map((_, i) => (pointer === null ? 1 : targetScale(Math.abs(pointer - centres[i]))));
      /* ...then one fixed point iteration from the means, so the layout the
         pointer is measured in does not lag a whole frame behind. */
      cursor = 0;
      for (let i = 0; i < scales.length; i += 1) {
        const w = DOCK_BASE * ((scales[i] + targets[i]) / 2);
        centres[i] = cursor + w / 2;
        cursor += w + DOCK_GAP;
      }
      for (let i = 0; i < scales.length; i += 1) {
        targets[i] = pointer === null ? 1 : targetScale(Math.abs(pointer - centres[i]));
      }

      let settled = true;
      for (let i = 0; i < scales.length; i += 1) {
        const acceleration = (SPRING_STIFFNESS * (targets[i] - scales[i]) - SPRING_DAMPING * velocities[i]) / SPRING_MASS;
        velocities[i] += acceleration * dt;
        scales[i] += velocities[i] * dt;
        if (Math.abs(targets[i] - scales[i]) > 0.002 || Math.abs(velocities[i]) > 0.002) settled = false;
      }

      for (let i = 0; i < APPS.length; i += 1) {
        const item = itemRefs.current[i];
        if (!item) continue;
        const s = scales[i];
        item.style.width = `${(DOCK_BASE * s).toFixed(2)}px`;
        const icon = item.firstElementChild as HTMLElement | null;
        if (icon) icon.style.transform = `scale(${s.toFixed(3)})`;
      }

      if (!settled) rafRef.current = window.requestAnimationFrame(step);
      else if (pointer === null) {
        /* Fully at rest: write the exact rest layout and stop. */
        for (let i = 0; i < APPS.length; i += 1) {
          const item = itemRefs.current[i];
          if (!item) continue;
          item.style.width = "";
          const icon = item.firstElementChild as HTMLElement | null;
          if (icon) icon.style.transform = "";
        }
        scalesRef.current = APPS.map(() => 1);
        velRef.current = APPS.map(() => 0);
      } else rafRef.current = window.requestAnimationFrame(step);
    };

    const wake = () => {
      if (!rafRef.current) {
        lastTimeRef.current = performance.now();
        rafRef.current = window.requestAnimationFrame(step);
      }
    };

    const onMove = (event: PointerEvent) => {
      const box = bar.getBoundingClientRect();
      pointerRef.current = event.clientX - box.left;
      wake();
    };
    const onLeave = () => {
      pointerRef.current = null;
      wake();
    };

    bar.addEventListener("pointermove", onMove, { passive: true });
    bar.addEventListener("pointerleave", onLeave);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      pointerRef.current = null;
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* First launch bounce, brief 6.8: an app that was not running appears in
     the open set, its icon bounces once. Hydration restores count as the
     starting state, no bounce. */
  const seenRef = useRef<Set<AppId> | null>(null);
  const openKey = [...open].sort().join(",");
  useEffect(() => {
    const nowOpen = new Set<AppId>(openKey ? (openKey.split(",") as AppId[]) : []);
    const seen = seenRef.current;
    if (seen) {
      let launched: AppId | null = null;
      for (const app of nowOpen) {
        if (!seen.has(app) && launched === null) launched = app;
      }
      if (launched) {
        setBounceApp(launched);
        const timer = window.setTimeout(() => setBounceApp(null), BOUNCE_MS);
        seenRef.current = nowOpen;
        return () => window.clearTimeout(timer);
      }
    }
    seenRef.current = nowOpen;
    return undefined;
  }, [openKey]);

  const clearTip = () => {
    if (tipTimerRef.current) window.clearTimeout(tipTimerRef.current);
    tipTimerRef.current = null;
    setTip(null);
  };
  const scheduleTip = (key: string, label: string) => {
    clearTip();
    tipTimerRef.current = window.setTimeout(() => setTip({ key, label }), TOOLTIP_DELAY_MS);
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const items = Array.from(barRef.current?.querySelectorAll<HTMLElement>("[data-wos-dock-item]") ?? []);
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next = (Math.max(0, current) + (event.key === "ArrowRight" ? 1 : items.length - 1)) % items.length;
    items[next].focus();
    setRoving(items[next].dataset.wosIndex ? Number(items[next].dataset.wosIndex) : 0);
  };

  return (
    <div
      ref={barRef}
      className="wos-dock"
      data-wos-region="dock"
      role="toolbar"
      aria-label="Dock"
      onKeyDown={onKey}
    >
      {ENTRIES.map((entry, entryIndex) => {
        if (entry.kind === "divider") {
          return <span key={`divider-${entryIndex}`} className="wos-dock-divider" aria-hidden />;
        }
        const appIndex = APPS.indexOf(entry);
        const Icon = appIcons[entry.app];
        const dotState = open.has(entry.app) ? (focused === entry.app ? "focused" : "running") : "none";
        const isBouncing = bounceApp === entry.app;
        return (
          <a
            key={entry.app}
            ref={(el) => {
              itemRefs.current[appIndex] = el;
            }}
            href={entry.href}
            data-wos-dock-item
            data-wos-index={appIndex}
            data-bounce={isBouncing ? "true" : "false"}
            className="wos-dock-item wos-focusable"
            aria-label={entry.label}
            tabIndex={appIndex === roving ? 0 : -1}
            onPointerEnter={() => scheduleTip(`app:${appIndex}`, entry.label)}
            onPointerLeave={clearTip}
            onFocus={clearTip}
          >
            <span className="wos-dock-icon" aria-hidden>
              <span className="wos-tile">
                <Icon width={28} height={28} />
              </span>
            </span>
            <span className="wos-dock-dot" data-state={dotState} aria-hidden />
            {tip?.key === `app:${appIndex}` ? (
              <span className="wos-dock-tip" data-show="true" aria-hidden>
                {tip.label}
              </span>
            ) : null}
          </a>
        );
      })}
      {minimized.length ? (
        <>
          <span className="wos-dock-divider" aria-hidden />
          {minimized.map((win, minIdx) => {
            const Icon = appIcons[win.app] ?? appIcons.welcome;
            return (
              <button
                key={win.id}
                type="button"
                data-wos-dock-item
                data-wos-minimized="true"
                className="wos-dock-item wos-focusable"
                aria-label={`Restore ${win.title}`}
                tabIndex={roving === APPS.length + minIdx ? 0 : -1}
                data-wos-index={APPS.length + minIdx}
                onPointerEnter={() => scheduleTip(`min:${win.id}`, win.title)}
                onPointerLeave={clearTip}
                onClick={() => dispatchWm({ type: "restore", payload: { id: win.id } })}
              >
                <span className="wos-dock-icon" aria-hidden>
                  <span className="wos-tile">
                    <Icon width={28} height={28} />
                  </span>
                </span>
                <span className="wos-dock-dot" data-state="running" aria-hidden />
                {tip?.key === `min:${win.id}` ? (
                  <span className="wos-dock-tip" data-show="true" aria-hidden>
                    {win.title}
                  </span>
                ) : null}
              </button>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
