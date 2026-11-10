/* Welcome app glyph reuses the winnerOS mark, tinted toward the text colour
   with the accent w carrying the tile's one accent detail. */

import { MarkIcon } from "./Mark";

export function WelcomeIcon(props: import("./Glyph").GlyphProps) {
  return <MarkIcon {...props} />;
}