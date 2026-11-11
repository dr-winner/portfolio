/* Keyboard module, brief 3.8. Installed once by the interactive shell.
   The browsers own Cmd W, Ctrl W, Cmd Tab and Alt Tab, so the OS never
   relies on them: Alt W closes, Alt M minimizes, Alt Up toggles maximize,
   Alt Left/Right snap, Alt Down minimizes, Alt plus backtick opens the
   switcher with Shift going back, F6 cycles the four regions, Esc closes
   menus, search and the switcher but never a window, Cmd/Ctrl K and the
   bare / key open search. Ctrl Alt T is reserved for Terminal in phase 2. */

import { wmStore, dispatchWm } from "./store";

export type Region = "menubar" | "windows" | "dock" | "icons";
export const REGION_ORDER: Region[] = ["menubar", "windows", "dock", "icons"];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export interface ShellShortcuts {
  openSearch(): void;
  closeSearch(): void;
  searchOpen(): boolean;
  openSwitcher(backward: boolean): void;
  cycleSwitcher(backward: boolean): void;
  acceptSwitcher(): void;
  closeSwitcher(): void;
  switcherOpen(): boolean;
  closeMenus(): void;
  menusOpen(): boolean;
}

/* Wire the global listeners once the shell mounts. Returns the cleanup. */
export function installKeyboard(shell: ShellShortcuts): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    const { altKey, key, metaKey, ctrlKey } = event;

    /* Search, brief 3.8: Cmd K or Ctrl K anywhere, and the bare / when no
       input is focused. */
    if ((metaKey || ctrlKey) && !altKey && key.toLowerCase() === "k") {
      event.preventDefault();
      shell.openSearch();
      return;
    }
    if (key === "/" && !altKey && !metaKey && !ctrlKey && !isTypingTarget(event.target)) {
      event.preventDefault();
      shell.openSearch();
      return;
    }

    /* While the switcher is open: Alt plus backtick cycles, Shift runs it
       back, Alt release picks the current one in keyup. */
    if (shell.switcherOpen()) {
      if (key === "Escape") {
        event.preventDefault();
        shell.closeSwitcher();
        return;
      }
      if (altKey && (key === "`" || key === "~")) {
        event.preventDefault();
        shell.cycleSwitcher(event.shiftKey);
      }
      return;
    }

    if (key === "Escape") {
      if (shell.searchOpen()) {
        event.preventDefault();
        shell.closeSearch();
        return;
      }
      if (shell.menusOpen()) {
        event.preventDefault();
        shell.closeMenus();
        return;
      }
      return;
    }

    if (altKey && (key === "`" || key === "~")) {
      event.preventDefault();
      shell.openSwitcher(event.shiftKey);
      return;
    }

    if (key === "F6") {
      event.preventDefault();
      cycleRegions();
      return;
    }

    const state = wmStore.getState();
    const focused = state.focused ? state.windows[state.focused] : null;
    if (!altKey || ctrlKey || metaKey || !focused) return;

    switch (key) {
      case "w":
      case "W":
        event.preventDefault();
        dispatchWm({ type: "close", payload: { id: focused.id } });
        break;
      case "m":
      case "M":
        event.preventDefault();
        dispatchWm({ type: "minimize", payload: { id: focused.id } });
        break;
      case "ArrowLeft":
        event.preventDefault();
        dispatchWm({ type: "snap", payload: { id: focused.id, side: "left" } });
        break;
      case "ArrowRight":
        event.preventDefault();
        dispatchWm({ type: "snap", payload: { id: focused.id, side: "right" } });
        break;
      case "ArrowUp":
        event.preventDefault();
        dispatchWm({ type: "toggleMaximize", payload: { id: focused.id } });
        break;
      case "ArrowDown":
        event.preventDefault();
        dispatchWm({ type: "minimize", payload: { id: focused.id } });
        break;
      default:
        break;
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    /* Release Alt to choose the highlighted window, brief 3.8. */
    if (event.key === "Alt" && shell.switcherOpen()) {
      event.preventDefault();
      shell.acceptSwitcher();
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}

/* F6 moves focus between the four regions, brief 3.8. Regions mark
   themselves with data-wos-region and hold a data-wos-region-focus root
   to land keyboard focus on, either on the region element itself or on a
   descendant. */
export function cycleRegions(): void {
  const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const el = active?.closest<HTMLElement>("[data-wos-region]") ?? null;
  const name = (el?.dataset.wosRegion ?? "") as Region | "";
  const next = name && REGION_ORDER.includes(name) ? REGION_ORDER[(REGION_ORDER.indexOf(name) + 1) % REGION_ORDER.length] : REGION_ORDER[0];
  const region = document.querySelector<HTMLElement>(`[data-wos-region="${next}"]`);
  if (!region) return;
  const target = region.matches("[data-wos-region-focus]") ? region : region.querySelector<HTMLElement>("[data-wos-region-focus]");
  target?.focus();
}
