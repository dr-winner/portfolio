"use client";

/* Boot skipper, brief 2.1: any key, click or tap skips, plus the visible
   Skip button, which is focusable first after the skip link, so Tab stays
   out of the instant skip keys. Removes the overlay from the DOM once the
   CSS timeline has faded it (or immediately on skip), and completes the
   progress line early when the shell chunk is already loaded, brief 2.1
   timeline. No-op when the pre paint script decided the boot does not
   play. */

import { useEffect } from "react";

export function BootSkip() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.bootPlay !== "1") return undefined;
    const overlay = document.querySelector<HTMLElement>(".wos-boot");
    if (!overlay) return undefined;

    let removed = false;
    const remove = () => {
      if (removed || !overlay.isConnected) return;
      removed = true;
      overlay.remove();
    };

    /* The desktop chunk state, brief 2.1: fill the line when the shell is
       already here. Phase 9 sets data-wos-shell="1" when the shell chunk
       lands, which can be after this effect runs, so the attribute is
       observed too. */
    const complete = () => {
      const fill = overlay.querySelector<HTMLElement>(".wos-boot-line-fill");
      if (!fill) return;
      fill.style.animation = "none";
      fill.style.transition = "transform 300ms cubic-bezier(0.2, 0, 0, 1)";
      fill.style.transform = "scaleX(1)";
    };
    if (root.dataset.wosShell === "1") complete();
    const shellWatch = new MutationObserver(() => {
      if (root.dataset.wosShell === "1") {
        shellWatch.disconnect();
        complete();
      }
    });
    shellWatch.observe(root, { attributes: true, attributeFilter: ["data-wos-shell"] });

    const timer = window.setTimeout(remove, 2400);

    const skip = () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointer, true);
      button?.removeEventListener("click", skip);
      shellWatch.disconnect();
      root.setAttribute("data-booted", "1");
      remove();
    };
    /* Any key skips, brief 2.1, except Tab: the Skip button has to be
       focusable first after the skip link, so Tab at least once has to be
       able to move into the overlay without tearing it down. Enter and
       Space on the focused button click it; everything other key skips. */
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") return;
      skip();
    };
    const onPointer = () => skip();
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onPointer, true);
    const button = overlay.querySelector<HTMLElement>(".wos-boot-skip");
    button?.addEventListener("click", skip);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointer, true);
      button?.removeEventListener("click", skip);
      shellWatch.disconnect();
      remove();
    };
  }, []);

  return null;
}
