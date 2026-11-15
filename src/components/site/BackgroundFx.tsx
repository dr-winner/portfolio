"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type IconName = "shield" | "lock" | "key" | "terminal" | "bug" | "eye" | "radar" | "code";

type IconSpec = {
  name: IconName;
  /** Centre position as a percentage of the viewport. */
  x: number;
  y: number;
  /** Mobile overrides, kept clear of the hero copy and scene edges. */
  mx?: number;
  my?: number;
  size: number;
  depth: number;
  phase: number;
  accent?: boolean;
  mobile?: boolean;
};

/* Placed in the margins and the space below the hero so the icons never sit
   on top of the copy. */
const ICONS: IconSpec[] = [
  { name: "shield", x: 2, y: 52, mx: 8, my: 48, size: 128, depth: 1.2, phase: 0.2, accent: true, mobile: true },
  { name: "lock", x: 95, y: 28, size: 92, depth: 0.8, phase: 1.4 },
  { name: "key", x: 7, y: 84, mx: 8, my: 86, size: 112, depth: 1.5, phase: 2.2, accent: true, mobile: true },
  { name: "terminal", x: 94, y: 80, size: 120, depth: 0.7, phase: 3.1 },
  { name: "bug", x: 42, y: 94, size: 78, depth: 1.8, phase: 4 },
  { name: "eye", x: 66, y: 91, size: 88, depth: 0.9, phase: 5.2 },
  { name: "radar", x: 99, y: 54, size: 104, depth: 1.3, phase: 2.8 },
  { name: "code", x: 48, y: 16, size: 66, depth: 1.6, phase: 3.7 },
];

const PATHS: Record<IconName, ReactNode> = {
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 7.8 7.5 8.5 4.4-.7 7.5-3.9 7.5-8.5V6L12 3Z" />
      <path d="m8.7 11.8 2.2 2.2 4.4-4.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <path d="M12 14.6v2.3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="3.2" />
      <path d="m10.4 12.6 8-8" />
      <path d="m15.2 7.8 1.9 1.9" />
      <path d="m13.3 9.7 1.9 1.9" />
    </>
  ),
  terminal: (
    <>
      <path d="m5 7 5 5-5 5" />
      <path d="M12.5 17H19" />
    </>
  ),
  bug: (
    <>
      <path d="M8.5 9.5h7V14a3.5 3.5 0 0 1-7 0V9.5Z" />
      <path d="m9.8 7.2-1.4-1.4" />
      <path d="m14.2 7.2 1.4-1.4" />
      <path d="M5.2 12H8" />
      <path d="M16 12h2.8" />
      <path d="m6.2 17 2.3-1.7" />
      <path d="m17.8 17-2.3-1.7" />
      <path d="M12 10v8" />
    </>
  ),
  eye: (
    <>
      <path d="M2.6 12S6.1 5.6 12 5.6 21.4 12 21.4 12 17.9 18.4 12 18.4 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="2.9" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.3" />
      <path d="M12 3.6v4" />
      <path d="M12 16.4v4" />
      <path d="M3.6 12h4" />
      <path d="M16.4 12h4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  code: (
    <>
      <path d="m8.4 8-4.4 4 4.4 4" />
      <path d="m15.6 8 4.4 4-4.4 4" />
      <path d="m13.4 6-2.8 12" />
    </>
  ),
};

type Tap = { x: number; y: number; start: number; strength: number };

/**
 * The living field behind the page. A soft aurora breathes at the base while
 * a loose constellation of security line icons floats above it. The icons
 * lean away from the pointer, brighten as it comes close, drift at different
 * depths as the page scrolls, and pulse outward from a tap.
 *
 * Everything is CSS and one small rAF loop that writes transforms, so the
 * strict CSP never sees a script it has to allow. Reduced motion leaves the
 * icons still and the aurora unanimated. Rendering stops when the tab is
 * hidden or no scene section is on screen.
 */
export function BackgroundFx() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);

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
    let ready = false;

    const pointer = { x: width * 0.55, y: height * 0.2, tx: width * 0.55, ty: height * 0.2, seen: 0 };
    const scroll = { value: window.scrollY, target: window.scrollY };
    const taps: Tap[] = [];
    let agitation = 0;
    let lastScroll = window.scrollY;

    const icons = iconRefs.current;

    function addTap(x: number, y: number, strength: number) {
      taps.push({ x, y, start: performance.now(), strength });
      if (taps.length > 6) taps.shift();

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
        /* No hand on the screen: the icons keep a slow breath of their own. */
        pointer.tx = width * (0.5 + Math.sin(t * 0.16) * 0.22);
        pointer.ty = height * (0.24 + Math.sin(t * 0.23 + 0.7) * 0.12);
      }

      pointer.x += (pointer.tx - pointer.x) * 0.07;
      pointer.y += (pointer.ty - pointer.y) * 0.07;
      scroll.value += (scroll.target - scroll.value) * 0.08;
      agitation *= 0.9;

      const mx = Math.max(-1, Math.min(1, (pointer.x / width - 0.5) * 2));
      const my = Math.max(-1, Math.min(1, (pointer.y / height - 0.5) * 2));
      const scrollShift = Math.min(scroll.value, 5000) / 700;
      layer?.style.setProperty("--field-mx", mx.toFixed(3));
      layer?.style.setProperty("--field-my", my.toFixed(3));
      layer?.style.setProperty("--field-scroll", scrollShift.toFixed(3));

      const min = Math.min(width, height);
      const reach = Math.max(190, min * 0.32);

      for (let i = 0; i < ICONS.length; i += 1) {
        const el = icons[i];
        if (!el) continue;
        const spec = ICONS[i];
        const narrow = width < 768;
        const baseX = ((narrow ? spec.mx ?? spec.x : spec.x) / 100) * width;
        const baseY = ((narrow ? spec.my ?? spec.y : spec.y) / 100) * height;
        const wobble = t * 0.23 + spec.phase;

        let x = Math.sin(wobble) * 9 + Math.cos(wobble * 0.7) * 5;
        let y = Math.cos(wobble * 0.86) * 11;
        y -= Math.min(scroll.value, 5000) * 0.05 * spec.depth;
        y += Math.sin(scroll.value * 0.0022 + spec.phase) * 7 * spec.depth;

        const dx = baseX - pointer.x;
        const dy = baseY - pointer.y;
        const dist = Math.hypot(dx, dy);
        const near = Math.max(0, 1 - dist / reach);
        const hot = Math.max(0, 1 - dist / 150);

        if (dist < reach) {
          const push = near * near * 30;
          x += (dx / (dist || 1)) * push;
          y += (dy / (dist || 1)) * push;
        }

        let pop = 0;
        for (let k = 0; k < taps.length; k += 1) {
          const tap = taps[k];
          const age = now - tap.start;
          if (age < 0 || age > 900) continue;
          const tapDist = Math.hypot(baseX - tap.x, baseY - tap.y);
          if (tapDist < 360) {
            pop = Math.max(pop, (1 - age / 900) * (1 - tapDist / 360) * tap.strength);
          }
        }

        const jitter = agitation * agitation;
        x += Math.sin(t * 17 + i * 1.3) * jitter * 8;
        y += Math.cos(t * 19 + i * 1.9) * jitter * 7;

        const scale = 1 + near * 0.05 + pop * 0.16 + agitation * 0.02;
        const rotate =
          Math.sin(wobble * 0.5) * 4 +
          Math.sin(t * 0.5 + spec.phase) * 2 +
          near * (dx < 0 ? -4 : 4) +
          pop * 3;

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        const quiet = narrow ? 0.55 : 1;
        el.style.opacity = String(
          Math.min(0.86, ((spec.accent ? 0.26 : 0.17) + near * 0.5 + pop * 0.34) * quiet),
        );

        if (hot > 0.45 !== (el.dataset.hot === "true")) {
          el.dataset.hot = hot > 0.45 ? "true" : "false";
        }
      }

      if (!ready) {
        ready = true;
        if (layer) layer.dataset.live = "true";
      }
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
      agitation = Math.min(1, agitation + 0.24);
      addTap(event.clientX, event.clientY, 0.9);
    }

    function onLeave() {
      pointer.seen = 0;
    }

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScroll;
      lastScroll = y;
      scroll.target = y;
      if (Math.abs(delta) > 1) {
        agitation = Math.min(1, agitation + Math.min(0.7, Math.abs(delta) / 180));
      }
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
      agitation = Math.min(1, agitation + 0.5);
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

      {/* Four blurred masses breathe behind the icons. The shells take the
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

      {/* Security line icons. Static in the server output, moved by the loop
          once the page is ready. */}
      <div className="field-icons absolute inset-0">
        {ICONS.map((icon, index) => (
          <div
            key={icon.name}
            ref={(node) => {
              iconRefs.current[index] = node;
            }}
            className={`field-icon${icon.accent ? " is-accent" : ""}${icon.mobile ? " is-mobile" : ""}`}
            style={
              {
                "--icon-left": `${icon.x}%`,
                "--icon-top": `${icon.y}%`,
                "--icon-left-mobile": `${icon.mx ?? icon.x}%`,
                "--icon-top-mobile": `${icon.my ?? icon.y}%`,
                "--icon-size": `${icon.size}px`,
                "--icon-alpha": icon.accent ? 0.26 : 0.17,
              } as CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              {PATHS[icon.name]}
            </svg>
          </div>
        ))}
      </div>

      <div className="noise-layer absolute inset-0" />
    </div>
  );
}
