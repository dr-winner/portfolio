"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { TelemetryClient } from "@/components/TelemetryClient";

const TerminalDock = dynamic(
  () => import("@/components/TerminalDock").then((mod) => mod.TerminalDock),
  { ssr: false }
);

const OpenTerminalContext = createContext<(() => void) | null>(null);

export function useOpenShell() {
  const fn = useContext(OpenTerminalContext);
  return fn ?? (() => {});
}

export function ClientChrome({ children }: { children: ReactNode }) {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  return (
    <OpenTerminalContext.Provider value={openTerminal}>
      <TelemetryClient />
      <div className="min-w-0 max-w-full overflow-x-clip">{children}</div>
      {terminalOpen ? (
        <TerminalDock expanded onExpandedChangeAction={setTerminalOpen} />
      ) : null}
    </OpenTerminalContext.Provider>
  );
}
