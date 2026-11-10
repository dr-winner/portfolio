/**
 * Fixed ambient backdrop: near-flat navy with one very soft teal light.
 * Nothing moves behind the text; pure CSS, painted once, zero script.
 */
export function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Very soft signal light, upper right, at about five percent */}
      <div
        className="absolute -top-[10%] right-[-6%] h-[55vh] w-[48vw] rounded-full"
        style={{
          background: "radial-gradient(closest-side, var(--glow-signal), transparent 76%)",
          filter: "blur(24px)",
        }}
      />
    </div>
  );
}
