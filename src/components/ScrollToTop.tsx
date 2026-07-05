"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useLenis } from "@/components/SmoothScrollProvider";
import { EASE } from "@/config/motion.config";

/**
 * Scroll-to-top button that fades in once the user passes 1 viewport height.
 * Uses the Lenis smooth-scroll API when available, falling back to native scroll.
 * Entrance animation is suppressed under prefers-reduced-motion.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount in case the page loaded mid-scroll.
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: EASE.expoOut }}
          className="fixed bottom-8 right-6 z-50 md:bottom-10 md:right-8"
        >
          {/* Gradient border ring — 1.5 px inset via padding on a gradient wrapper */}
          <div className="rounded-full bg-gradient-to-br from-cyber-300 to-signal-300 p-[1.5px]">
            <button
              onClick={handleClick}
              aria-label="Scroll to top"
              className="flex size-11 items-center justify-center rounded-full bg-ink-100 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-300 focus-visible:ring-offset-1"
            >
              <ChevronUp className="size-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
