"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { LENIS_CONFIG } from "@/config/motion.config";

/* ─── Public interface ────────────────────────────────────────────────────── */

export interface LenisInstance {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: Record<string, unknown>,
  ) => void;
  destroy: () => void;
  raf: (time: number) => void;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
}

/* ─── Context ─────────────────────────────────────────────────────────────── */

const SmoothScrollCtx = createContext<LenisInstance | null>(null);

/** Returns the live Lenis instance, or null if not yet initialised / reduced-motion. */
export function useLenis(): LenisInstance | null {
  return useContext(SmoothScrollCtx);
}

/* ─── Provider ────────────────────────────────────────────────────────────── */

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // State (not ref) so consumers re-render once Lenis is ready.
  const [lenis, setLenis] = useState<LenisInstance | null>(null);

  // Keep a ref for the cleanup closure — avoids stale state reference.
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    // Respect OS-level reduced-motion preference — no Lenis, no ticker.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapInstance: any;
    let tickerFn: ((time: number) => void) | undefined;
    let mounted = true;

    (async () => {
      // Lazy-load both libraries to keep them out of the initial bundle.
      const LenisModule = await import("lenis");
      const LenisClass = LenisModule.default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      if (!mounted) return;

      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsap;

      const instance = new LenisClass(LENIS_CONFIG) as unknown as LenisInstance;

      lenisRef.current = instance;
      setLenis(instance);

      // Keep ScrollTrigger scrub positions in sync with Lenis scroll position.
      instance.on(
        "scroll",
        ScrollTrigger.update as (...args: unknown[]) => void,
      );

      // Drive Lenis through the GSAP ticker for frame-perfect synchronisation.
      // GSAP passes elapsed time in seconds; Lenis.raf() expects milliseconds.
      tickerFn = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      mounted = false;
      lenisRef.current?.destroy();
      lenisRef.current = null;
      if (tickerFn) gsapInstance?.ticker.remove(tickerFn);
    };
  }, []);

  return (
    <SmoothScrollCtx.Provider value={lenis}>
      {children}
    </SmoothScrollCtx.Provider>
  );
}
