"use client";

import { ThemeProvider } from "next-themes";

/**
 * Client-side provider shell.
 * SmoothScrollProvider is intentionally NOT nested here — it lives directly
 * in the root layout so CustomCursor and ScrollToTop can share the same
 * Lenis context without a second initialisation.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
