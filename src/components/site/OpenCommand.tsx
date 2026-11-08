"use client";

export function OpenCommand({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("open-command"))}>
      {children}
    </button>
  );
}
