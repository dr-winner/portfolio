/* Preview app glyph, the CV as an identity document: a badge circle plus
   quiet summary lines, badge in accent. */

import { Glyph } from "./Glyph";

export function PreviewIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <path d="M4.5 3.5 H19.5 V20.5 H4.5 Z" />
      <circle cx="9" cy="9" r="2.2" stroke="var(--wos-accent, currentColor)" />
      <path d="M13.5 7.5 H16.8" />
      <path d="M13.5 10.5 H16" />
      <path d="M7 14.5 H17" />
      <path d="M7 17.5 H13.5" />
    </Glyph>
  );
}
