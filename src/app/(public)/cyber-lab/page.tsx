import type { Metadata } from "next";
import Link from "next/link";
import { CyberLabScene } from "@/components/academy/lab3d/CyberLabScene";

export const metadata: Metadata = {
  title: "3D Cyber Lab · Interactive Incident Response Arena",
  description:
    "An interactive 3D WebGL cyber incident response room inspired by TryHackMe Snowtrail. Walk through compromised facility zones with WASD, triage physical terminals, and neutralize active threats.",
  alternates: { canonical: "/cyber-lab" },
};

export default function CyberLabPage() {
  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Tactical Mission Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>WAREVILLE DIVISION · LIVE INCIDENT RESPONSE SIMULATION</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            TBFC Facility Incident Response Arena
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Inspired by TryHackMe&apos;s 3D investigative labs (Snow Trail). Step in as the Incident Commander: explore the compromised rooms with WASD, approach physical hardware nodes to open diagnostic terminals, and neutralize the intruder&apos;s foothold.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/academy"
            className="px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/40 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
          >
            ← Return to Academy
          </Link>
        </div>
      </div>

      {/* 3D WebGL Scene Container */}
      <div className="w-full">
        <CyberLabScene />
      </div>

      {/* Field Intelligence & Reference Guide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 font-mono text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">ZONE 1: FORENSICS LAB</div>
          <div className="font-bold text-white">Forensic Workstation</div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            High-compute desktop suited for de-obfuscating Base64 reverse shell vectors and memory slice triaging.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 font-mono text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">ZONE 2: COLD AISLE</div>
          <div className="font-bold text-white">Core Auth Server</div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            High-availability server rack retaining nginx access syslogs, netfilter iptables rules, and IMDS metadata.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 font-mono text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">ZONE 3: EDGE LAB</div>
          <div className="font-bold text-white">Rogue IoT Appliance</div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Wi-Fi smart appliance beaconing to external attacker C2 on port 4444. Requires physical wireless isolation.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 font-mono text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">ZONE 4: COMMAND HUB</div>
          <div className="font-bold text-white">AI Agent Runner</div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Generative tool-calling runtime vulnerable to indirect prompt injection. Requires deterministic Zod AST schema gates.
          </p>
        </div>
      </div>
    </div>
  );
}
