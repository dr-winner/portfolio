"use client";

import { ThemeProvider } from "next-themes";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange nonce={nonce}>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </ThemeProvider>
  );
}
