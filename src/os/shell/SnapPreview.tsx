"use client";

/* Snap preview, brief 3.7 and fix 2 of the phase 1 review: one element
   that paints the edge hint a dragged window emits on the snap hint bus.
   Left and right are half the work area with the 8px inset, top is the
   maximize rect. Pure paint, no state, no timers. */

import { useEffect, useRef } from "react";
import { wmStore } from "../wm/store";
import { maximizeRect, snapRect } from "../wm/geometry";
import { snapHintBus, type SnapHint } from "./window-adapter";

export function SnapPreview() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = snapHintBus.on((hint: SnapHint) => {
      const el = ref.current;
      if (!el) return;
      if (!hint) {
        el.dataset.active = "false";
        return;
      }
      const wa = wmStore.getState().workArea;
      const rect = hint === "top" ? maximizeRect(wa) : snapRect(wa, hint);
      el.style.left = `${rect.x}px`;
      el.style.top = `${rect.y}px`;
      el.style.width = `${rect.w}px`;
      el.style.height = `${rect.h}px`;
      el.dataset.active = "true";
    });
    return () => {
      unsub();
    };
  }, []);

  return <div ref={ref} className="wos-snap-preview" data-active="false" aria-hidden />;
}
