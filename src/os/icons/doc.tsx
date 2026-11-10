/* Document app glyph, a folded page with text lines, the first line in
   accent as the tile's detail. */

import { Glyph } from "./Glyph";

export function DocIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M6 3 H13.8 L18 7.2 V21 H6 Z" />
      <path d="M13.8 3 V7.2 H18" />
      <path d="M9 13 H15" stroke="var(--wos-accent, currentColor)" />
      <path d="M9 16.5 H13.5" />
    </Glyph>
  );
}
