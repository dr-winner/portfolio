"use client";

import { useEffect, useState } from "react";
import { SiteMenu } from "@/components/site/SiteMenu";

export function CommandHotkey() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  return <SiteMenu onClose={() => setOpen(false)} />;
}
