"use client";

/* Window chrome, brief 6.6: a 40px title bar with the original control
   capsule on the left (close, minimize, maximize drawn as 1.5px stroke
   glyphs on 26x26 buttons, not coloured circles), the app icon and the
   centred title. Glyphs rest at text-3 on transparent and light up per
   control on hover. */

import { dispatchWm } from "../wm/store";
import { CloseGlyph, MinimizeGlyph, MaximizeGlyph, appIcons } from "../icons";
import type { AppId } from "../types";

export function WindowChrome({
  id,
  app,
  title,
  focused,
  onClose,
}: {
  id: string;
  app: AppId;
  title: string;
  focused: boolean;
  /** Apps can veto or render their own close flow (Terminal exit). */
  onClose?: (id: string) => boolean | void;
}) {
  const Icon = appIcons[app] ?? appIcons.files;
  const doClose = () => {
    if (onClose?.(id) !== false) dispatchWm({ type: "close", payload: { id } });
  };
  return (
    <div className="wos-titlebar" data-wos-titlebar>
      <span className="wos-title-edge" aria-hidden />
      <div className="wos-controls" data-wos-nodrag="true">
        <button
          type="button"
          className="wos-control wos-control-close"
          aria-label={`Close ${title}`}
          title={`Close ${title}`}
          onClick={doClose}
          tabIndex={focused ? 0 : -1}
        >
          <CloseGlyph />
        </button>
        <button
          type="button"
          className="wos-control"
          aria-label={`Minimize ${title}`}
          title={`Minimize ${title}`}
          onClick={() => dispatchWm({ type: "minimize", payload: { id } })}
          tabIndex={focused ? 0 : -1}
        >
          <MinimizeGlyph />
        </button>
        <button
          type="button"
          className="wos-control"
          aria-label={`Maximize ${title}`}
          title={`Maximize ${title}`}
          onClick={() => dispatchWm({ type: "toggleMaximize", payload: { id } })}
          tabIndex={focused ? 0 : -1}
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
  );
}
