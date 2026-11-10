"use client";

/* Desktop wallpaper, brief 6.4: one of four CSS-only wallpapers plus the
   cursor light. The pointer light and the 12px counter parallax run in one
   rAF loop shared by the whole desktop, lerped at 0.08 per frame. The loop
   only starts for fine pointers, skips reduced motion entirely (a settings
   override can force the same via [data-wos-motion="reduce"]), and stops
   when the pointer has been still for 2s or the tab is hidden. */

import { useEffect, useRef } from "react";

export const WALLPAPER_NAMES = ["navy-light", "contour", "deep-field", "graphite"] as const;
export type WallpaperName = (typeof WALLPAPER_NAMES)[number];

const LIGHT_SIZE = 600;
const LERP = 0.08;
/* The light tint layers travel at most 12px opposite the cursor. */
const PARALLAX_PX = 12;
const STILL_AFTER_MS = 2000;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  if (document.documentElement.dataset.wosMotion === "reduce") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Wallpaper({ name = "navy-light" }: { name?: WallpaperName }) {
  const lightRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    const tint = tintRef.current;
    if (!light || !tint || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let running = false;
    let lightX = window.innerWidth / 2;
    let lightY = window.innerHeight / 2;
    let lightTargetX = lightX;
    let lightTargetY = lightY;
    let tintX = 0;
    let tintY = 0;
    let lastMoveAt = 0;
    const tintMax = PARALLAX_PX;

    const cancel = () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };
    const isStill = () => lastMoveAt + STILL_AFTER_MS <= performance.now();

    const tick = () => {
      if (!running) return;
      /* Light beam chases the pointer at 0.08 per frame. */
      lightX += (lightTargetX - lightX) * LERP;
      lightY += (lightTargetY - lightY) * LERP;
      light.style.transform = `translate3d(${lightX - LIGHT_SIZE / 2}px, ${lightY - LIGHT_SIZE / 2}px, 0)`;
      /* Tint layers shift up to 12px opposite the cursor, normalised from
         the viewport centre so wide and narrow screens move equally far. */
      const normalX = lightTargetX / window.innerWidth - 0.5;
      const normalY = lightTargetY / window.innerHeight - 0.5;
      const tintTargetX = -normalX * tintMax;
      const tintTargetY = -normalY * tintMax;
      tintX += (tintTargetX - tintX) * LERP;
      tintY += (tintTargetY - tintY) * LERP;
      tint.style.transform = `translate3d(${tintX}px, ${tintY}px, 0)`;
      /* The loop parks itself once the pointer has been still for 2s and
         both lerps have converged. A later pointer move restarts it. */
      if (
        isStill() &&
        Math.abs(lightTargetX - lightX) < 0.2 &&
        Math.abs(lightTargetY - lightY) < 0.2 &&
        Math.abs(tintTargetX - tintX) < 0.2 &&
        Math.abs(tintTargetY - tintY) < 0.2
      ) {
        cancel();
        return;
      }
      raf = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      lightTargetX = event.clientX;
      lightTargetY = event.clientY;
      lastMoveAt = performance.now();
      light.style.opacity = "1";
      start();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancel();
      } else if (!isStill()) {
        start();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancel();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="wos-wallpaper" data-wos-wallpaper={name}>
      <div className="wos-wall-bloom" />
      <div ref={tintRef} className="wos-wall-tint" />
      <div ref={lightRef} className="wos-cursor-light" style={{ opacity: 0 }} />
    </div>
  );
}
