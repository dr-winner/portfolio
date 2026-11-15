"use client";

import { useEffect, useRef } from "react";

/**
 * The living field behind the page. Four soft aurora masses breathe at
 * different depths, drift with the pointer, settle with scroll and pulse
 * gently where the hero's defence scene lands or a finger taps.
 *
 * Everything is CSS and one small rAF loop that writes custom properties,
 * so the strict CSP never sees a script it has to allow. Reduced motion
 * leaves the aurora still. Rendering stops when the tab is hidden or no
 * scene section is on screen.
 */
export function BackgroundFx() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let raf = 0;
    let last = 0;
    let running = false;
    let onScreen = true;
    let visible = !document.hidden;

    const pointer = { x: width * 0.55, y: height * 0.2, tx: width * 0.55, ty: height * 0.2, seen: 0 };
    const scroll = { value: window.scrollY, target: window.scrollY };

    function addTap(x: number, y: number, strength: number) {
      const bloom = document.createElement("span");
      bloom.className = "field-tap";
      bloom.style.left = `${x}px`;
      bloom.style.top = `${y}px`;
      bloom.style.setProperty("--tap-strength", strength.toFixed(2));
      layer?.appendChild(bloom);
      window.setTimeout(() => bloom.remove(), 1000);
    }

    function frame(now: number) {
      if (!running) return;
      raf = window.requestAnimationFrame(frame);
      if (now - last < 1000 / 36) return;
      const t = now * 0.001;
      last = now;

      if (now - pointer.seen > 1600) {
        /* No hand on the screen: the field keeps a slow drift of its own. */
        pointer.tx = width * (0.5 + Math.sin(t * 0.16) * 0.22);
        pointer.ty = height * (0.24 + Math.sin(t * 0.23 + 0.7) * 0.12);
      }

      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;
      scroll.value += (scroll.target - scroll.value) * 0.08;

      const mx = Math.max(-1, Math.min(1, (pointer.x / width - 0.5) * 2));
      const my = Math.max(-1, Math.min(1, (pointer.y / height - 0.5) * 2));
      const scrollShift = Math.min(scroll.value, 5000) / 700;
      layer?.style.setProperty("--field-mx", mx.toFixed(3));
      layer?.style.setProperty("--field-my", my.toFixed(3));
      layer?.style.setProperty("--field-scroll", scrollShift.toFixed(3));
    }

    function sync() {
      const next = visible && onScreen;
      if (next && !running) {
        running = true;
        last = performance.now();
        raf = window.requestAnimationFrame(frame);
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

    function onPress(event: PointerEvent) {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      pointer.seen = performance.now();
      addTap(event.clientX, event.clientY, 0.9);
    }

    function onLeave() {
      pointer.seen = 0;
    }

    function onScroll() {
      scroll.target = window.scrollY;
    }

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      onScroll();
    }

    function onVisibility() {
      visible = !document.hidden;
      sync();
    }

    function onShield(event: Event) {
      const detail = (event as CustomEvent<{ x?: number; y?: number }>).detail;
      if (!detail || typeof detail.x !== "number" || typeof detail.y !== "number") return;
      addTap(detail.x, detail.y, 1.6);
      if (!running && visible && onScreen) sync();
    }

    /* Pause when no section that asks for the field is on screen. */
    const scenes = new Set<Element>();
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
      observed.forEach((item) => observer?.observe(item));
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPress, { passive: true });
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
      window.removeEventListener("pointerdown", onPress);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("field:shield", onShield as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="field-layer pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base plane: deep navy with two soft light sources. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(74% 58% at 78% -6%, var(--field-teal), transparent 66%), radial-gradient(62% 54% at 0% 94%, var(--field-blue), transparent 70%), linear-gradient(180deg, var(--bg) 0%, var(--bg-deep) 100%)",
        }}
      />

      {/* Four blurred masses breathe behind the page. The shells take the
          pointer and scroll offset so the inner glow can animate freely. */}
      <div className="field-orb-shell field-shell-a absolute left-[58%] top-[-18%] h-[72vh] w-[78vw]">
        <span className="field-orb" />
      </div>
      <div className="field-orb-shell field-shell-b absolute left-[-16%] top-[26%] h-[62vh] w-[58vw]">
        <span className="field-orb field-orb-cool" />
      </div>
      <div className="field-orb-shell field-shell-c absolute left-[10%] top-[62%] h-[54vh] w-[64vw]">
        <span className="field-orb field-orb-faint" />
      </div>
      <div className="field-orb-shell field-shell-d absolute left-[66%] top-[58%] h-[46vh] w-[48vw]">
        <span className="field-orb field-orb-cool" />
      </div>

      <div className="noise-layer absolute inset-0" />
    </div>
  );
}
