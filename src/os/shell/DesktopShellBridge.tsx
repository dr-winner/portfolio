"use client";

/* Bridge between the server rendered DesktopFrame and the interactive
   DesktopShell. next/dynamic with ssr false is not allowed inside a
   server component, so this thin client component owns the split: the
   shell ships as its own chunk, loads after hydration and paints null
   until then, brief 7.1. */

import dynamic from "next/dynamic";

const DesktopShell = dynamic(() => import("./DesktopShell").then((mod) => mod.DesktopShell), {
  ssr: false,
  loading: () => null,
});

export function DesktopShellBridge() {
  return <DesktopShell />;
}
