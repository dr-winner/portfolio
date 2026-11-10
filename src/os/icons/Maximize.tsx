/* Maximize control glyph: two corner brackets, 12px grid. */

import { CapGlyph } from "./Glyph";

export function MaximizeGlyph(props: import("./Glyph").GlyphProps) {
  return (
    <CapGlyph {...props}>
      <path d="M2.5 6.5 V2.5 H6.5" />
      <path d="M9.5 5.5 V9.5 H5.5" />
    </CapGlyph>
  );
}
