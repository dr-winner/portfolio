/* winnerOS icon set barrel, brief 7.3: one file per icon plus this map.
   The registry keys app ids from src/os/types.ts to their tile glyph so the
   dock, desktop icons, windows and the mobile grid all share one source. */

import type { AppId } from "../types";
import { WelcomeIcon } from "./welcome";
import { FilesIcon } from "./files";
import { DocIcon } from "./doc";
import { TerminalIcon } from "./terminal";
import { ProxyIcon } from "./proxy";
import { AgentLabIcon } from "./agent-lab";
import { FindingsIcon } from "./findings";
import { DetectionsIcon } from "./detections";
import { AboutIcon } from "./about";
import { MailIcon } from "./mail";
import { PreviewIcon } from "./preview";
import { SettingsIcon } from "./settings";
import { SecurityIcon } from "./security";

export const appIcons: Record<AppId, (props: import("./Glyph").GlyphProps) => React.JSX.Element> = {
  welcome: WelcomeIcon,
  files: FilesIcon,
  doc: DocIcon,
  terminal: TerminalIcon,
  proxy: ProxyIcon,
  "agent-lab": AgentLabIcon,
  findings: FindingsIcon,
  detections: DetectionsIcon,
  about: AboutIcon,
  mail: MailIcon,
  preview: PreviewIcon,
  settings: SettingsIcon,
  security: SecurityIcon,
};

export { MarkIcon } from "./Mark";
export { ShieldIcon } from "./Shield";
export { SearchIcon } from "./Search";
export { ControlIcon } from "./Control";
export { CloseGlyph } from "./Close";
export { MinimizeGlyph } from "./Minimize";
export { MaximizeGlyph } from "./Maximize";
export { FolderIcon } from "./Folder";
