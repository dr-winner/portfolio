/* Window manager reducer, brief 3.1 to 3.7. Pure: state in, state out, no
   React, no DOM, no time. Components subscribe through the store wrapper.
   The toast field is transient UI text (the 10 window cap message and the
   Terminal instance limit), never persisted and cleared on the next
   interaction. focusAt is a per-session monotonic counter persisted with
   the session so the least recently focused bookkeeping survives reloads. */

import type { AppId } from "../types";
import {
  cascadeRect,
  clampPosition,
  clampSize,
  computeWorkArea,
  DEFAULT_SIZES,
  DEFAULT_TITLES,
  maximizeRect,
  openSizeFor,
  snapRect,
  type SnapSide,
  type WinMode,
  type WorkArea,
} from "./geometry.ts";

export type WindowId = string;

export interface WinState {
  id: WindowId;
  app: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  mode: WinMode;
  /* Geometry to come back to after maximize or snap, or the mode to come
     back to after minimize. */
  restore?: { x: number; y: number; w: number; h: number };
  modeBefore?: Exclude<WinMode, "minimized">;
  props?: Record<string, string>;
  /* Monotonic counter, drives least recently focused for the 10 window cap. */
  focusedAt: number;
}

export interface WMState {
  windows: Record<WindowId, WinState>;
  /* Back to front. */
  order: WindowId[];
  focused: WindowId | null;
  workArea: WorkArea;
  /* Transient, never persisted. */
  toast: string | null;
}

export type OpenPayload = {
  app: AppId;
  id?: WindowId;
  title?: string;
  props?: Record<string, string>;
  /* Explicit opening geometry. The shell passes it when adopting a
     server rendered window so the store and the paint agree, brief 7.1.
     Still clamped to the work area and the app minimum sizes. */
  at?: { x: number; y: number; w: number; h: number };
};

export type WmAction =
  | { type: "open"; payload: OpenPayload }
  | { type: "close"; payload: { id: WindowId } }
  | { type: "focus"; payload: { id: WindowId } }
  | { type: "move"; payload: { id: WindowId; x: number; y: number } }
  | { type: "resize"; payload: { id: WindowId; x?: number; y?: number; w: number; h: number } }
  | { type: "minimize"; payload: { id: WindowId } }
  | { type: "restore"; payload: { id: WindowId; mode?: Exclude<WinMode, "minimized"> } }
  | { type: "maximize"; payload: { id: WindowId } }
  | { type: "toggleMaximize"; payload: { id: WindowId } }
  | { type: "snap"; payload: { id: WindowId; side: SnapSide } }
  | { type: "setWorkArea"; payload: { workArea: WorkArea } }
  | { type: "hydrate"; payload: { windows: WinState[]; workArea: WorkArea } }
  | { type: "clearToast" };

const MAX_WINDOWS = 10;
const MAX_Z = 900;
const MAX_TERMINALS = 3;
const BASE_Z = 100;
const TERMINAL_PREFIX = "terminal:";

function emptyState(workArea: WorkArea): WMState {
  return { windows: {}, order: [], focused: null, workArea, toast: null };
}

export function initialWmState(): WMState {
  return emptyState(computeWorkArea(1440, 900));
}

function maxZ(windows: Record<WindowId, WinState>): number {
  let max = 0;
  for (const id of Object.keys(windows)) max = Math.max(max, windows[id].z);
  return max;
}

/* Rebase z to 100, 101, 102 from back to front when the front z passes 900,
   brief 3.5. The order array is back to front, so the mapping stays
   deterministic and the front-most window keeps the front-most z. */
export function normalizeZ(order: WindowId[], windows: Record<WindowId, WinState>): Record<WindowId, WinState> {
  const next = { ...windows };
  const byZ = [...order].sort((a, b) => windows[a].z - windows[b].z);
  byZ.forEach((id, index) => {
    next[id] = { ...next[id], z: BASE_Z + index };
  });
  return next;
}

function focusWin(state: WMState, id: WindowId, patch: Partial<WinState> = {}): WMState {
  const win = state.windows[id];
  if (!win) return state;
  let nextWindows = { ...state.windows, [id]: { ...win, ...patch, z: maxZ(state.windows) + 1, focusedAt: (win.focusedAt || 0) + 1 } };
  const order = [...state.order.filter((n) => n !== id), id];
  if (nextWindows[id].z > MAX_Z) {
    nextWindows = normalizeZ(order, nextWindows);
  }
  return { ...state, windows: nextWindows, order, focused: id };
}

/* Single instance rule, brief 3.2: an existing window focuses and restores
   instead of opening another. Terminal ids are unique per instance and
   document ids are per slug, so the id covers every single instance case. */
function nextTerminalIndex(windows: Record<WindowId, WinState>): number {
  let index = 1;
  while (windows[`terminal:${index}`]) index += 1;
  return index;
}

function applyOpen(state: WMState, payload: OpenPayload): WMState {
  let id = payload.app === "doc" ? `doc:${payload.props?.slug ?? "unknown"}` : (payload.id ?? payload.app);

  if (state.windows[id]) {
    if (state.windows[id].mode === "minimized") {
      return focusWin(applyRestore(state, { id }), id);
    }
    return focusWin(state, id);
  }

  if (payload.app === "terminal") {
    if (Object.keys(state.windows).filter((n) => n.startsWith(TERMINAL_PREFIX)).length >= MAX_TERMINALS) {
      const terminals = state.order.filter((n) => n.startsWith(TERMINAL_PREFIX));
      const last = terminals[terminals.length - 1];
      return { ...focusWin(state, last), toast: "Terminal is limited to 3 windows" };
    }
    id = `terminal:${nextTerminalIndex(state.windows)}`;
  }

  /* Hard cap of 10 open windows, brief 3.2: opening an 11th minimizes the
     least recently focused open window and shows a toast naming its app. */
  const openIds = state.order.filter((n) => state.windows[n].mode !== "minimized");
  let next = state;
  if (openIds.length >= MAX_WINDOWS) {
    const lru = openIds.slice().sort((a, b) => state.windows[a].focusedAt - state.windows[b].focusedAt)[0];
    const lruWin = state.windows[lru];
    next = {
      ...state,
      windows: {
        ...state.windows,
        [lru]: { ...lruWin, mode: "minimized", modeBefore: lruWin.mode as Exclude<WinMode, "minimized"> },
      },
      toast: `Minimized ${lruWin.title} to keep things fast`,
    };
  }

  /* Adopted windows take their geometry from the paint, brief 7.1; shell
     opened windows cascade. Both paths clamp to the work area and the
     app minimums. */
  let rect: { x: number; y: number; w: number; h: number };
  if (payload.at) {
    const min = DEFAULT_SIZES[payload.app];
    const w = clampSize(payload.at.w, payload.at.h, min.minW, min.minH, payload.at.x, payload.at.y, next.workArea);
    const pos = clampPosition(payload.at.x, payload.at.y, w.w, next.workArea);
    rect = { x: pos.x, y: pos.y, w: w.w, h: w.h };
  } else {
    const size = openSizeFor(payload.app, next.workArea);
    /* Cascade, brief 3.2: centred for the first window of a session, then
       the previous open window plus (32, 28), wrapping at the work area. */
    const openPrevious = next.order
      .filter((n) => next.windows[n].mode !== "minimized")
      .map((n) => next.windows[n])
      .pop();
    rect = cascadeRect(next.workArea, openPrevious ? { x: openPrevious.x, y: openPrevious.y } : null, size.w, size.h);
  }
  const win: WinState = {
    id,
    app: payload.app,
    title: payload.title ?? DEFAULT_TITLES[payload.app],
    x: rect.x,
    y: rect.y,
    w: rect.w,
    h: rect.h,
    z: 0,
    mode: "normal",
    props: payload.props,
    focusedAt: 0,
  };
  return focusWin({ ...next, windows: { ...next.windows, [id]: win } }, id);
}

function applyMaximize(state: WMState, payload: { id: WindowId }): WMState {
  const win = state.windows[payload.id];
  if (!win) return state;
  const restore = win.mode === "maximized" ? win.restore : { x: win.x, y: win.y, w: win.w, h: win.h };
  const rect = maximizeRect(state.workArea);
  return focusWin(state, payload.id, { mode: "maximized", restore, ...rect });
}

function applyRestore(state: WMState, payload: { id: WindowId; mode?: Exclude<WinMode, "minimized"> }): WMState {
  const win = state.windows[payload.id];
  if (!win) return state;
  if (win.mode !== "minimized" && !payload.mode) return state;
  const geometry = win.restore ?? { x: win.x, y: win.y, w: win.w, h: win.h };
  const mode = payload.mode ?? win.modeBefore ?? "normal";
  return focusWin(state, payload.id, {
    mode,
    modeBefore: undefined,
    ...(mode === "maximized" ? maximizeRect(state.workArea) : geometry),
  });
}

/* A snapped or maximized window that is dragged returns to its restored
   size and keeps the pointer at the same relative title bar position,
   brief 3.7 the component state tracks the pointer offset. */
function unmaximizeGeometry(state: WMState, win: WinState) {
  const restored = win.restore ?? { x: win.x, y: win.y, w: win.w, h: win.h };
  const size = clampSize(restored.w, restored.h, DEFAULT_SIZES[win.app].minW, DEFAULT_SIZES[win.app].minH, restored.x, restored.y, state.workArea);
  const pos = clampPosition(restored.x, restored.y, size.w, state.workArea);
  return { ...pos, ...size };
}

function applyToggleMaximize(state: WMState, payload: { id: WindowId }): WMState {
  const win = state.windows[payload.id];
  if (!win) return state;
  if (win.mode === "maximized" || win.mode === "snapped-left" || win.mode === "snapped-right") {
    const geometry = unmaximizeGeometry(state, win);
    return focusWin(state, payload.id, { mode: "normal", restore: undefined, ...geometry });
  }
  return applyMaximize(state, payload);
}

function applySnap(state: WMState, payload: { id: WindowId; side: SnapSide }): WMState {
  const win = state.windows[payload.id];
  if (!win) return state;
  const rect = snapRect(state.workArea, payload.side);
  const restore = win.mode === "normal" ? { x: win.x, y: win.y, w: win.w, h: win.h } : (win.restore ?? { x: win.x, y: win.y, w: win.w, h: win.h });
  return focusWin(state, payload.id, {
    mode: payload.side === "left" ? "snapped-left" : "snapped-right",
    restore,
    ...rect,
  });
}

/* Viewport resize clamps every window, brief 3.1. Maximized and snapped
   windows reflow to their region at the new size, normal windows stay put
   within the new area, minimized windows only re-clamp their stored spot. */
function applySetWorkArea(state: WMState, workArea: WorkArea): WMState {
  const windows: Record<WindowId, WinState> = {};
  for (const id of Object.keys(state.windows)) {
    const win = state.windows[id];
    let nextWin = win;
    if (win.mode === "maximized") {
      nextWin = { ...win, ...maximizeRect(workArea), restore: win.restore };
    } else if (win.mode === "snapped-left" || win.mode === "snapped-right") {
      nextWin = { ...win, ...snapRect(workArea, win.mode === "snapped-left" ? "left" : "right"), restore: win.restore };
    } else {
      const size = clampSize(win.w, win.h, DEFAULT_SIZES[win.app].minW, DEFAULT_SIZES[win.app].minH, win.x, win.y, workArea);
      const pos = clampPosition(win.x, win.y, size.w, workArea);
      nextWin = { ...win, x: pos.x, y: pos.y, w: size.w, h: size.h, restore: win.restore };
    }
    windows[id] = nextWin;
  }
  return { ...state, workArea, windows, order: [...state.order] };
}

export function reduce(state: WMState, action: WmAction): WMState {
  switch (action.type) {
    case "open":
      return applyOpen(state, action.payload);
    case "close": {
      const win = state.windows[action.payload.id];
      if (!win) return state;
      const windows = { ...state.windows };
      delete windows[action.payload.id];
      const order = state.order.filter((id) => id !== action.payload.id);
      /* Focus falls back to the next window in order, or to the desktop,
         brief 3.6. */
      const nextFocused =
        state.focused === action.payload.id
          ? order.filter((id) => windows[id].mode !== "minimized").pop() ?? null
          : state.focused;
      return { ...state, windows, order, focused: nextFocused, toast: null };
    }
    case "focus":
      return focusWin(state, action.payload.id);
    case "move": {
      const win = state.windows[action.payload.id];
      if (!win) return state;
      const pos = clampPosition(action.payload.x, action.payload.y, win.w, state.workArea);
      return { ...state, windows: { ...state.windows, [action.payload.id]: { ...win, x: pos.x, y: pos.y } }, toast: null };
    }
    case "resize": {
      const win = state.windows[action.payload.id];
      if (!win) return state;
      const x = action.payload.x ?? win.x;
      const y = action.payload.y ?? win.y;
      const size = clampSize(action.payload.w, action.payload.h, DEFAULT_SIZES[win.app].minW, DEFAULT_SIZES[win.app].minH, x, y, state.workArea);
      const pos = clampPosition(x, y, size.w, state.workArea);
      return {
        ...state,
        windows: { ...state.windows, [action.payload.id]: { ...win, x: pos.x, y: pos.y, w: size.w, h: size.h } },
        toast: null,
      };
    }
    case "minimize": {
      const win = state.windows[action.payload.id];
      if (!win || win.mode === "minimized") return state;
      const focused =
        state.focused === action.payload.id
          ? state.order.filter((id) => id !== action.payload.id && state.windows[id].mode !== "minimized").pop() ?? null
          : state.focused;
      return {
        ...state,
        windows: { ...state.windows, [action.payload.id]: { ...win, mode: "minimized", modeBefore: win.mode } },
        focused,
        toast: null,
      };
    }
    case "restore":
      return applyRestore(state, action.payload);
    case "maximize":
      return applyMaximize(state, action.payload);
    case "toggleMaximize":
      return applyToggleMaximize(state, action.payload);
    case "snap":
      return applySnap(state, action.payload);
    case "setWorkArea":
      return applySetWorkArea(state, action.payload.workArea);
    case "hydrate": {
      /* persistence.ts parses, validates and clamps before this. The stored
         focusedAt counters drive LRU after a reload, and the front-most
         non-minimized window returns to focus. */
      const windows: Record<WindowId, WinState> = {};
      for (const incoming of action.payload.windows) {
        windows[incoming.id] = { ...incoming };
      }
      const state0 = emptyStateWith(action.payload.workArea, windows, [...action.payload.windows.map((win) => win.id)]);
      let focused: WindowId | null = null;
      for (const id of state0.order) {
        if (windows[id].mode === "minimized") continue;
        if (focused === null || windows[id].focusedAt > windows[focused].focusedAt) focused = id;
      }
      return focused ? focusWin(state0, focused) : state0;
    }
    case "clearToast":
      return state.toast ? { ...state, toast: null } : state;
    default:
      return state;
  }
}

function emptyStateWith(workArea: WorkArea, windows: Record<WindowId, WinState>, order: WindowId[]): WMState {
  return { windows, order, focused: null, workArea, toast: null };
}
