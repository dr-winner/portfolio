/* Files app glyph, the original folder shape with a small accent dot nestled
   in the step under the tab. */

import { Glyph, AccentDot } from "./Glyph";
import { FolderShape } from "./Folder";

export function FilesIcon(props: import("./Glyph").GlyphProps) {
  return (
    <Glyph {...props}>
      <FolderShape />
      <AccentDot cx={20} cy={16.5} r={1.5} />
    </Glyph>
  );
}
