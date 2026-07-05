"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 right-0 top-[env(safe-area-inset-top,0px)] z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-cyber-300 via-cyber-400 to-signal-300 shadow-glow-sm transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
