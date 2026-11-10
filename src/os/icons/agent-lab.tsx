/* Agent Lab app glyph per brief 6.7: a speech bubble with a small shield
   inside it. The mini shield is the accent detail. */

import { Glyph } from "./Glyph";

export function AgentLabIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      {/* Speech bubble with the tail folded into the bottom left */}
      <path d="M4.5 6 C4.5 5.2 5.2 4.5 6 4.5 H18 C18.8 4.5 19.5 5.2 19.5 6 V12.5 C19.5 13.3 18.8 14 18 14 H11.5 L8 18 V14 H6 C5.2 14 4.5 13.3 4.5 12.5 Z" />
      {/* Small shield inside the bubble, accent stroke */}
      <path d="M12 6.4 C13.1 6.9 14 7.2 14.7 7.4 V9.4 C14.7 11.1 13.6 12.4 12 13.1 C10.4 12.4 9.3 11.1 9.3 9.4 V7.4 C10 7.2 10.9 6.9 12 6.4 Z" stroke="var(--wos-accent, currentColor)" />
    </Glyph>
  );
}
