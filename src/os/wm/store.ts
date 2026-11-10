/* Store wrapper for the window manager, brief 3.1. The reducer is pure;
   this file is the only place that mixes it with React. The store is the
   zustand vanilla store, subscribed with useSyncExternalStore, so neither
   a provider nor a context is ever needed. Selectors must return
   primitives or stable references (the state object is structurally
   shared every dispatch). */

import { createStore } from "zustand/vanilla";
import { useSyncExternalStore } from "react";
import { reduce, initialWmState, type WmAction, type WMState } from "./reducer.ts";

export const wmStore = createStore<WMState>(() => initialWmState());

export function dispatchWm(action: WmAction): void {
  wmStore.setState((prev) => reduce(prev, action));
}

/* Init when the shell boots and the real viewport is known. Persistence
   uses the same view once loaded. */
export function setWorkArea(workArea: WMState["workArea"]): void {
  dispatchWm({ type: "setWorkArea", payload: { workArea } });
}

export function useWm<T>(selector: (state: WMState) => T): T {
  return useSyncExternalStore(
    wmStore.subscribe,
    () => selector(wmStore.getState()),
    () => selector(initialWmState()),
  );
}

export type { WMState, WmAction } from "./reducer.ts";
