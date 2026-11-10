/* Shared SVG primitives for the winnerOS icon set, brief 6.7: every glyph
   is drawn inline for this project on a square grid with a 1.5px stroke,
   round caps and joins, painted with currentColor. One accent detail per
   app glyph rides on --wos-accent. No icon packs, no emoji, no stock art. */

import type { SVGProps } from "react";

export type GlyphProps = SVGProps<SVGSVGElement>;

/** Standard system glyph on the 24px grid. */
export function Glyph({ width = 24, height = 24, children, ...rest }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Title bar control glyphs sit on a tighter 12px grid so the 1.5px stroke
   stays 1.5px at their 12px render size, brief 6.6. */
export function CapGlyph({ width = 12, height = 12, children, ...rest }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={width}
      height={height}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** The one accent detail allowed per app glyph. A filled dot or short
   stroke painted with the accent token. */
export function AccentDot({ cx = 12, cy = 12, r = 1.6, ...rest }: SVGProps<SVGCircleElement>) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="var(--wos-accent)"
      stroke="none"
      aria-hidden="true"
      {...rest}
    />
  );
}
