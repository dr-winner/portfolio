/* Desktop frame shell v1, brief 7.1: server rendered wallpaper, the skip
   link, and a noscript notice for visitors without JavaScript. The menu
   bar, dock and window shells land in later commits; this frame already
   owns the desktop stage so everything mounts inside it. */

import { Wallpaper, type WallpaperName } from "./Wallpaper";
import { SkipLink } from "./SkipLink";
import "../os.css";

export function DesktopFrame({
  theme = "dark",
  accent = "teal",
  wallpaper = "navy-light",
  classicHref,
  children,
}: {
  theme?: "dark" | "daylight";
  accent?: "teal" | "blue" | "graphite";
  wallpaper?: WallpaperName;
  classicHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="wos-desktop relative min-h-screen text-[var(--wos-text)]" data-wos-theme={theme} data-wos-accent={accent}>
      <Wallpaper name={wallpaper} />
      <SkipLink variant="to-classic" href={classicHref} />
      <noscript>
        <p className="wos-noscript">
          winnerOS needs JavaScript.{" "}
          <a href={classicHref}>The classic view works without it.</a>
        </p>
      </noscript>
      <div className="wos-stage absolute inset-0">{children}</div>
    </div>
  );
}
