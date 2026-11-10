/* Window interactions, brief 3.3 to 3.7. A DOM adapter shared by server
   rendered window shells (adopted without remounting them) and by React
   rendered windows. Pointer Events with setPointerCapture, a rAF loop for
   live positioning, store commits on pointerup only, and a short clamped
   inertial glide when release velocity passes 1.2 px per ms. Windows sit
   on translate3d transforms. Resize writes width and height straight to
   the element per frame, the one allowed exception, and never touches
   React state. */

import { wmStore, dispatchWm } from "../wm/store";
import { clampPosition, clampSize, DEFAULT_SIZES, type WorkArea } from "../wm/geometry";

const SNAP_EDGE = 8;
const RELEASE_VELOCITY = 1.2;
const INERTIA_TIME_CONSTANT = 180;
const INERTIA_STOP_VELOCITY = 0.02;
const TITLE_GRAB_INSET = 0.92;

export type DragMode = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
export type SnapHint = "left" | "right" | "top" | null;

/* Snap hint bus: windows emit edge hints during a drag, the desktop shell
   paints the preview. A module level channel keeps the two decoupled. */
export const snapHintBus = (() => {
  const listeners = new Set<(hint: SnapHint) => void>();
  return {
    emit(hint: SnapHint) {
      for (const listener of listeners) listener(hint);
    },
    on(listener: (hint: SnapHint) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();

export interface WindowBinding {
  el: HTMLElement;
  id: string;
  workArea(): WorkArea;
  onSnapHint?(hint: SnapHint): void;
  onDragStart?(): void;
  onDragEnd?(): void;
}

function writeTransform(el: HTMLElement, x: number, y: number, w: number, h: number, withSize: boolean) {
  el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  if (withSize) {
    el.style.width = `${Math.round(w)}px`;
    el.style.height = `${Math.round(h)}px`;
  }
}

/* One rAF paint per frame while a drag or resize is live. Kept out of
   bindWindow: the schedule closure there owns the loop inline. */

/* Attach drag, resize, focus handling, snap hints and title double click
   to one window element. Returns the cleanup function. */
export function bindWindow(binding: WindowBinding): () => void {
  const { el, id } = binding;
  let paintHandle = 0;

  const onPointerDown = (event: PointerEvent) => {
    /* Focus on any pointer down inside the window, brief 3.5. */
    if (wmStore.getState().focused !== id) {
      dispatchWm({ type: "focus", payload: { id } });
    }
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    const zone = (target?.dataset?.wosZone ?? undefined) as DragMode | undefined;
    const onTitleBar = Boolean(target?.closest?.("[data-wos-titlebar]"));
    if (!zone && !onTitleBar) return;

    const state = wmStore.getState().windows[id];
    if (!state || state.mode === "minimized") return;

    const mode: DragMode = zone ?? "move";
    const isResize = mode !== "move";
    let live: { x: number; y: number; w: number; h: number };

    if (isResize) {
      /* Resizing always starts from the live box in the store. */
      live = { x: state.x, y: state.y, w: state.w, h: state.h };
    } else if (state.mode === "normal") {
      live = { x: state.x, y: state.y, w: state.w, h: state.h };
    } else {
      /* Dragging a snapped or maximized window resumes the restored size
         and keeps the pointer at the same relative title bar x, brief 3.7. */
      dispatchWm({ type: "toggleMaximize", payload: { id } });
      const resumed = wmStore.getState().windows[id];
      if (!resumed) return;
      const ratio = Math.min(TITLE_GRAB_INSET, Math.max(1 - TITLE_GRAB_INSET, state.w > 0 ? (event.clientX - state.x) / state.w : 0.5));
      live = {
        x: event.clientX - ratio * resumed.w,
        y: event.clientY - 20,
        w: resumed.w,
        h: resumed.h,
      };
      writeTransform(el, live.x, live.y, live.w, live.h, true);
    }

    /* Lift a static, server rendered window out of its CSS centring block
       once, brief 7.1. */
    if (el.dataset.wosStatic === "true") {
      el.style.left = "0";
      el.style.top = "0";
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.margin = "0";
      writeTransform(el, live.x, live.y, live.w, live.h, isResize);
      el.dataset.wosStatic = "false";
    }

    let lastX = event.clientX;
    let lastY = event.clientY;
    let lastT = event.timeStamp;
    let velocityX = 0;
    let velocityY = 0;
    let hint: SnapHint = null;

    el.setPointerCapture(event.pointerId);
    document.body.dataset.wosDragging = "true";
    el.dataset.dragging = "true";
    binding.onDragStart?.();

    const schedule = () => {
      if (!paintHandle) {
        paintHandle = requestAnimationFrame(() => {
          paintHandle = 0;
          writeTransform(el, live.x, live.y, live.w, live.h, isResize);
        });
      }
    };

    const onMove = (moveEvent: PointerEvent) => {
      const area = binding.workArea();
      const dt = Math.max(1, moveEvent.timeStamp - lastT);
      const dx = moveEvent.clientX - lastX;
      const dy = moveEvent.clientY - lastY;
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
      lastT = moveEvent.timeStamp;
      velocityX = dx / dt;
      velocityY = dy / dt;

      if (isResize) {
        const min = DEFAULT_SIZES[state.app] ?? { minW: 360, minH: 240 };
        let x = live.x;
        let y = live.y;
        let w = live.w;
        let h = live.h;
        if (mode.includes("e")) w += dx;
        if (mode.includes("s")) h += dy;
        if (mode.includes("w")) {
          w -= dx;
          x += dx;
        }
        if (mode.includes("n")) {
          h -= dy;
          y += dy;
        }
        const sized = clampSize(w, h, min.minW, min.minH, area.left, area.top, area);
        /* The opposite edge stays anchored on west and north resizing. */
        if (mode.includes("w")) x = Math.max(area.left, Math.min(x, live.x + live.w - sized.w));
        if (mode.includes("n")) y = Math.max(area.top, Math.min(y, live.y + live.h - sized.h));
        live = { x, y, w: sized.w, h: sized.h };
      } else {
        const next = clampPosition(live.x + dx, live.y + dy, live.w, area);
        live = { x: next.x, y: next.y, w: live.w, h: live.h };
        const nearLeft = moveEvent.clientX - area.left <= SNAP_EDGE;
        const nearRight = area.left + area.width - moveEvent.clientX <= SNAP_EDGE;
        const nearTop = moveEvent.clientY - area.top <= SNAP_EDGE;
        const nextHint: SnapHint = nearTop ? "top" : nearLeft ? "left" : nearRight ? "right" : null;
        if (nextHint !== hint) {
          hint = nextHint;
          binding.onSnapHint?.(hint);
        }
      }
      schedule();
    };

    const onUp = (upEvent: PointerEvent) => {
      void upEvent;
      if (paintHandle) {
        cancelAnimationFrame(paintHandle);
        paintHandle = 0;
      }
      writeTransform(el, live.x, live.y, live.w, live.h, isResize);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onCancel);
      try {
        el.releasePointerCapture(event.pointerId);
      } catch {
        /* The capture may already be gone. */
      }
      delete document.body.dataset.wosDragging;
      delete el.dataset.dragging;
      binding.onDragEnd?.();
      binding.onSnapHint?.(null);

      const area = binding.workArea();
      if (isResize) {
        dispatchWm({ type: "resize", payload: { id, x: live.x, y: live.y, w: live.w, h: live.h } });
        return;
      }
      if (hint === "top") {
        dispatchWm({ type: "maximize", payload: { id } });
        return;
      }
      if (hint === "left" || hint === "right") {
        dispatchWm({ type: "snap", payload: { id, side: hint } });
        return;
      }
      dispatchWm({ type: "move", payload: { id, x: live.x, y: live.y } });
      if (Math.hypot(velocityX, velocityY) > RELEASE_VELOCITY) {
        glide(el, id, live.x, live.y, velocityX, velocityY, area);
      }
    };

    const onCancel = (cancelEvent: PointerEvent) => onUp(cancelEvent);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp, { once: false });
    el.addEventListener("pointercancel", onCancel, { once: false });
  };

  const onDblClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest?.("[data-wos-nodrag]")) return;
    if (!target?.closest?.("[data-wos-titlebar]")) return;
    dispatchWm({ type: "toggleMaximize", payload: { id } });
  };

  el.addEventListener("pointerdown", onPointerDown);
  el.addEventListener("dblclick", onDblClick);
  return () => {
    el.removeEventListener("pointerdown", onPointerDown);
    el.removeEventListener("dblclick", onDblClick);
  };
}

/* Short inertial glide after a fast release, brief 3.3: velocity decays
   with motion's inertia shape (time constant 180ms) while the position
   integrates, still clamped to the work area. The resting position is
   committed once the glide stops. */
function glide(el: HTMLElement, id: string, startX: number, startY: number, vx: number, vy: number, workArea: WorkArea) {
  let x = startX;
  let y = startY;
  let velocityX = Math.min(30, Math.max(-30, vx * 5));
  let velocityY = Math.min(30, Math.max(-30, vy * 5));
  let last = performance.now();
  let stopped = false;
  const step = () => {
    if (stopped) return;
    const now = performance.now();
    const dt = now - last;
    last = now;
    velocityX *= Math.exp(-dt / INERTIA_TIME_CONSTANT);
    velocityY *= Math.exp(-dt / INERTIA_TIME_CONSTANT);
    x += velocityX * dt;
    y += velocityY * dt;
    const pos = clampPosition(x, y, 360, workArea);
    el.style.transform = `translate3d(${Math.round(pos.x)}px, ${Math.round(pos.y)}px, 0)`;
    if (Math.hypot(velocityX, velocityY) <= INERTIA_STOP_VELOCITY) {
      stopped = true;
      dispatchWm({ type: "move", payload: { id, x: pos.x, y: pos.y } });
      return;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* Resize hit zones, brief 3.4: 6px edges and 14px corners placed just
   outside the visible border so they never steal clicks from content. */
export function createResizeZones(): HTMLDivElement[] {
  const zones: HTMLDivElement[] = [];
  const add = (zone: string, css: Partial<CSSStyleDeclaration>, cursor: string) => {
    const el = document.createElement("div");
    el.dataset.wosZone = zone;
    el.style.position = "absolute";
    el.style.cursor = cursor;
    el.style.touchAction = "none";
    Object.assign(el.style, css);
    zones.push(el);
  };
  const corner = "14px";
  add("n", { top: "0", left: corner, right: corner, height: "6px" }, "ns-resize");
  add("s", { bottom: "0", left: corner, right: corner, height: "6px" }, "ns-resize");
  add("w", { left: "0", top: corner, bottom: corner, width: "6px" }, "ew-resize");
  add("e", { right: "0", top: corner, bottom: corner, width: "6px" }, "ew-resize");
  add("nw", { top: "-4px", left: "-4px", width: corner, height: corner }, "nwse-resize");
  add("ne", { top: "-4px", right: "-4px", width: corner, height: corner }, "nesw-resize");
  add("sw", { bottom: "-4px", left: "-4px", width: corner, height: corner }, "nesw-resize");
  add("se", { bottom: "-4px", right: "-4px", width: corner, height: corner }, "nwse-resize");
  return zones;
}
