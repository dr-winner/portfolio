/* Control quick toggles glyph for the menu bar, a three slider motif drawn
   on the 24px grid with filled currentColor knobs. */

import { Glyph } from "./Glyph";

export function ControlIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4 7 H20" />
      <path d="M4 12 H20" />
      <path d="M4 17 H20" />
      <circle cx="9" cy="7" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17" r="1.9" fill="currentColor" stroke="none" />
    </Glyph>
  );
}
