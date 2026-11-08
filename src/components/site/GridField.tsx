"use client";

import { useEffect, useRef } from "react";

export function GridField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const root = canvas?.parentElement;
    if (!canvas || !root) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const surface = canvas;
    const host = root;
    const ctx = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let pointer = { x: host.clientWidth * 0.72, y: host.clientHeight * 0.38 };
    let frame = 0;

    function draw() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.floor(width * dpr);
      surface.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const light = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 320);
      light.addColorStop(0, "rgba(94, 234, 212, 0.16)");
      light.addColorStop(1, "rgba(94, 234, 212, 0)");
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
    }

    draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);

    function onMove(event: PointerEvent) {
      const rect = host.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    }

    if (!reduce && !coarse) host.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
