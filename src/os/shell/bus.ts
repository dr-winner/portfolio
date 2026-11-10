/* Shell intent bus: the static chrome (menu bar, dock, icons) and the
   interactive shell exchange intents over window CustomEvents so they stay
   decoupled while the chrome is still server rendered HTML with real
   links. The interactive shell listens; when it is not loaded yet the
   fallback is simply that the anchor still navigates. */

export type ShellIntent =
  | { type: "search:open" }
  | { type: "menus:close" }
  | { type: "menu:open"; menu: string }
  | { type: "toggles:open" }
  | { type: "app:open"; app: string; slug?: string }
  | { type: "restart" };

export function emitIntent(intent: ShellIntent) {
  window.dispatchEvent(new CustomEvent("wos:intent", { detail: intent }));
}

export function onIntent(handler: (intent: ShellIntent) => void): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent).detail as ShellIntent);
  };
  window.addEventListener("wos:intent", listener);
  return () => window.removeEventListener("wos:intent", listener);
}
