"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CommandPalette = dynamic(
  () => import("@/components/site/CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false },
);

export function CommandHotkey() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function openPalette() {
      setMounted(true);
      setOpen(true);
    }
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMounted(true);
        setOpen((value) => !value);
        return;
      }
      if (!typing && event.key === "/" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        openPalette();
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", openPalette);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command", openPalette);
    };
  }, []);

  if (!mounted) return null;
  return <CommandPalette open={open} onClose={() => setOpen(false)} />;
}
