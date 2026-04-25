import React from "react";
import clsx from "clsx";

/**
 * Crisp, retina-friendly SVG noise overlay.
 * Replaces the old raster grain.jpg.
 */
export function NoiseLayer({ className, opacity = 0.035 }: { className?: string; opacity?: number }) {
  return (
    <svg
      aria-hidden
      className={clsx("pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay", className)}
      style={{ opacity }}
    >
      <filter id="noise-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise-filter)" />
    </svg>
  );
}
