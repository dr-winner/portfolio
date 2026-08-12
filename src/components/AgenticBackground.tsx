/**
 * Static ambient backdrop. Hero and section components provide the intentional
 * motion; keeping the page-wide layer static avoids a permanent full-screen
 * canvas render loop and preserves battery/GPU budget on mobile devices.
 */
export function AgenticBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-ink"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(60,207,255,0.09),transparent_34%),radial-gradient(circle_at_88%_28%,rgba(255,174,0,0.055),transparent_30%),linear-gradient(to_bottom,rgba(240,249,255,0.5),transparent_45%,rgba(226,232,240,0.55))] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(60,207,255,0.08),transparent_34%),radial-gradient(circle_at_88%_28%,rgba(255,174,0,0.045),transparent_30%),linear-gradient(to_bottom,rgba(5,7,13,0.15),transparent_45%,rgba(5,7,13,0.72))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(234,243,252,0.62)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,7,13,0.5)_100%)]" />
    </div>
  );
}
