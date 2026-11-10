/* Terminal app glyph, a shell window with a prompt chevron in accent and a
   quiet cursor line. */

import { Glyph } from "./Glyph";

export function TerminalIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M3.5 5.5 H20.5 V18.5 H3.5 Z" />
      <path d="M7.5 9 L10.5 11.5 L7.5 14" stroke="var(--wos-accent, currentColor)" />
      <path d="M12.5 14 H16.5" />
    </Glyph>
  );
}
