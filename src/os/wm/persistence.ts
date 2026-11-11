/* Session persistence and deep links, brief 3.11. Stored data is untrusted
   input: parsed with zod, dropped on any mismatch, clamped to the current
   work area by the hydrate reducer, and everything that fails falls back to
   a default layout. Only ids, geometry and titles are stored, never
   content. This module is importable in node tests, no DOM until
   loadSession or persistSession run. */

import { z } from "zod";
import { reduce, initialWmState, type WinState, type WMState } from "./reducer.ts";
import { computeWorkArea, clampPosition, DEFAULT_SIZES } from "./geometry.ts";
import type { AppId } from "../types";

export { WM_STORAGE_KEY } from "./store.ts";

const appSchema = z.enum([
  "welcome",
  "hello",
  "files",
  "doc",
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
]);

const restoreSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  w: z.number().finite(),
  h: z.number().finite(),
});

const winSchema = z.object({
  id: z.string().min(1).max(120).regex(/^[a-z0-9][a-z0-9:\-._]*$/),
  app: appSchema,
  title: z.string().min(1).max(120),
  x: z.number().finite(),
  y: z.number().finite(),
  w: z.number().finite().min(80),
  h: z.number().finite().min(80),
  z: z.number().finite().min(0),
  mode: z.enum(["normal", "maximized", "snapped-left", "snapped-right", "minimized"]),
  restore: restoreSchema.optional(),
  modeBefore: z.enum(["normal", "maximized", "snapped-left", "snapped-right"]).optional(),
  props: z.record(z.string(), z.string()).optional(),
  focusedAt: z.number().finite().min(0),
});

const sessionSchema = z.object({
  v: z.literal(1),
  windows: z.array(winSchema).max(10),
  workArea: z
    .object({
      top: z.number().finite().min(0),
      left: z.number().finite().min(0),
      width: z.number().finite().min(0),
      height: z.number().finite().min(0),
    })
    .optional(),
  /* focused is rebuilt from focusedAt, not trusted. */
});

export type StoredSession = z.infer<typeof sessionSchema>;

/* Parse a stored session string. Returns null on any failure, the caller
   falls back to the default layout. */
export function parseSession(raw: string | null): StoredSession | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const result = sessionSchema.safeParse(parsed);
  return result.success ? result.data : null;
}

/* Rehydrate a stored session into a WMState, clamping all geometry to the
   current work area, brief 3.11. Also the deep-link entry point: the shell
   dispatches opens after this returns. */
export function sessionToState(session: StoredSession | null, viewportW: number, viewportH: number, dockReserve: number): WMState {
  const workArea = session?.workArea ? clampWorkArea(session.workArea, viewportW, viewportH, dockReserve) : computeWorkArea(viewportW, viewportH, dockReserve);
  if (!session) return reduce(initialWmState(), { type: "setWorkArea", payload: { workArea } });
  const windows: WinState[] = session.windows.map((win) => clampStoredWin(win, workArea));
  return reduce(initialWmState(), { type: "hydrate", payload: { windows, workArea } });
}

function clampWorkArea(
  stored: { top: number; left: number; width: number; height: number },
  viewportW: number,
  viewportH: number,
  dockReserve: number,
) {
  const current = computeWorkArea(viewportW, viewportH, dockReserve);
  return {
    top: Math.max(0, Math.min(stored.top, current.top)),
    left: Math.max(0, Math.min(stored.left, current.left)),
    width: Math.max(0, Math.min(stored.width, viewportW - stored.left)),
    height: Math.max(0, Math.min(stored.height, viewportH - dockReserve - Math.max(0, Math.min(stored.top, current.top)))),
  };
}

function clampStoredWin(win: StoredSession["windows"][number], workArea: WMState["workArea"]): WinState {
  const def = DEFAULT_SIZES[win.app];
  const w = Math.max(Math.min(win.w, workArea.width), Math.min(def.minW, workArea.width));
  const h = Math.max(Math.min(win.h, workArea.height), Math.min(def.minH, workArea.height));
  const pos = clampPosition(win.x, win.y, w, workArea);
  return {
    ...win,
    x: pos.x,
    y: pos.y,
    w,
    h,
    z: Math.max(0, win.z),
  };
}

/* Persist debounced by the caller (300ms, brief 3.11). No location, no
   history, no content. */
export function serializeSession(state: WMState): string {
  const session: StoredSession = {
    v: 1,
    windows: state.order.map((id) => {
      const win = state.windows[id];
      return {
        id: win.id,
        app: win.app as AppId,
        title: win.title,
        x: win.x,
        y: win.y,
        w: win.w,
        h: win.h,
        z: win.z,
        mode: win.mode,
        restore: win.restore,
        modeBefore: win.modeBefore,
        props: win.props,
        focusedAt: win.focusedAt,
      };
    }),
    workArea: state.workArea,
  };
  return JSON.stringify(session);
}

/* Deep links, brief 3.11: ?open=doc:healthcare-portal-pentest-lab opens
   that window focused on top of whatever was restored. The id is validated
   against the known app set and slug list and anything unknown is
   ignored. knownSlugs applies to the doc app only. */
export function parseDeepLink(
  raw: string | null,
  knownSlugs: string[],
): { app: AppId; id: string; title?: string; props?: Record<string, string> } | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  const colon = value.indexOf(":");
  const head = colon === -1 ? value : value.slice(0, colon);
  if (head === "doc") {
    const slug = value.slice(colon + 1);
    if (!knownSlugs.includes(slug)) return null;
    return { app: "doc", id: `doc:${slug}`, props: { slug } };
  }
  if (knownApps.has(head as AppId) && head !== "terminal" && !value.includes(":")) {
    return { app: head as AppId, id: head };
  }
  return null;
}

const knownApps = new Set<AppId>([
  "welcome",
  "hello",
  "files",
  "doc",
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
]);
