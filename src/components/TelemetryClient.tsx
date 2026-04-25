"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackPageviewOncePerSession } from "@/lib/telemetry.client";

export function TelemetryClient() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    trackPageviewOncePerSession(pathname);
  }, [pathname]);

  return null;
}
