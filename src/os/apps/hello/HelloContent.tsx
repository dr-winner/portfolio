"use client";

/* The temporary Hello app, brief Phase 1 item 10 and fix 2 of the phase 1
   review: its only job is to prove the window manager. Three of these
   windows at once show stacking, focus, drag, resize, snap, minimize and
   close on real content. It says exactly what it is, ships no fake
   features, and goes away when the real apps land in Phase 2. */

import { dispatchWm } from "../../wm/store";

export function HelloContent({ index }: { index: number }) {
  const next = index + 1;
  return (
    <div className="wos-hello">
      <p className="wos-window-note">Temporary proof app for the window manager. The real apps land in Phase 2 and this one is removed then.</p>
      <h3 className="wos-listhead">Proof window {index} of 3</h3>
      <p className="wos-hello-line">
        Drag this window by its title bar, resize it from any edge, snap it to a screen half, minimize it to the dock and close it.
        With all three open the stack keeps one window focused and the rest blurred.
      </p>
      {index < 3 ? (
        <div className="wos-window-actions">
          <button
            type="button"
            className="wos-btn wos-btn-primary"
            onClick={() => dispatchWm({ type: "open", payload: { app: "hello", id: `hello:${next}`, title: `Hello ${next}` } })}
          >
            Open Hello {next}
          </button>
        </div>
      ) : null}
    </div>
  );
}
