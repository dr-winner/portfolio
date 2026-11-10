/* About app glyph, a focused person mark: head, shoulders and a small
   accent collar stroke. Reads as a profile card, not a generic user icon. */

import { Glyph } from "./Glyph";

export function AboutIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M9 7 A3 3 0 0 1 15 7 A3 3 0 0 1 9 7 Z" />
      <path d="M5.5 19 C6.2 15.6 8.8 13.5 12 13.5 C15.2 13.5 17.8 15.6 18.5 19" />
      <path d="M12 16.5 V19" stroke="var(--wos-accent, currentColor)" />
    </Glyph>
  );
}
