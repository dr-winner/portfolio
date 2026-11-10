/* Proxy app glyph per brief 6.7: two opposing arrows with a teal dot placed
   between them, the traffic moves both ways around the proxy. */

import { Glyph, AccentDot } from "./Glyph";

export function ProxyIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      {/* Outbound arrow, pointing up */}
      <path d="M8.5 16 V8.5" />
      <path d="M5.5 11.5 L8.5 8.5 L11.5 11.5" />
      {/* Inbound arrow, pointing down */}
      <path d="M15.5 8 V15.5" />
      <path d="M12.5 12.5 L15.5 15.5 L18.5 12.5" />
      <AccentDot cx={12} cy={12} r={1.6} />
    </Glyph>
  );
}
