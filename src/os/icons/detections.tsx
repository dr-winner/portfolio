/* Detections app glyph per brief 6.7: a radar arc with one teal blip and a
   sweep line leaving the centre. */

import { Glyph, AccentDot } from "./Glyph";

export function DetectionsIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      {/* Radar dish arc, opening downward */}
      <path d="M4 14 A8.5 8.5 0 0 1 20 14" />
      <path d="M7 14 A5 5 0 0 1 17 14" opacity="0.6" />
      {/* Sweep line out of the centre */}
      <path d="M12 14 L16.5 8" />
      {/* Ground line the dish rests on */}
      <path d="M4 17 L20 17" />
      <AccentDot cx={16.5} cy={8} r={1.6} />
    </Glyph>
  );
}
