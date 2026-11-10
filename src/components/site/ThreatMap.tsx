"use client";

import { useEffect, useRef } from "react";

type MapNode = { x: number; y: number; vx: number; vy: number; r: number; violet: boolean; pulse: number };
type Packet = { a: number; b: number; t: number; speed: number };

/**
 * Live threat-map: a drifting node network whose links brighten and turn
 * violet around the visitor's cursor, with occasional packets hopping edges.
 * Zero dependencies — one canvas, one rAF loop. The loop only runs while the
 * hero is on screen and the tab is visible; reduced-motion users get the
 * static constellation.
 */
export function ThreatMap({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!wrap || !canvas || !fallback) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = {
      mint: [80, 227, 194] as number[],
      violet: [183, 165, 251] as number[],
    };

    function readColor(name: string, fb: number[]): number[] {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const m = raw.match(/^#([0-9a-fA-F]{6})$/);
      if (!m) return fb;
      const n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function refreshPalette() {
      palette.mint = readColor("--signal", palette.mint);
      palette.violet = readColor("--ai", palette.violet);
    }
    refreshPalette();
    const themeObserver = new MutationObserver(refreshPalette);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let nodes: MapNode[] = [];
    let packets: Packet[] = [];
    let spawnIn = 0.6;
    let mouse: { x: number; y: number } | null = null;
    let rect = { left: 0, top: 0 };

    function seed() {
      const count = Math.max(20, Math.min(56, Math.round((width * height) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.4 + Math.random() * 1.3,
        violet: Math.random() < 0.16,
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function cacheRect() {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      rect = { left: r.left, top: r.top };
    }

    function resize() {
      if (!wrap || !canvas) return;
      const r = wrap.getBoundingClientRect();
      width = r.width;
      height = r.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      cacheRect();
      seed();
    }

    function onPointer(e: PointerEvent) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse = x < -60 || y < -60 || x > width + 60 || y > height + 60 ? null : { x, y };
    }
    function onOut(e: MouseEvent) {
      if (!e.relatedTarget) mouse = null;
    }
    let scrollQueued = false;
    function onScroll() {
      if (scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        cacheRect();
        scrollQueued = false;
      });
    }

    function toggle() {
      const should = visible && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    function step(s: number) {
      for (const n of nodes) {
        n.x += n.vx * (s * 60);
        n.y += n.vy * (s * 60);
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
        n.pulse += s * 2.2;
      }
      for (const p of packets) p.t += p.speed * s * 1.2;
      packets = packets.filter((p) => p.t < 1);
      spawnIn -= s;
      if (spawnIn <= 0) {
        spawnIn = 0.55 + Math.random() * 0.7;
        if (packets.length < 3 && nodes.length > 1) {
          const i = (Math.random() * nodes.length) | 0;
          const a = nodes[i];
          let best = -1;
          let bd = 130;
          for (let j = 0; j < nodes.length; j++) {
            if (j === i) continue;
            const d = Math.hypot(nodes[j].x - a.x, nodes[j].y - a.y);
            if (d < bd) {
              bd = d;
              best = j;
            }
          }
          if (best >= 0) packets.push({ a: i, b: best, t: 0, speed: 0.8 + Math.random() * 0.7 });
        }
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const [mr, mg, mb] = palette.mint;
      const [vr, vg, vb] = palette.violet;

      // Edges — mint by default, violet when the cursor probes nearby.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const max = 112;
          if (d2 > max * max) continue;
          const d = Math.sqrt(d2);
          const alpha = (1 - d / max) * 0.3;
          let violet = false;
          if (mouse) {
            const mx = (a.x + b.x) / 2 - mouse.x;
            const my = (a.y + b.y) / 2 - mouse.y;
            violet = Math.hypot(mx, my) < 150;
          }
          ctx.strokeStyle = violet
            ? `rgba(${vr},${vg},${vb},${Math.min(0.75, alpha + 0.35).toFixed(3)})`
            : `rgba(${mr},${mg},${mb},${(alpha * 0.62).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Cursor probe lines.
      if (mouse) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < 160) {
            ctx.strokeStyle = `rgba(${vr},${vg},${vb},${(0.3 * (1 - d / 160)).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      // Packets hopping along their edge with a short trail.
      for (const p of packets) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const tx = a.x + (b.x - a.x) * Math.max(0, p.t - 0.12);
        const ty = a.y + (b.y - a.y) * Math.max(0, p.t - 0.12);
        ctx.strokeStyle = `rgba(${vr},${vg},${vb},0.4)`;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${vr},${vg},${vb},0.9)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes — the cursor lights up its neighbours.
      for (const n of nodes) {
        const near = mouse ? Math.hypot(n.x - mouse.x, n.y - mouse.y) < 160 : false;
        const [cr, cg, cb] = n.violet ? palette.violet : palette.mint;
        const breathe = 0.72 + 0.28 * Math.sin(n.pulse);
        if (near || n.violet) {
          ctx.shadowColor = `rgba(${cr},${cg},${cb},0.8)`;
          ctx.shadowBlur = 9;
        }
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${(near ? 0.95 : 0.62 * breathe).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (near ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function frame(t: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, t - last) || 16;
      last = t;
      step(dt / 1000);
      draw();
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        toggle();
      },
      { rootMargin: "10%" },
    );
    const onVisibility = () => toggle();

    resize();
    io.observe(wrap);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("mouseout", onOut);

    // Hand over from the static constellation once the first frames are up.
    requestAnimationFrame(() => {
      if (canvas) canvas.style.opacity = "1";
      if (fallback) fallback.style.opacity = "0";
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        maskImage: "radial-gradient(92% 96% at 70% 38%, black 32%, transparent 88%)",
        WebkitMaskImage: "radial-gradient(92% 96% at 70% 38%, black 32%, transparent 88%)",
      }}
    >
      <div ref={fallbackRef} className="absolute inset-0 transition-opacity duration-1000">
        <svg
          aria-hidden
          className="fx-drift absolute inset-0 h-full w-full opacity-[0.55]"
          viewBox="0 0 620 520"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <g stroke="var(--line-strong)" strokeWidth="1">
            <path d="M70 400L210 300L330 350L470 220L560 260" />
            <path d="M210 300L250 170L470 220" />
            <path d="M250 170L400 90L560 260" />
            <path d="M70 400L160 470L330 350" />
          </g>
          <g fill="var(--signal)" opacity="0.7">
            <circle cx="70" cy="400" r="3" />
            <circle cx="330" cy="350" r="2.5" />
            <circle cx="470" cy="220" r="3.5" />
            <circle cx="400" cy="90" r="2.5" />
            <circle cx="160" cy="470" r="2" />
          </g>
          <g fill="var(--ai)" opacity="0.55">
            <circle cx="210" cy="300" r="3" />
            <circle cx="250" cy="170" r="2.5" />
            <circle cx="560" cy="260" r="3" />
          </g>
        </svg>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />
    </div>
  );
}
