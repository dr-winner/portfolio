/* Folder glyph, an original shape: a pressed front face with an offset stop
   tab and an open step on the left edge, deliberately not any OS folder.
   The raw shape is exported too so app tiles can compose it into their own
   glyph without nesting svg elements. */

import { Glyph } from "./Glyph";

export function FolderShape(props: import("./Glyph").GlyphProps) {
  return (
    <g {...props}>
      {/* Back panel with the 2px stop tab */}
      <path d="M3 19 V6 C3 5.3 3.6 4.7 4.3 4.7 H8.7 C9.1 4.7 9.5 4.9 9.8 5.2 L11.3 6.9 C11.6 7.2 12 7.4 12.4 7.4 H19.7 C20.4 7.4 21 8 21 8.7 V19 C21 19.8 20.3 20.5 19.5 20.5 H4.5 C3.7 20.5 3 19.8 3 19 Z" />
      {/* Front face fold, offset from the tab edge */}
      <path d="M3 10.5 H21" opacity="0.55" />
    </g>
  );
}

export function FolderIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <FolderShape />
    </Glyph>
  );
}
