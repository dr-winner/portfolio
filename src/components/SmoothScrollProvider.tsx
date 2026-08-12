"use client";

import { useEffect, createContext, useContext, useState } from "react";

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
  const [lenisInstance, setLenisInstance] = useState<LenisInstance | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active = true;
    let lenis: LenisInstance | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapInstance: any;
    let tickerFn: ((time: number) => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (!active) return;

      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsap;

      const createdLenis = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }) as unknown as LenisInstance;
      lenis = createdLenis;

      setLenisInstance(createdLenis);

      // Keep ScrollTrigger in sync with Lenis scroll position
      createdLenis.on("scroll", ScrollTrigger.update as (...args: unknown[]) => void);

      // Drive Lenis via GSAP ticker for frame-perfect sync
      tickerFn = (time: number) => createdLenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      active = false;
      if (tickerFn) gsapInstance?.ticker.remove(tickerFn);
      lenis?.destroy();
    };
  }, []);

  return (
    <SmoothScrollCtx.Provider value={{ lenis: lenisInstance }}>
      {children}
    </SmoothScrollCtx.Provider>
  );
}
