"use client";

import { useEffect, createContext, useContext, useRef } from "react";

interface LenisInstance {
  raf: (time: number) => void;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  destroy: () => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollCtx = createContext<{ lenis: LenisInstance | null }>({
  lenis: null,
});

export function useLenis() {
  return useContext(SmoothScrollCtx).lenis;
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: LenisInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapInstance: any;
    // Store reference so ticker can be properly deregistered
    let tickerFn: ((time: number) => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsap;

      lenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }) as unknown as LenisInstance;

      lenisRef.current = lenis;

      // Keep ScrollTrigger in sync with Lenis scroll position
      lenis.on("scroll", ScrollTrigger.update as (...args: unknown[]) => void);

      // Drive Lenis via GSAP ticker for frame-perfect sync
      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      lenis?.destroy();
      if (tickerFn) gsapInstance?.ticker.remove(tickerFn);
    };
  }, []);

  return (
    <SmoothScrollCtx.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </SmoothScrollCtx.Provider>
  );
}
