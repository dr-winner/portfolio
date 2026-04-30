"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient, non-distracting "agent quietly working" background.
 *
 * - Slow drifting blurred color orbs (radial gradients) on canvas.
 * - Faint monospace "thought tokens" rendered in the DOM, fading in/out.
 * - No grid, no scan lines, no packet trails.
 * - Respects prefers-reduced-motion and pauses when the tab is hidden.
 */
type Orb = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: "cyber" | "signal" | "violet";
  alpha: number;
};

const TOKEN_BANK = [
  "agent.run()",
  "> hunt",
  "auth.verify()",
  "ioc.lookup()",
  "att&ck::T1078",
  "rag.retrieve()",
  "0xfa39",
  "Σ context",
  "Δ baseline",
  "tail -f /var/log",
  "trace://chain",
  "embed(query)",
  "tool.call()",
  "policy.eval()",
  "siem://detect",
  "graph.expand()",
  "score: 0.92",
  "harden()",
  "rule.match()",
  "ψ inference",
];

export function AgenticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tokenLayerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let paused = false;

    const orbs: Orb[] = [];

    function resize() {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      orbs.length = 0;
      const palette: Orb["hue"][] = ["cyber", "signal", "violet", "cyber", "signal"];
      const count = reduced ? 2 : 4;
      for (let i = 0; i < count; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03,
          r: Math.max(260, Math.min(width, height) * (0.38 + Math.random() * 0.3)),
          hue: palette[i % palette.length],
          alpha: 0.08 + Math.random() * 0.1,
        });
      }
    }

    function colorFor(hue: Orb["hue"], a: number) {
      if (hue === "cyber") return `rgba(60, 207, 255, ${a})`;
      if (hue === "signal") return `rgba(255, 174, 0, ${a * 0.85})`;
      return `rgba(168, 120, 255, ${a * 0.9})`;
    }

    function draw() {
      if (paused) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      ctx!.clearRect(0, 0, width, height);

      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;

        // gentle wrap/bounce
        if (o.x < -o.r) o.x = width + o.r;
        if (o.x > width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = height + o.r;
        if (o.y > height + o.r) o.y = -o.r;

        const grad = ctx!.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, colorFor(o.hue, o.alpha));
        grad.addColorStop(0.55, colorFor(o.hue, o.alpha * 0.35));
        grad.addColorStop(1, colorFor(o.hue, 0));

        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onVisibility() {
      paused = document.hidden;
    }

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Ghost code tokens layer
  useEffect(() => {
    const layer = tokenLayerRef.current;
    if (!layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const slots = Array.from({ length: 6 }, () => {
      const el = document.createElement("span");
      el.className =
        "absolute font-mono text-[10px] tracking-tight whitespace-nowrap text-slate-800/[0.06] transition-opacity duration-[2400ms] ease-in-out select-none dark:text-white/[0.045]";
      el.style.opacity = "0";
      layer.appendChild(el);
      return el;
    });

    let alive = true;

    function relocate(el: HTMLSpanElement, immediate = false) {
      if (!alive) return;
      const text = TOKEN_BANK[Math.floor(Math.random() * TOKEN_BANK.length)];
      el.textContent = text;
      el.style.left = `${5 + Math.random() * 90}%`;
      el.style.top = `${8 + Math.random() * 80}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 4}deg)`;
      el.style.opacity = immediate ? "0" : "0";
      window.setTimeout(() => {
        if (!alive) return;
        el.style.opacity = (0.35 + Math.random() * 0.25).toString();
      }, 120);
      window.setTimeout(() => {
        if (!alive) return;
        el.style.opacity = "0";
      }, 5000 + Math.random() * 3000);
      window.setTimeout(() => relocate(el), 9000 + Math.random() * 4000);
    }

    slots.forEach((el, i) => {
      window.setTimeout(() => relocate(el, true), i * 700 + Math.random() * 500);
    });

    return () => {
      alive = false;
      slots.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.38] transition-opacity duration-500 dark:opacity-100">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div ref={tokenLayerRef} className="absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/85 via-transparent to-slate-200/95 dark:from-ink/30 dark:via-transparent dark:to-ink/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(234,243,252,0.72)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,7,13,0.55)_100%)]" />
    </div>
  );
}
