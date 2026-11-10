/* winnerOS motion presets. The numbers mirror brief section 6.10 exactly and
   are plain data so server files and client components can both import the
   module without pulling the animation runtime in. */

/** Spring presets. Use one of these, never inline a spring anywhere else. */
export const springs = {
  snappy: { type: "spring", stiffness: 520, damping: 38, mass: 0.8 },
  window: { type: "spring", stiffness: 420, damping: 34, mass: 0.9 },
  dock: { type: "spring", stiffness: 500, damping: 32, mass: 0.6 },
  badge: { type: "spring", stiffness: 300, damping: 20, mass: 1 },
  sheet: { type: "spring", stiffness: 380, damping: 36, mass: 1 },
} as const;

export type SpringName = keyof typeof springs;

/** Shared easing curves as cubic bezier control points. */
export const ease = {
  micro: [0.2, 0, 0, 1],
  entrance: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
  bootDraw: [0.65, 0, 0.35, 1],
} as const;

/* Durations in seconds, the unit motion's JS API expects. CSS equivalents
   live as --wos-dur-* custom properties in src/os/os.css. */
export const dur = {
  micro: 0.12,
  /** Menus, tooltips and search. 140 to 200ms per the brief. */
  uiMin: 0.14,
  uiMax: 0.2,
  entranceMin: 0.32,
  entranceMax: 0.5,
  /** Menu open: 120ms opacity plus a 4px translate. */
  menu: 0.12,
  /** Minimize to dock: 380ms cubic-bezier(0.32, 0.72, 0, 1). Brief 3.4. */
  minimize: 0.38,
  /** Restore plays the minimize in reverse over 320ms. */
  restore: 0.32,
  /** Close: scale down and fade over 160ms, then unmount. */
  close: 0.16,
  /** Stagger between siblings, capped at 8 staggered items. */
  stagger: 0.04,
  /** App switcher appears in 120ms. */
  switcher: 0.12,
} as const;

/** Exits run at 70 percent of the matching entrance duration. */
export function exitOf(entranceSeconds: number): number {
  return Math.round(entranceSeconds * 0.7 * 1000) / 1000;
}
