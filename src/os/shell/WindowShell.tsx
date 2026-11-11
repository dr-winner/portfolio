/* A static, server rendered window shell, brief 7.1 and fix 1 of the phase
   1 review: the route's content lives inside a real window on every OS
   view, so the desktop never shows a full scrolling page under the chrome.
   The markup mirrors Window.tsx and WindowChrome.tsx exactly so
   DesktopShell can adopt the element in place (it measures the geometry,
   writes it to the window manager store and binds drag, resize and the
   controls) without remounting anything and without layout shift.
   Without JavaScript the shell is still complete, readable content with
   real links. Positioning comes from os.css (.wos-window-static), keyed
   by window id. */

import { CloseGlyph, MinimizeGlyph, MaximizeGlyph, appIcons } from "../icons";
import type { AppId } from "../types";

export function WindowShell({
  id,
  app,
  title,
  children,
  bodyClassName,
}: {
  id: string;
  app: AppId;
  title: string;
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  const Icon = appIcons[app] ?? appIcons.files;
  return (
    <section
      data-wm-window={id}
      data-wm-mode="normal"
      data-state="focused"
      data-wos-app={app}
      data-wos-static="true"
      className="wos-window wos-window-static"
      style={{ zIndex: 50 }}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
    >
      <div className="wos-titlebar" data-wos-titlebar>
        <span className="wos-title-edge" aria-hidden />
        <div className="wos-controls" data-wos-nodrag="true">
          <button
            type="button"
            className="wos-control wos-control-close"
            data-wos-control="close"
            aria-label={`Close ${title}`}
            title={`Close ${title}`}
          >
            <CloseGlyph />
          </button>
          <button
            type="button"
            className="wos-control"
            data-wos-control="minimize"
            aria-label={`Minimize ${title}`}
            title={`Minimize ${title}`}
          >
            <MinimizeGlyph />
          </button>
          <button
            type="button"
            className="wos-control"
            data-wos-control="maximize"
            aria-label={`Maximize ${title}`}
            title={`Maximize ${title}`}
          >
            <MaximizeGlyph />
          </button>
        </div>
        <div className="wos-titleblock">
          <span className="wos-title-icon" aria-hidden>
            <Icon width={16} height={16} />
          </span>
          <h2 id={`${id}-title`} className="wos-window-title" tabIndex={-1}>
            {title}
          </h2>
        </div>
        <span className="wos-titlefill" aria-hidden />
      </div>
      <div className={["wos-window-body", bodyClassName].filter(Boolean).join(" ")}>{children}</div>
    </section>
  );
}
