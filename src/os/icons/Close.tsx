/* Close control glyph, 12px grid with a 1.5px stroke, brief 6.6. */

import { CapGlyph } from "./Glyph";

export function CloseGlyph(props: import("./Glyph").GlyphProps) {
  return (
    <CapGlyph {...props}>
      <path d="M3.5 3.5 L8.5 8.5" />
      <path d="M8.5 3.5 L3.5 8.5" />
    </CapGlyph>
  );
}
