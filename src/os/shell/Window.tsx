"use client";

/* The window frame for React rendered windows, brief 3.1 and 6.6. Server
   rendered shells are adopted in place by window-adapter.ts instead, they
   never remount. This component handles windows opened after hydration:
   geometry, z order, drag and resize via the shared adapter. A minimized
   window hides with content-visibility so loops inside the app pause, and
   the genie minimize choreography is applied by the shell when it knows
   the dock icon rect. */

import { useEffect, useRef } from "react";
import { useWm, wmStore } from "../wm/store";
import { WindowChrome } from "./WindowChrome";
import { bindWindow, createResizeZones, snapHintBus, type SnapHint } from "./window-adapter";
import type { WinState } from "../wm/reducer";

export function Window({
  id,
  children,
  classNames,
  onClose,
}: {
  id: string;
  children: React.ReactNode;
  classNames?: string;
  onClose?: (id: string) => boolean | void;
}) {
  const ref = useRef<HTMLElement>(null);
  const win = useWm((s) => s.windows[id]);
  const focused = useWm((s) => s.focused === id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const undo = bindWindow({
      el,
      id,
      workArea: () => wmStore.getState().workArea,
      onSnapHint: (hint: SnapHint) => snapHintBus.emit(hint),
    });
    const zones = createResizeZones();
    for (const zone of zones) el.appendChild(zone);
    return () => {
      undo();
      for (const zone of zones) zone.remove();
    };
  }, [id]);

  if (!win) return null;

  return (
    <section
      ref={ref}
      data-wm-window={id}
      data-wm-mode={win.mode}
      data-state={focused && win.mode !== "minimized" ? "focused" : "blur"}
      data-dragging="false"
      className={["wos-window", classNames].filter(Boolean).join(" ")}
      style={inlineGeometry(win)}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      data-wos-region="windows"
      data-wos-app={win.app}
    >
      <WindowChrome id={id} app={win.app} title={win.title} focused={focused} onClose={onClose} />
      <div className="wos-window-body" data-minimized={win.mode === "minimized" ? "true" : "false"}>
        {children}
      </div>
    </section>
  );
}

function inlineGeometry(win: WinState) {
  /* Minimized visibility is owned by the desktop shell paint, which runs
     the genie animation before hiding and pauses the paint while a drag
     or animation is live. React only writes geometry and z order so the
     two never fight over the same property. */
  return {
    transform: `translate3d(${win.x}px, ${win.y}px, 0)`,
    width: `${win.w}px`,
    height: `${win.h}px`,
    zIndex: win.z,
  };
}
