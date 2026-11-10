/* Mail app glyph, an envelope whose flap fold is the accent detail. */

import { Glyph } from "./Glyph";

export function MailIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 6.5 H20.5 V17.5 H3.5 Z" />
      <path d="M3.5 7.5 L12 13 L20.5 7.5" stroke="var(--wos-accent, currentColor)" />
    </Glyph>
  );
}
