/* Minimize control glyph: a single horizontal line, 12px grid. */

import { CapGlyph } from "./Glyph";

export function MinimizeGlyph(props: import("./Glyph").GlyphProps) {
  return (
    <CapGlyph {...props}>
      <path d="M2.75 6 H9.25" />
    </CapGlyph>
  );
}
