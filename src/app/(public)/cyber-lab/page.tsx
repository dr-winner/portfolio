import type { Metadata } from "next";
import { TryHackMeRoomLayout } from "@/components/academy/lab3d/TryHackMeRoomLayout";

export const metadata: Metadata = {
  title: "Snow Trail · 3D Cyber Lab (TryHackMe Room)",
  description:
    "An authentic 1:1 duplicate of TryHackMe Snow Trail: split-screen room layout, Task 1 questions, first-person WASD pointer-lock movement, handheld smartphone assistant, and device containment.",
  alternates: { canonical: "/cyber-lab" },
};

export default function CyberLabPage() {
  return <TryHackMeRoomLayout />;
}
