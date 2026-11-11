"use client";

import { useEffect, useState, type ComponentType } from "react";

type PaletteProps = { onClose: () => void };

export function CommandHotkey() {
  const [open, setOpen] = useState(false);
  const [Palette, setPalette] = useState<ComponentType<PaletteProps> | null>(null);

  useEffect(() => {
    let alive = true;
    function load() {
      return import("./CommandPalette").then((mod) => {
        if (alive) setPalette(() => mod.CommandPalette);
        return mod.CommandPalette;
      });
    }
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        void load().then(() => {
          if (alive) setOpen((value) => !value);
        });
      }
    }
    function onOpen() {
      void load().then(() => {
        if (alive) setOpen(true);
      });
    }
    function onPreload() {
      void load();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    window.addEventListener("palette:preload", onPreload);
    return () => {
      alive = false;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
      window.removeEventListener("palette:preload", onPreload);
    };
  }, []);

  if (!open || !Palette) return null;
  return <Palette onClose={() => setOpen(false)} />;
}
