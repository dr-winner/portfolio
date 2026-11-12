"use client";

import { useEffect, useRef } from "react";

/**
 * The living backdrop: a fine field of points on a deep navy plane that
 * bends around the pointer and settles as you move between sections.
 * Progressive: the static grid and light are CSS and always present, the
 * canvas is added only when the device can afford it and the visitor has
 * not asked for reduced motion. It pauses when the tab is hidden.
 */
export function BackgroundFx() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    if ((navigator.hardwareConcurrency ?? 8) <= 4) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const node = canvas;
    const context = ctx;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let running = false;
    let started = false;

    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const state = { warp: 1, zone: 0, scroll: 0 };

    const dots: { x: number; y: number; seed: number }[] = [];

    function build() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      node.width = Math.floor(width * dpr);
      node.height = Math.floor(height * dpr);
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = width < 900 ? 58 : 52;
      dots.length = 0;
      for (let y = gap; y < height + gap; y += gap) {
        for (let x = gap; x < width + gap; x += gap) {
          dots.push({ x, y, seed: (x * 0.37 + y * 0.71) % 6.283 });
        }
      }
    }

    function frame(now: number) {
      if (!running) return;
      if (now - last < 34) {
        raf = window.requestAnimationFrame(frame);
        return;
      }
      last = now;
      const t = now * 0.0002;

      pointer.x += (pointer.tx - pointer.x) * 0.09;
      pointer.y += (pointer.ty - pointer.y) * 0.09;
      state.warp += ((state.zone ? 0.55 : 1) - state.warp) * 0.02;

      context.clearRect(0, 0, width, height);

      const radius = Math.min(width, height) * (state.zone ? 0.34 : 0.42);
      const radiusSq = radius * radius;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const dx = dot.x - pointer.x;
        const dy = dot.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        let px = dot.x + Math.sin(t + dot.seed + state.scroll * 0.35) * 2.2;
        let py = dot.y + Math.cos(t * 1.2 + dot.seed + state.scroll) * 2.2;

        let near = 0;
        if (distSq < radiusSq) {
          near = 1 - Math.sqrt(distSq) / radius;
          const push = near * near * 24 * state.warp;
          const inv = 1 / (Math.sqrt(distSq) || 1);
          px -= dx * inv * push;
          py -= dy * inv * push;
        }

        const base = 0.16 + near * 0.5;
        if (near > 0.04) {
          context.fillStyle = `rgba(54, 230, 196, ${(0.1 + near * 0.5).toFixed(3)})`;
          context.beginPath();
          context.arc(px, py, 1.1 + near * 1.2, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillStyle = `rgba(148, 170, 196, ${base.toFixed(3)})`;
          context.fillRect(px - 0.7, py - 0.7, 1.4, 1.4);
        }
      }

      raf = window.requestAnimationFrame(frame);
    }

    function start() {
      if (started || !running) return;
      started = true;
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    }

    function onVisibility() {
      running = !document.hidden;
      if (running) {
        started = false;
        start();
      } else if (raf) {
        window.cancelAnimationFrame(raf);
      }
    }

    function onPointer(event: PointerEvent) {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
    }

    function onLeave() {
      pointer.tx = -9999;
      pointer.ty = -9999;
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      state.scroll = max > 0 ? window.scrollY / max : 0;
    }

    function onResize() {
      build();
      onScroll();
    }

    build();
    onScroll();
    running = !document.hidden;

    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer =
      zones.length > 0
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting) {
                  state.zone = entry.target.getAttribute("data-scene") === "quiet" ? 0 : 1;
                }
              }
            },
            { rootMargin: "-35% 0px -35% 0px", threshold: 0 },
          )
        : null;
    zones.forEach((zone) => observer?.observe(zone));

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const idle = window.setTimeout(start, 700);

    return () => {
      running = false;
      window.clearTimeout(idle);
      if (raf) window.cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base plane: deep navy with two soft light sources. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 78% -4%, color-mix(in srgb, var(--glow-signal) 70%, transparent), transparent 62%), radial-gradient(70% 55% at 4% 96%, color-mix(in srgb, var(--glow-ai) 80%, transparent), transparent 66%), linear-gradient(180deg, var(--bg) 0%, var(--bg-deep) 100%)",
        }}
      />
      {/* Static point field keeps the space alive with no script. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--line-strong) 1px, transparent 1.4px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(140% 110% at 60% 12%, black 10%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(140% 110% at 60% 12%, black 10%, transparent 78%)",
          opacity: 0.5,
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-[46vh] w-[72vw] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--glow-signal), transparent 74%)",
          filter: "blur(50px)",
          opacity: 0.75,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="noise-layer absolute inset-0" />
    </div>
  );
}
