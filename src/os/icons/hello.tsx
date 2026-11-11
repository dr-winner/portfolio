/* Hello proof app glyph, Phase 1 only: a speech square with the one
   accent dot. Removed together with the app in Phase 2. */

import { AccentDot, Glyph } from "./Glyph";

export function HelloIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 5.5h16v11H10l-4.5 3.5v-3.5H4z" />
      <AccentDot cx={16.4} cy={9.4} r={1.4} />
    </Glyph>
  );
}
