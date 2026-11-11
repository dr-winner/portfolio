"use client";

/* The hint keyboard chip, brief 2.3: Ctrl K everywhere, Cmd K on Mac,
   detected from navigator.userAgentData?.platform with navigator.platform
   as the fallback. The server renders the Ctrl K text and this upgrades
   after mount, so there is no hydration mismatch and no layout shift
   (both strings fit one line at 12px mono). */

import { useEffect, useState } from "react";

export function PlatformHint() {
  const [mac, setMac] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = nav.userAgentData?.platform ?? navigator.platform ?? "";
    setMac(/mac/i.test(platform));
  }, []);
  return (
    <>
      Press{" "}
      <kbd className="wos-kbd">{mac ? "⌘K" : "Ctrl K"}</kbd> to search.
    </>
  );
}
