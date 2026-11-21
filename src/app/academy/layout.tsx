import type { Metadata } from "next";
import "./academy-theme.css";

export const metadata: Metadata = {
  title: "Security Design · Interactive System Security & AI Architecture",
  description:
    "An interactive, step-by-step visual system security course. Trace how attacks travel through trust boundaries, from networks to AppSec and AI/LLM agent defense.",
  alternates: { canonical: "/academy" },
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#f5efe6",
        color: "#26201b",
        colorScheme: "light",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        isolation: "isolate",
      }}
      className="antialiased selection:bg-[#c5e8b7] selection:text-[#1b4332]"
    >
      {children}
    </div>
  );
}
