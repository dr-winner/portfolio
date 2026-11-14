"use client";

import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  seed: number;
};

type ShieldPulse = { x: number; y: number; start: number };

const SHIELD_MS = 1250;

/**
 * The living field behind the page: a slow mesh of teal and navy light that
 * bends around the pointer, follows touch, drifts with scroll and pulls
 * together into a gate when the hero scene blocks an attack.
 *
 * It is canvas 2D on purpose: no extra dependency, no shader, nothing that
 * the strict CSP has to allow. The static gradient and dot field below are
 * plain CSS, so reduced motion and a failed canvas still get the same look.
 * Rendering stops when the tab is hidden or no scene section is on screen.
 */
export function BackgroundFx() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!context) return;
    const ctx = context;
    const node = canvas;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower = coarse || (navigator.hardwareConcurrency ?? 8) <= 4;
    const fps = lowPower ? 26 : 36;
    const step = 1000 / fps;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let running = false;
    let onScreen = true;
    let visible = !document.hidden;
    let ready = false;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, seen: 0 };
    const drift = { scroll: 0, target: 0 };
    let shield: ShieldPulse | null = null;
    const motes: Mote[] = [];
    const scenes = new Set<Element>();

    function build() {
      width = Math.max(320, window.innerWidth);
      height = Math.max(320, window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.15 : 1.6);
      node.width = Math.floor(width * dpr);
      node.height = Math.floor(height * dpr);
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width < 700 ? 58 : 112;
      const count = Math.round(area * (lowPower ? 0.74 : 1));
      motes.length = 0;
      for (let i = 0; i < count; i += 1) {
        motes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (lowPower ? 0.12 : 0.2),
          vy: (Math.random() - 0.5) * (lowPower ? 0.1 : 0.18),
          s: 0.7 + Math.random() * 1.5,
          seed: Math.random() * Math.PI * 2,
        });
      }

      if (!pointer.seen) {
        pointer.x = width * 0.62;
        pointer.y = height * 0.24;
      }
    }

    function palette() {
      const light = document.documentElement.classList.contains("light");
      return light
        ? { teal: "15,118,110", cool: "37,99,235", base: "71,85,105" }
        : { teal: "54,230,196", cool: "96,150,255", base: "132,158,190" };
    }

    function draw(now: number, t: number, colors: ReturnType<typeof palette>) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const px = pointer.x;
      const py = pointer.y;
      const influence = Math.min(width, height) * (coarse ? 0.44 : 0.35);
      const influenceSq = influence * influence;
      const shieldAge = shield ? now - shield.start : Infinity;
      const shieldOn = shield && shieldAge < SHIELD_MS;
      const shieldK = shieldOn ? 1 - shieldAge / SHIELD_MS : 0;

      /* A soft light that follows the pointer so the field reads at once. */
      const halo = ctx.createRadialGradient(px, py, 0, px, py, influence * 1.7);
      halo.addColorStop(0, `rgba(${colors.teal},0.13)`);
      halo.addColorStop(0.45, `rgba(${colors.teal},0.045)`);
      halo.addColorStop(1, `rgba(${colors.teal},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      /* Two slow ribbons keep the plane moving even when the pointer is still. */
      for (let band = 0; band < 2; band += 1) {
        ctx.beginPath();
        const base = height * (0.26 + band * 0.34) + drift.scroll * height * 0.16;
        for (let x = -20; x <= width + 20; x += 26) {
          const y = base + Math.sin(x * 0.0038 + t * 0.34 + band * 1.9) * (34 + band * 18);
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${band === 0 ? colors.teal : colors.cool},${band === 0 ? "0.075" : "0.055"})`;
        ctx.lineWidth = band === 0 ? 1.4 : 1;
        ctx.stroke();
      }

      /* Move and place the motes first, collecting their current screen
         positions so link lines and dots agree. */
      const placed: { x: number; y: number; near: number; s: number }[] = [];

      for (let i = 0; i < motes.length; i += 1) {
        const m = motes[i];
        m.x += m.vx + Math.cos(t * 0.8 + m.seed) * 0.16;
        m.y += m.vy + Math.sin(t * 0.66 + m.seed) * 0.14 + drift.scroll * 0.16;

        if (m.x < -30) m.x = width + 30;
        else if (m.x > width + 30) m.x = -30;
        if (m.y < -30) m.y = height + 30;
        else if (m.y > height + 30) m.y = -30;

        const dx = m.x - px;
        const dy = m.y - py;
        const d2 = dx * dx + dy * dy;
        let near = 0;

        if (d2 < influenceSq) {
          near = 1 - Math.sqrt(d2) / influence;
          const inv = 1 / (Math.sqrt(d2) || 1);
          /* A gentle swirl instead of a hard push: the field opens around
             the pointer and curls rather than scattering. */
          m.x += (-dy * inv) * near * 1.9 + dx * inv * near * 0.55;
          m.y += (dx * inv) * near * 1.9 + dy * inv * near * 0.55;
        }

        if (shield && shieldOn) {
          const sdx = m.x - shield.x;
          const sdy = m.y - shield.y;
          const sd = Math.hypot(sdx, sdy);
          const reach = 250;
          if (sd < reach) {
            const pull = (1 - sd / reach) * shieldK;
            const lane = shield.y + (sdy < 0 ? -1 : 1) * (46 + (i % 4) * 26);
            m.x += (shield.x + (sdx < 0 ? -9 : 9) - m.x) * 0.05 * pull;
            m.y += (lane - m.y) * 0.028 * pull;
            near = Math.max(near, pull * 0.9);
          }
        }

        placed.push({ x: m.x, y: m.y, near, s: m.s });
      }

      /* Hairline mesh, brighter near the cursor and the shield. */
      const linkLimit = lowPower ? 104 : 124;
      const linkSq = linkLimit * linkLimit;
      for (let i = 0; i < placed.length; i += 1) {
        const a = placed[i];
        for (let j = i + 1; j < placed.length; j += 1) {
          const b = placed[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkSq) continue;
          const alpha = (1 - Math.sqrt(d2) / linkLimit) * (0.17 + (a.near + b.near) * 0.26);
          if (alpha < 0.014) continue;
          ctx.strokeStyle = `rgba(${colors.teal},${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      /* Gate arcs and the two vertical rails that form when the hero blocks. */
      if (shield && shieldOn) {
        const grow = shieldAge * 0.09;
        for (let ring = 0; ring < 3; ring += 1) {
          const radius = 48 + grow + ring * 34;
          ctx.strokeStyle = `rgba(${colors.teal},${(0.34 * shieldK * (1 - ring * 0.22)).toFixed(3)})`;
          ctx.lineWidth = ring === 0 ? 1.5 : 1;
          ctx.beginPath();
          ctx.arc(shield.x, shield.y, radius, -Math.PI * 0.12, Math.PI * 1.12);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(${colors.teal},${(0.4 * shieldK).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(shield.x - 15, shield.y - 104);
        ctx.lineTo(shield.x - 15, shield.y + 104);
        ctx.moveTo(shield.x + 15, shield.y - 104);
        ctx.lineTo(shield.x + 15, shield.y + 104);
        ctx.stroke();
      }

      /* Points. The glow doubles as the pointer echo and the gate fill. */
      for (let i = 0; i < placed.length; i += 1) {
        const p = placed[i];
        const hot = p.near;
        const alpha = 0.3 + hot * 0.66;
        const radius = p.s + hot * 1.8;
        ctx.fillStyle = hot > 0.08 ? `rgba(${colors.teal},${alpha.toFixed(3)})` : `rgba(${colors.base},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (hot > 0.25) {
          ctx.fillStyle = `rgba(${colors.cool},${(hot * 0.2).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 4.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";
    }

    function loop(now: number) {
      if (!running) return;
      raf = window.requestAnimationFrame(loop);
      if (now - last < step) return;
      const t = now * 0.001;
      last = now;

      const idleFor = now - pointer.seen;
      if (idleFor > 1600) {
        /* No hand on the screen: drift on a slow orbit and let scroll pull
           the centre of the field down the page. */
        pointer.tx = width * (0.5 + Math.sin(t * 0.19) * 0.26);
        pointer.ty = height * (0.18 + drift.scroll * 0.55 + Math.sin(t * 0.31 + 0.8) * 0.1);
      }

      pointer.x += (pointer.tx - pointer.x) * 0.085;
      pointer.y += (pointer.ty - pointer.y) * 0.085;
      drift.scroll += (drift.target - drift.scroll) * 0.06;

      draw(now, t, palette());
      if (!ready) {
        ready = true;
        node.dataset.live = "true";
      }
    }

    function sync() {
      const next = visible && onScreen;
      if (next && !running) {
        running = true;
        last = performance.now();
        raf = window.requestAnimationFrame(loop);
      } else if (!next && running) {
        running = false;
        window.cancelAnimationFrame(raf);
      }
    }

    function onPointer(event: PointerEvent) {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      pointer.seen = performance.now();
    }

    function onLeave() {
      pointer.seen = 0;
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      drift.target = max > 0 ? window.scrollY / max : 0;
    }

    function onResize() {
      build();
      onScroll();
    }

    function onVisibility() {
      visible = !document.hidden;
      sync();
    }

    function onShield(event: Event) {
      const detail = (event as CustomEvent<{ x?: number; y?: number }>).detail;
      if (!detail || typeof detail.x !== "number" || typeof detail.y !== "number") return;
      shield = { x: detail.x, y: detail.y, start: performance.now() };
      if (!running && visible && onScreen) sync();
    }

    build();
    onScroll();

    /* Pause when no section that asks for the field is on screen. */
    const observed = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    let observer: IntersectionObserver | null = null;
    if (observed.length > 0) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) scenes.add(entry.target);
            else scenes.delete(entry.target);
          }
          onScreen = scenes.size > 0;
          sync();
        },
        { rootMargin: "120px 0px", threshold: 0 },
      );
      observed.forEach((node) => observer?.observe(node));
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("field:shield", onShield as EventListener);
    document.addEventListener("visibilitychange", onVisibility);

    /* Let the hero headline and scene paint before the field starts. */
    const startTimer = window.setTimeout(() => {
      visible = !document.hidden;
      sync();
    }, 260);

    return () => {
      running = false;
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("field:shield", onShield as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base plane: deep navy with two soft light sources. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(74% 58% at 78% -6%, var(--field-teal), transparent 66%), radial-gradient(62% 54% at 0% 94%, var(--field-blue), transparent 70%), linear-gradient(180deg, var(--bg) 0%, var(--bg-deep) 100%)",
        }}
      />
      {/* Static point field keeps the space alive with no script. */}
      <div
        className="field-grid absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--line-strong) 1.1px, transparent 1.5px)",
          backgroundSize: "42px 42px",
          maskImage: "radial-gradient(150% 110% at 58% 8%, black 10%, transparent 86%)",
          WebkitMaskImage: "radial-gradient(150% 110% at 58% 8%, black 10%, transparent 86%)",
        }}
      />
      <div
        className="field-orb absolute left-1/2 top-[-16%] h-[62vh] w-[90vw] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, var(--field-glow), transparent 70%)`,
          filter: "blur(42px)",
        }}
      />
      <div
        className="field-orb field-orb-cool absolute -right-[18%] top-[34%] h-[52vh] w-[62vw] rounded-full"
        style={{
          background: `radial-gradient(closest-side, var(--field-blue), transparent 70%)`,
          filter: "blur(58px)",
        }}
      />
      <canvas ref={canvasRef} width={1} height={1} className="field-canvas absolute inset-0 h-full w-full" />
      <div className="noise-layer absolute inset-0" />
    </div>
  );
}
