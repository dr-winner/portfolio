/* Window manager unit tests, brief 3.12. They run under the repo's
   existing node --test setup, no test framework added. */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reduce, initialWmState, type WinState, type WMState } from "./reducer.ts";
import { computeWorkArea, maximizeRect, snapRect } from "./geometry.ts";
import { parseSession, parseDeepLink, serializeSession, sessionToState } from "./persistence.ts";

const WA = initialWmState().workArea; // 1440x900 viewport, 32px menu bar, 88px dock reserve

function open(state: WMState, payload: { app: WinState["app"]; id?: string; props?: Record<string, string> }): WMState {
  return reduce(state, { type: "open", payload });
}

describe("wm reducer", () => {
  it("opens the first window of a session centred and focused", () => {
    const s = open(initialWmState(), { app: "welcome" });
    const win = s.windows["welcome"];
    assert.ok(win);
    assert.equal(win.x, Math.round((WA.width - win.w) / 2));
    assert.equal(win.y, Math.round(WA.top + (WA.height - win.h) / 2));
    assert.equal(s.focused, "welcome");
    assert.deepEqual(s.order, ["welcome"]);
  });

  it("cascades subsequent opens by 32,28 and wraps at the work area", () => {
    let s = open(initialWmState(), { app: "welcome" });
    const first = s.windows["welcome"];
    s = open(s, { app: "files" });
    const second = s.windows["files"];
    assert.equal(second.x, first.x + 32);
    assert.equal(second.y, first.y + 28);
    /* Park the front window near the right edge: the next open wraps. */
    const seeded: WMState = {
      ...s,
      windows: {
        ...s.windows,
        files: { ...second, x: 900, y: 300, w: 880, h: 560 },
      },
    };
    s = reduce(seeded, { type: "open", payload: { app: "settings" } });
    const wrapped = s.windows["settings"];
    assert.equal(wrapped.x, WA.left + 64);
    assert.equal(wrapped.y, WA.top + 40);
  });

  it("focuses and restores a single instance instead of opening twice", () => {
    let s = open(initialWmState(), { app: "files" });
    const first = s.windows["files"];
    s = open(s, { app: "files" });
    assert.equal(Object.keys(s.windows).length, 1);
    assert.equal(s.focused, "files");
    s = reduce(s, { type: "minimize", payload: { id: "files" } });
    assert.equal(s.windows["files"].mode, "minimized");
    s = open(s, { app: "files" });
    assert.equal(s.windows["files"].mode, "normal");
    assert.equal(s.focused, "files");
    assert.deepEqual({ x: s.windows["files"].x, y: s.windows["files"].y }, { x: first.x, y: first.y });
  });

  it("allows one document window per slug", () => {
    let s = open(initialWmState(), { app: "doc", props: { slug: "healthcare-portal-pentest-lab" } });
    s = open(s, { app: "doc", props: { slug: "aws-threat-detection-as-code" } });
    assert.equal(Object.keys(s.windows).filter((id) => id.startsWith("doc:")).length, 2);
    const before = s.focused;
    s = open(s, { app: "doc", props: { slug: "healthcare-portal-pentest-lab" } });
    assert.equal(Object.keys(s.windows).filter((id) => id.startsWith("doc:")).length, 2);
    assert.equal(s.focused, "doc:healthcare-portal-pentest-lab");
    assert.notEqual(before, s.focused);
  });

  it("caps Terminal at 3 instances with a toast", () => {
    let s = initialWmState();
    for (let i = 0; i < 3; i++) s = open(s, { app: "terminal" });
    assert.deepEqual(Object.keys(s.windows).sort(), ["terminal:1", "terminal:2", "terminal:3"]);
    s = open(s, { app: "terminal" });
    assert.equal(s.toast, "Terminal is limited to 3 windows");
    assert.equal(s.focused, "terminal:3");
    assert.equal(Object.keys(s.windows).length, 3);
  });

  it("enforces the 10 open window cap by minimizing the least recently focused", () => {
    let s = initialWmState();
    s = open(s, { app: "welcome" });
    s = open(s, { app: "files" });
    for (let i = 1; i <= 7; i++) s = open(s, { app: "doc", props: { slug: `case-${i}` } });
    s = open(s, { app: "proxy" });
    assert.equal(Object.keys(s.windows).length, 10);
    s = open(s, { app: "settings" });
    assert.equal(s.toast, "Minimized Welcome to keep things fast");
    assert.equal(s.windows["welcome"].mode, "minimized");
    assert.equal(s.focused, "settings");
    /* The minimized window stays in the session, so 11 entries with 10
       open ones: the cap holds the open set, not the session dictionary. */
    assert.equal(Object.keys(s.windows).length, 11);
    const openCount = Object.values(s.windows).filter((w) => w.mode !== "minimized").length;
    assert.equal(openCount, 10);
  });

  it("clamps windows when the work area shrinks", () => {
    let s = initialWmState();
    s = open(s, { app: "proxy" });
    s = reduce(s, { type: "move", payload: { id: "proxy", x: 1000, y: 500 } });
    const small = computeWorkArea(700, 500);
    s = reduce(s, { type: "setWorkArea", payload: { workArea: small } });
    const win = s.windows["proxy"];
    /* The window respects minimum size and the work area through the
       title bar rule: 120px of grab stays visible horizontally, the title
       bar stays between the menu bar and the bottom edge vertically. */
    assert.ok(win.x <= small.left + small.width - 120);
    assert.ok(win.x + 120 >= small.left);
    assert.ok(win.y >= small.top);
    assert.ok(win.y + 40 <= small.top + small.height);
    assert.ok(win.w >= 720);
    assert.ok(win.h >= 480);
  });

  it("moves windows with the 120px title bar grab rule", () => {
    let s = open(initialWmState(), { app: "welcome" });
    s = reduce(s, { type: "move", payload: { id: "welcome", x: -2000, y: -500 } });
    let win = s.windows["welcome"];
    assert.equal(win.x, WA.left + 120 - win.w);
    assert.equal(win.y, WA.top);
    s = reduce(s, { type: "move", payload: { id: "welcome", x: 3000, y: 3000 } });
    win = s.windows["welcome"];
    assert.equal(win.x, WA.left + WA.width - 120);
    assert.equal(win.y, WA.top + WA.height - 40);
  });

  it("snaps to half the work area with an 8px inset and restores", () => {
    let s = open(initialWmState(), { app: "welcome" });
    const before = { x: s.windows["welcome"].x, y: s.windows["welcome"].y, w: s.windows["welcome"].w, h: s.windows["welcome"].h };
    s = reduce(s, { type: "snap", payload: { id: "welcome", side: "left" } });
    let win = s.windows["welcome"];
    assert.deepEqual({ x: win.x, y: win.y, w: win.w, h: win.h }, snapRect(WA, "left"));
    assert.equal(win.mode, "snapped-left");
    assert.deepEqual(win.restore, before);
    s = reduce(s, { type: "toggleMaximize", payload: { id: "welcome" } });
    win = s.windows["welcome"];
    assert.deepEqual({ x: win.x, y: win.y, w: win.w, h: win.h }, before);
    assert.equal(win.mode, "normal");
  });

  it("maximizes into an 8px inset and restores the previous size", () => {
    let s = open(initialWmState(), { app: "welcome" });
    const before = { x: s.windows["welcome"].x, y: s.windows["welcome"].y, w: s.windows["welcome"].w, h: s.windows["welcome"].h };
    s = reduce(s, { type: "toggleMaximize", payload: { id: "welcome" } });
    let win = s.windows["welcome"];
    assert.deepEqual({ x: win.x, y: win.y, w: win.w, h: win.h }, maximizeRect(WA));
    assert.equal(win.mode, "maximized");
    s = reduce(s, { type: "toggleMaximize", payload: { id: "welcome" } });
    win = s.windows["welcome"];
    assert.equal(win.mode, "normal");
    assert.deepEqual({ x: win.x, y: win.y, w: win.w, h: win.h }, before);
  });

  it("minimize moves focus to the next open window, restore brings it back", () => {
    let s = open(initialWmState(), { app: "welcome" });
    s = open(s, { app: "files" });
    s = open(s, { app: "settings" });
    s = reduce(s, { type: "minimize", payload: { id: "settings" } });
    assert.equal(s.focused, "files");
    s = reduce(s, { type: "restore", payload: { id: "settings" } });
    assert.equal(s.focused, "settings");
    assert.equal(s.windows["settings"].mode, "normal");
  });

  it("normalizes z once it passes 900", () => {
    let s = initialWmState();
    s = open(s, { app: "welcome" });
    s = open(s, { app: "files" });
    s = open(s, { app: "settings" });
    /* Escalate the stored z values past the 900 ceiling and refocus the
       bottom window: z must rebase to 100, 101, 102 back to front. */
    const seeded: WMState = {
      ...s,
      windows: {
        welcome: { ...s.windows["welcome"], z: 899 },
        files: { ...s.windows["files"], z: 900 },
        settings: { ...s.windows["settings"], z: 901 },
      },
    };
    s = reduce(seeded, { type: "focus", payload: { id: "welcome" } });
    assert.ok(Object.values(s.windows).every((w) => w.z <= 900));
    assert.equal(s.focused, "welcome");
    assert.equal(s.windows["welcome"].z, 102);
    const orderZs = s.order.map((id) => s.windows[id].z);
    assert.deepEqual(orderZs, [...orderZs].sort((a, b) => a - b));
  });

  it("falls back to the next window on close, then to the desktop", () => {
    let s = initialWmState();
    s = open(s, { app: "welcome" });
    s = open(s, { app: "files" });
    s = open(s, { app: "settings" });
    s = reduce(s, { type: "close", payload: { id: "settings" } });
    assert.equal(s.focused, "files");
    s = reduce(s, { type: "close", payload: { id: "files" } });
    assert.equal(s.focused, "welcome");
    s = reduce(s, { type: "close", payload: { id: "welcome" } });
    assert.equal(s.focused, null);
    assert.deepEqual(s.order, []);
  });

  it("respects minimum sizes on resize", () => {
    let s = open(initialWmState(), { app: "terminal" });
    s = reduce(s, { type: "resize", payload: { id: "terminal:1", w: 10, h: 10 } });
    const win = s.windows["terminal:1"];
    assert.ok(win.w >= 420);
    assert.ok(win.h >= 260);
  });

  /* Recency, brief 3.11: a window focused once just now is more recent
     than one focused three times earlier, so a restored session puts
     focus on the window that had it last. */
  it("restores focus to the most recently focused window, not the most focused", () => {
    let s = open(initialWmState(), { app: "welcome" });
    s = reduce(s, { type: "focus", payload: { id: "welcome" } });
    s = reduce(s, { type: "focus", payload: { id: "welcome" } });
    s = open(s, { app: "hello" });
    const restored = sessionToState(parseSession(serializeSession(s)), 1440, 900, 88);
    assert.equal(restored.focused, "hello");
  });

  /* Adoption geometry, brief 7.1: the shell measures a server rendered
     window and passes its painted box as at. The store keeps the exact
     box when it fits the work area, clamps it when it does not, and
     never moves a window that already exists in the store. */
  it("opens an adopted window at the exact geometry when it fits", () => {
    const s = reduce(initialWmState(), {
      type: "open",
      payload: { app: "welcome", id: "welcome", title: "Welcome", at: { x: 400, y: 122, w: 640, h: 520 } },
    });
    const win = s.windows["welcome"];
    assert.deepEqual({ x: win.x, y: win.y, w: win.w, h: win.h }, { x: 400, y: 122, w: 640, h: 520 });
    assert.equal(s.focused, "welcome");
    assert.equal(win.mode, "normal");
  });

  it("clamps adopted geometry into the work area and up to app minimums", () => {
    const s = reduce(initialWmState(), {
      type: "open",
      payload: { app: "welcome", id: "welcome", title: "Welcome", at: { x: -500, y: 0, w: 200, h: 150 } },
    });
    const win = s.windows["welcome"];
    /* Size bumps to the app minimum, position clamps with the 120px
       title bar grab rule. */
    assert.ok(win.w >= 420);
    assert.ok(win.h >= 420);
    assert.ok(win.x + 120 <= win.x + win.w);
    assert.ok(win.x >= s.workArea.left + 120 - win.w);
    assert.ok(win.y >= s.workArea.top);
    assert.ok(win.y + win.h <= s.workArea.top + s.workArea.height);
  });

  it("ignores at geometry for a window that already exists", () => {
    let s = reduce(initialWmState(), {
      type: "open",
      payload: { app: "welcome", id: "welcome", title: "Welcome", at: { x: 400, y: 122, w: 640, h: 520 } },
    });
    s = reduce(s, {
      type: "open",
      payload: { app: "welcome", id: "welcome", title: "Welcome", at: { x: 0, y: 0, w: 300, h: 300 } },
    });
    const win = s.windows["welcome"];
    assert.deepEqual({ x: win.x, y: win.y, w: win.w, h: win.h }, { x: 400, y: 122, w: 640, h: 520 });
    assert.equal(s.focused, "welcome");
  });
});

describe("wm persistence and deep links", () => {
  it("drops malformed sessions", () => {
    assert.equal(parseSession(null), null);
    assert.equal(parseSession("not json"), null);
    assert.equal(parseSession(JSON.stringify({ v: 2 })), null);
    assert.equal(parseSession(JSON.stringify({ v: 1, windows: [{ id: "bad id!", app: "files", title: "Files" }] })), null);
    const fallback = sessionToState(null, 1440, 900, 88);
    assert.deepEqual(Object.keys(fallback.windows), []);
  });

  it("round trips a session and clamps to the current work area", () => {
    let s = open(initialWmState(), { app: "files" });
    /* Drag the window far off screen, then persist. */
    s = reduce(s, { type: "move", payload: { id: "files", x: -400, y: 32 } });
    const raw = serializeSession(s);
    const parsed = parseSession(raw);
    assert.ok(parsed);
    assert.equal(parsed?.windows.length, 1);
    const restored = sessionToState(parsed, 1200, 800, 88);
    const win = restored.windows["files"];
    assert.ok(win);
    assert.ok(win.x + win.w <= restored.workArea.left + restored.workArea.width);
    assert.ok(win.y >= restored.workArea.top);
    assert.equal(restored.focused, "files");
  });

  it("validates deep links against apps and slugs", () => {
    const slugs = ["healthcare-portal-pentest-lab", "llm-agent-security-lab"];
    assert.deepEqual(parseDeepLink("doc:healthcare-portal-pentest-lab", slugs), {
      app: "doc",
      id: "doc:healthcare-portal-pentest-lab",
      props: { slug: "healthcare-portal-pentest-lab" },
    });
    assert.equal(parseDeepLink("doc:ghostpass-unknown", slugs), null);
    assert.deepEqual(parseDeepLink("files", slugs), { app: "files", id: "files" });
    assert.equal(parseDeepLink("terminal", slugs), null);
    assert.equal(parseDeepLink("terminal:1", slugs), null);
    assert.equal(parseDeepLink("exit", slugs), null);
    assert.equal(parseDeepLink(null, slugs), null);
  });

  it("hydrate keeps focus on the most recently focused open window", () => {
    const session = {
      v: 1 as const,
      windows: [
        {
          id: "files",
          app: "files" as const,
          title: "Files",
          x: 100,
          y: 100,
          w: 880,
          h: 560,
          z: 100,
          mode: "normal" as const,
          focusedAt: 1,
        },
        {
          id: "settings",
          app: "settings" as const,
          title: "Settings",
          x: 200,
          y: 120,
          w: 700,
          h: 500,
          z: 101,
          mode: "normal" as const,
          focusedAt: 2,
        },
      ],
    };
    const state = sessionToState(session, 1440, 900, 88);
    assert.equal(state.focused, "settings");
    /* LRU bookkeeping survives a reload: fill the desktop to the 10 open
       cap, then open an 11th. The cap must minimize files, which carries
       the oldest focusedAt from the stored session, not a fresh window. */
    let s = state;
    for (let i = 1; i <= 8; i++) s = open(s, { app: "doc", props: { slug: `fill-${i}` } });
    assert.equal(Object.keys(s.windows).length, 10);
    const capRun = open(s, { app: "proxy" });
    assert.equal(capRun.windows["files"].mode, "minimized");
    assert.equal(capRun.toast, "Minimized Files to keep things fast");
    assert.equal(capRun.focused, "proxy");
    assert.equal(Object.keys(capRun.windows).length, 11);
  });
});
