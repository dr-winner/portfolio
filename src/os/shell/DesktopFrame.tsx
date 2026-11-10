/* Desktop frame shell, brief 7.1 and 730: server rendered wallpaper, menu
   bar, dock and desktop icons as static HTML with real links, plus the
   route's content inside the stage. The stage is the F6 windows region
   until real window shells land with the interactive shell. The boot
   sequence catches this chrome behind the overlay from phase 8 on. */

import { Wallpaper, type WallpaperName } from "./Wallpaper";
import { SkipLink } from "./SkipLink";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { DesktopIcons } from "./DesktopIcons";
import { Boot } from "./Boot";
import "../os.css";

export function DesktopFrame({
  theme = "dark",
  accent = "teal",
  wallpaper = "navy-light",
  classicHref,
  boot = false,
  children,
}: {
  theme?: "dark" | "daylight";
  accent?: "teal" | "blue" | "graphite";
  wallpaper?: WallpaperName;
  classicHref: string;
  /** Boot plays for the / route only, brief 2.1. */
  boot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="wos-desktop relative min-h-screen text-[var(--wos-text)]"
      data-wos-theme={theme}
      data-wos-accent={accent}
    >
      <Wallpaper name={wallpaper} />
      <SkipLink variant="to-classic" href={classicHref} />
      {boot ? <Boot /> : null}
      <noscript>
        <p className="wos-noscript">
          winnerOS needs JavaScript.{" "}
          <a href={classicHref}>The classic view works without it.</a>
        </p>
      </noscript>
      <MenuBar />
      <div
        className="wos-stage absolute inset-0"
        data-wos-region="windows"
        tabIndex={-1}
        data-wos-region-focus
      >
        {children}
      </div>
      <DesktopIcons />
      <Dock />
    </div>
  );
}
