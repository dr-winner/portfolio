/* Search glyph for the menu bar right side and the command palette trigger. */

import { Glyph } from "./Glyph";

export function SearchIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5 L21 21" />
    </Glyph>
  );
}
