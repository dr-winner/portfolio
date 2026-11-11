"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { bindCspCounter, finePointer, prefersReducedMotion } from "@/lib/motion";

let pendingDone: (() => void) | null = null;

export function ClientRuntime() {
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    bindCspCounter();
    console.log("Looking under the hood? Good. Found an issue? See /.well-known/security.txt");
  }, []);

  useEffect(() => {
    pendingDone?.();
    pendingDone = null;
  }, [pathname]);

  useEffect(() => {
    function onToast(event: Event) {
      const message = (event as CustomEvent<string>).detail;
      if (!message) return;
      setToast(message);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(""), 2400);
    }
    window.addEventListener("site-toast", onToast);
    return () => window.removeEventListener("site-toast", onToast);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || typeof document.startViewTransition !== "function") return undefined;
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      event.preventDefault();
      event.stopPropagation();
      const next = `${url.pathname}${url.search}${url.hash}`;
      document.startViewTransition(() => {
        router.push(next);
        return new Promise<void>((resolve) => {
          let settled = false;
          const done = () => {
            if (settled) return;
            settled = true;
            resolve();
          };
          pendingDone = done;
          window.setTimeout(done, 900);
        });
      });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return undefined;
    let tx = 0;
    let ty = 0;
    let cx = -9999;
    let cy = -9999;
    let raf = 0;
    let running = false;
    let still = 0;
    let visible = true;
    const root = document.documentElement;

    function magnets() {
      document.querySelectorAll<HTMLElement>("[data-magnet]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const near = pointerNear(rect, tx, ty, 80);
        if (!near) {
          el.style.setProperty("--mag-x", "0px");
          el.style.setProperty("--mag-y", "0px");
          return;
        }
        const max = 6;
        el.style.setProperty("--mag-x", `${near.x * max}px`);
        el.style.setProperty("--mag-y", `${near.y * max}px`);
      });
    }

    function tilt() {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inside = tx >= rect.left && tx <= rect.right && ty >= rect.top && ty <= rect.bottom;
        if (!inside) {
          if (el.classList.contains("is-hot")) {
            el.classList.remove("is-hot");
            el.style.setProperty("--rx", "0deg");
            el.style.setProperty("--ry", "0deg");
            el.style.setProperty("--lift", "0px");
            el.style.removeProperty("will-change");
          }
          return;
        }
        el.classList.add("is-hot");
        el.style.willChange = "transform";
        const px = (tx - rect.left) / rect.width - 0.5;
        const py = (ty - rect.top) / rect.height - 0.5;
        const currentX = parseFloat(el.style.getPropertyValue("--rx")) || 0;
        const currentY = parseFloat(el.style.getPropertyValue("--ry")) || 0;
        const nextY = currentY + (px * 10 - currentY) * 0.12;
        const nextX = currentX + (-py * 10 - currentX) * 0.12;
        el.style.setProperty("--rx", `${nextX.toFixed(3)}deg`);
        el.style.setProperty("--ry", `${nextY.toFixed(3)}deg`);
        el.style.setProperty("--lift", "-6px");
        el.style.setProperty("--sx", `${tx - rect.left}px`);
        el.style.setProperty("--sy", `${ty - rect.top}px`);
        el.style.setProperty("--shift-x", `${(-px * 16).toFixed(2)}px`);
        el.style.setProperty("--shift-y", `${(-py * 16).toFixed(2)}px`);
      });
    }

    function heroLight() {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const lx = tx - rect.left;
      const ly = ty - rect.top;
      hero.style.setProperty("--hx", `${lx}px`);
      hero.style.setProperty("--hy", `${ly}px`);
      const ox = Math.max(-12, Math.min(12, (rect.width / 2 - lx) / (rect.width / 2) * 12));
      const oy = Math.max(-12, Math.min(12, (rect.height / 2 - ly) / (rect.height / 2) * 12));
      hero.style.setProperty("--parallax-x", `${ox.toFixed(2)}px`);
      hero.style.setProperty("--parallax-y", `${oy.toFixed(2)}px`);
    }

    function frame() {
      running = true;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--ptr-x", `${cx.toFixed(1)}px`);
      root.style.setProperty("--ptr-y", `${cy.toFixed(1)}px`);
      heroLight();
      magnets();
      tilt();
      if (Math.hypot(tx - cx, ty - cy) > 0.4) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    function kick() {
      if (!visible) return;
      if (!running) raf = requestAnimationFrame(frame);
      window.clearTimeout(still);
      still = window.setTimeout(() => {
        running = false;
        cancelAnimationFrame(raf);
      }, 2000);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType && event.pointerType !== "mouse") return;
      tx = event.clientX;
      ty = event.clientY;
      kick();
    }
    function onVisibility() {
      visible = document.visibilityState === "visible";
      if (!visible) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      window.clearTimeout(still);
    };
  }, []);

  return (
    <>
      <div id="site-live" className="sr-only" aria-live="polite" aria-atomic="true" />
      {toast ? (
        <div className="site-toast badge-pop" role="status">
          {toast}
        </div>
      ) : null}
    </>
  );
}

function pointerNear(rect: DOMRect, x: number, y: number, radius: number) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  let dx = 0;
  let dy = 0;
  if (x < rect.left) dx = x - rect.left;
  else if (x > rect.right) dx = x - rect.right;
  if (y < rect.top) dy = y - rect.top;
  else if (y > rect.bottom) dy = y - rect.bottom;
  const outside = Math.hypot(dx, dy);
  if (dx !== 0 || dy !== 0) {
    if (outside > radius) return null;
    const pull = 1 - outside / radius;
    return { x: (dx / outside) * pull, y: (dy / outside) * pull };
  }
  return {
    x: ((x - cx) / (rect.width / 2)) * 0.65,
    y: ((y - cy) / (rect.height / 2)) * 0.65,
  };
}
