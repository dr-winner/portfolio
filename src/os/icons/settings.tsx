/* Settings app glyph, three vertical sliders with round knobs, one knob
   filled accent to read as the active control. */

import { Glyph } from "./Glyph";

export function SettingsIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M6.5 4 V20" />
      <path d="M12 4 V20" />
      <path d="M17.5 4 V20" />
      <circle cx="6.5" cy="9" r="2" />
      <circle cx="12" cy="14.5" r="2" fill="var(--wos-accent)" />
      <circle cx="17.5" cy="7" r="2" />
    </Glyph>
  );
}
