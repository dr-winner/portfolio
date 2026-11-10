"use client";

/* Toasts, brief 3.2 and 3.11: transient messages from the window manager
   (the 10 window cap, Terminal limits). Glass pill above the dock on the
   toast layer, auto dismissed. Reduced motion keeps the end state with a
   short fade. */

import { useEffect, useState } from "react";
import { useWm, dispatchWm } from "../wm/store";

const TOAST_MS = 2400;

export function Toasts() {
  const toast = useWm((s) => s.toast);
  const [text, setText] = useState<string | null>(null);

  /* Keep the last text across the visual clear so the pill can fade out
     without content swapping mid fade. */
  useEffect(() => {
    if (toast) setText(toast);
  }, [toast]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => dispatchWm({ type: "clearToast" }), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visible = Boolean(toast);
  return (
    <div className="wos-toasts" role="status" aria-live="polite" data-wos-region="toasts">
      {text ? (
        <p className="wos-toast" data-visible={visible ? "true" : "false"} key={text}>
          {text}
        </p>
      ) : null}
    </div>
  );
}
