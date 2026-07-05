"use client";

import { useEffect, useRef } from "react";
import { CURSOR } from "@/config/motion.config";

/**
 * Replaces the native cursor on pointer-fine devices with a small cyan dot
 * that tracks the mouse via a GSAP-ticker-driven lerp and scales on interaction.
 *
 * - Uses `gsap.ticker` (not rAF) for frame-perfect sync with GSAP animations.
 * - Injects `cursor: none` on <html> while active; restores on unmount.
 * - No-ops entirely under prefers-reduced-motion or touch (pointer: coarse).
 * - Imports GSAP lazily to keep it out of the critical bundle.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const dot = dotRef.current;
    if (!dot) return;

    // Hide the native OS cursor globally.
    const htmlEl = document.documentElement;
    htmlEl.style.cursor = "none";

    // Tracked state
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let isInteractive = false;
    let mounted = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapInstance: any;
    let tickerFn: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      if (!mounted) return;
      gsapInstance = gsap;

      // Set centering offset once; GSAP preserves xPercent/yPercent across set() calls.
      gsap.set(dot, {
        xPercent: -50,
        yPercent: -50,
        x: pos.x,
        y: pos.y,
        opacity: 1,
      });

      // Lerp current position toward mouse target on every GSAP tick.
      tickerFn = () => {
        pos.x += (mouse.x - pos.x) * CURSOR.lerp;
        pos.y += (mouse.y - pos.y) * CURSOR.lerp;
        gsap.set(dot, { x: pos.x, y: pos.y });
      };
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    const INTERACTIVE = 'a, button, [role="button"], label';

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    /** Scale up when entering an interactive element. */
    function onMouseOver(e: MouseEvent) {
      if ((e.target as Element)?.closest(INTERACTIVE) && !isInteractive) {
        isInteractive = true;
        gsapInstance?.to(dot, {
          scale: CURSOR.scaleInteractive,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }

    /** Scale back when leaving an interactive element. */
    function onMouseOut(e: MouseEvent) {
      if ((e.target as Element)?.closest(INTERACTIVE) && isInteractive) {
        isInteractive = false;
        gsapInstance?.to(dot, {
          scale: CURSOR.scaleDefault,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }

    function onMouseDown() {
      gsapInstance?.to(dot, {
        scale: CURSOR.scaleClick,
        duration: 0.1,
        ease: "power2.in",
      });
    }

    function onMouseUp() {
      const target = isInteractive
        ? CURSOR.scaleInteractive
        : CURSOR.scaleDefault;
      gsapInstance?.to(dot, {
        scale: target,
        duration: 0.15,
        ease: "power2.out",
      });
    }

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseup", onMouseUp, { passive: true });

    return () => {
      mounted = false;
      htmlEl.style.cursor = "";
      if (tickerFn) gsapInstance?.ticker.remove(tickerFn);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      // Start invisible; GSAP sets opacity: 1 after positioning to avoid a flash.
      style={{
        width: CURSOR.size,
        height: CURSOR.size,
        opacity: 0,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-cyber-300 mix-blend-difference will-change-transform"
    />
  );
}
