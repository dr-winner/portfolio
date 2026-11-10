/* Security app glyph, the shield outline with a check stroke inside. The
   check is the accent detail, controls that held. */

import { Glyph } from "./Glyph";

export function SecurityIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M12 2.5 C15 3.8 17.5 4.6 19.5 5 V10.2 C19.5 15.4 16.4 19.4 12 21.5 C7.6 19.4 4.5 15.4 4.5 10.2 V5 C6.5 4.6 9 3.8 12 2.5 Z" />
      <path d="M8.75 11.5 L11.25 14 L15.5 9.75" stroke="var(--wos-accent, currentColor)" />
    </Glyph>
  );
}
