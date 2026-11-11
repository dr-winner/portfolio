/* Window manager geometry helpers, brief section 3. Pure functions with no
   React and no DOM. Sizes and insets mirror brief 3.1 and 3.2 exactly. */

import type { AppId } from "../types";

export interface WorkArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

export type SnapSide = "left" | "right";
export type WinMode = "normal" | "maximized" | "snapped-left" | "snapped-right" | "minimized";

export const MENUBAR_HEIGHT = 32;
const TITLEBAR_HEIGHT = 40;
/* The dock reserve: dock height plus the 12px gap plus an 8px floor. */
export const DOCK_RESERVE_DEFAULT = 88;
/* Drag constraint, brief 3.3: at least 120px of title bar stays inside. */
export const TITLE_GRAB_MIN = 120;
export const MAXIMIZE_INSET = 8;

/* Default and minimum window sizes per app, brief 3.2. Preview height
   resolves against the work area at open time. */
export const DEFAULT_SIZES: Record<AppId, { w: number; h: number; minW: number; minH: number; hDynamic?: boolean }> = {
  welcome: { w: 640, h: 520, minW: 420, minH: 420 },
  /* The temporary Hello proof app, brief Phase 1 item 10. Small by
     design so three fit overlapping on the smallest desktop. */
  hello: { w: 440, h: 320, minW: 340, minH: 240 },
  files: { w: 880, h: 560, minW: 520, minH: 360 },
  doc: { w: 860, h: 680, minW: 480, minH: 400 },
  terminal: { w: 720, h: 440, minW: 420, minH: 260 },
  proxy: { w: 1040, h: 640, minW: 720, minH: 480 },
  "agent-lab": { w: 980, h: 640, minW: 640, minH: 460 },
  findings: { w: 920, h: 580, minW: 560, minH: 380 },
  detections: { w: 1000, h: 640, minW: 640, minH: 440 },
  about: { w: 780, h: 640, minW: 480, minH: 420 },
  mail: { w: 620, h: 540, minW: 420, minH: 420 },
  preview: { w: 720, h: 0, minW: 420, minH: 480, hDynamic: true },
  settings: { w: 700, h: 500, minW: 520, minH: 400 },
  security: { w: 840, h: 620, minW: 520, minH: 420 },
};

export const DEFAULT_TITLES: Record<AppId, string> = {
  welcome: "Welcome",
  hello: "Hello",
  files: "Files",
  doc: "Document",
  terminal: "Terminal",
  proxy: "Proxy",
  "agent-lab": "Agent Lab",
  findings: "Findings",
  detections: "Detections",
  about: "About",
  mail: "Mail",
  preview: "Preview",
  settings: "Settings",
  security: "Security",
};

/* Work area: the viewport minus the menu bar at the top and the dock
   reserve at the bottom, brief 3.1. */
export function computeWorkArea(viewportW: number, viewportH: number, dockReserve: number = DOCK_RESERVE_DEFAULT): WorkArea {
  const top = MENUBAR_HEIGHT;
  const bottom = viewportH - dockReserve;
  return {
    top,
    left: 0,
    width: Math.max(0, viewportW),
    height: Math.max(0, bottom - top),
  };
}

/* Size a window opens at, brief 3.2: the default size clamped to the work
   area minus 24px on each side, with the work area winning over minimums
   only below the clamp floor. Preview height fills wa minus 40 by its own
   row in the table. */
export function openSizeFor(app: AppId, wa: WorkArea) {
  const def = DEFAULT_SIZES[app];
  let h = def.h;
  if (def.hDynamic) h = wa.height - 40;
  const maxW = Math.max(0, wa.width - 48);
  const maxH = Math.max(0, wa.height - 48);
  const w = Math.max(Math.min(def.w, maxW), Math.min(def.minW, maxW));
  h = Math.max(Math.min(h, maxH), Math.min(def.minH, maxH));
  return { w: Math.round(w), h: Math.round(h) };
}

export function centeredRect(wa: WorkArea, w: number, h: number) {
  return {
    x: Math.round(wa.left + (wa.width - w) / 2),
    y: Math.round(wa.top + (wa.height - h) / 2),
    w,
    h,
  };
}

/* Cascade, brief 3.2. The first window of a session opens centred, the next
   sits 32px right and 28px down from the previous, and the chain restarts
   at (left + 64, top + 40) when the bottom right corner would leave the
   work area. */
export function cascadeRect(wa: WorkArea, previous: { x: number; y: number } | null, w: number, h: number) {
  if (!previous) return centeredRect(wa, w, h);
  let x = previous.x + 32;
  let y = previous.y + 28;
  if (x + w > wa.left + wa.width || y + h > wa.top + wa.height) {
    x = wa.left + 64;
    y = wa.top + 40;
  }
  return { x, y, w, h };
}

/* Drag constraint: at least 120px of title bar inside the work area
   horizontally, and the title bar never above the menu bar or below the
   work area bottom, brief 3.3. */
export function clampPosition(x: number, y: number, w: number, wa: WorkArea) {
  const minX = wa.left + TITLE_GRAB_MIN - w;
  const maxX = wa.left + wa.width - TITLE_GRAB_MIN;
  x = minX <= maxX ? Math.min(Math.max(x, minX), maxX) : wa.left;
  const minY = wa.top;
  const maxY = wa.top + wa.height - TITLEBAR_HEIGHT;
  y = Math.min(Math.max(y, minY), Math.max(minY, maxY));
  return { x: Math.round(x), y: Math.round(y) };
}

/* Resize clamp: min sizes and the work area, brief 3.4. The top left
   corner stays put and the window never extends past the work area. */
export function clampSize(w: number, h: number, minW: number, minH: number, x: number, y: number, wa: WorkArea) {
  const maxW = wa.left + wa.width - x;
  const maxH = wa.top + wa.height - y;
  w = Math.min(Math.max(w, minW), Math.max(minW, maxW));
  h = Math.min(Math.max(h, minH), Math.max(minH, maxH));
  return { w: Math.round(w), h: Math.round(h) };
}

/* Snap geometry, brief 3.7: half the work area with an 8px inset. */
export function snapRect(wa: WorkArea, side: SnapSide) {
  const half = Math.floor(wa.width / 2);
  return {
    x: side === "left" ? wa.left + MAXIMIZE_INSET : wa.left + half + MAXIMIZE_INSET,
    y: wa.top + MAXIMIZE_INSET,
    w: half - MAXIMIZE_INSET * 2,
    h: wa.height - MAXIMIZE_INSET * 2,
  };
}

/* Maximized geometry, brief 3.6: fills the work area with an 8px inset. */
export function maximizeRect(wa: WorkArea) {
  return {
    x: wa.left + MAXIMIZE_INSET,
    y: wa.top + MAXIMIZE_INSET,
    w: wa.width - MAXIMIZE_INSET * 2,
    h: wa.height - MAXIMIZE_INSET * 2,
  };
}
