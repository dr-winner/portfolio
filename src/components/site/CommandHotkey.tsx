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
    /* The header's Cmd K button toggles through this event so only one
       palette instance ever mounts, even though two components listen. */
    function onPaletteToggle() {
      setOpen((value) => !value);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:toggle", onPaletteToggle as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:toggle", onPaletteToggle as EventListener);
    };
  }, []);

  if (!open) return null;
  return <SiteMenu onClose={() => setOpen(false)} />;
}
