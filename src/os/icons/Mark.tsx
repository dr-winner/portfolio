/* The winnerOS mark, brief section 2: an original geometric glyph, a shield
   outline built from two offset strokes where the inner stroke also reads as
   a lowercase w. It does not resemble any OS or distro logo. Renders as one
   accent stroke and one currentColor stroke so the accent detail of the
   Welcome tile is the w itself. */

import { Glyph } from "./Glyph";

export function MarkIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      {/* Shield outline, drawn once */}
      <path d="M12 2.5 C15 3.8 17.5 4.6 19.5 5 V10.2 C19.5 15.4 16.4 19.4 12 21.5 C7.6 19.4 4.5 15.4 4.5 10.2 V5 C6.5 4.6 9 3.8 12 2.5 Z" stroke="currentColor" />
      {/* Lowercase w stroke, offset inside the shield, one accent detail */}
      <path d="M7.5 9.5 L10 14.5 L12 11 L14 14.5 L16.5 9.5" stroke="var(--wos-accent, currentColor)" />
    </Glyph>
  );
}
