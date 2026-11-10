/* Findings app glyph per brief 6.7: a document with a severity bar strip.
   The accent detail is the first severity bar reading critical high. */

import { Glyph } from "./Glyph";

export function FindingsIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M6 3 H13.8 L18 7.2 V21 H6 Z" />
      <path d="M13.8 3 V7.2 H18" />
      {/* Severity strip: critical high, then quiet tally lines */}
      <path d="M8.75 12 H15.25" stroke="var(--wos-critical, currentColor)" />
      <path d="M8.75 15 H13" />
      <path d="M8.75 18 H11" />
    </Glyph>
  );
}
