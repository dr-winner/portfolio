"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const heading = document.querySelector("h1");
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      setLabel(`Navigated to ${heading.textContent ?? "page"}`);
    }
  }, [pathname]);

  return (
    <p className="sr-only" aria-live="polite">
      {label}
    </p>
  );
}
