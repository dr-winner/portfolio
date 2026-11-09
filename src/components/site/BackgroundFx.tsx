/**
 * Fixed ambient backdrop: blueprint grid, terminal dot matrix and two
 * low-frequency glows on dark. Pure CSS, zero script, painted once.
 */
export function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Blueprint grid, fading toward the bottom of the viewport */}
      <div
        className="absolute inset-0 fx-gridline"
        style={{
          ["--grid-size" as string]: "44px",
          maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 92%)",
          opacity: 0.5,
        }}
      />
      {/* Dot matrix on top of the grid for texture near the top */}
      <div
        className="absolute inset-0 fx-dots"
        style={{
          ["--dot-size" as string]: "22px",
          maskImage: "radial-gradient(120% 70% at 50% 0%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 70% at 50% 0%, black, transparent 78%)",
          opacity: 0.35,
        }}
      />
      {/* Signal glow — top right */}
      <div
        className="absolute -top-[20%] right-[-10%] h-[60vh] w-[55vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--glow-signal), transparent 78%)",
          filter: "blur(24px)",
        }}
      />
      {/* AI accent glow — bottom left */}
      <div
        className="absolute bottom-[-25%] left-[-12%] h-[55vh] w-[50vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--glow-ai), transparent 80%)",
          filter: "blur(28px)",
        }}
      />
    </div>
  );
}
