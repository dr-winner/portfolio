"use client";

import React, { useState, useEffect, useRef } from "react";
import { VirtualTerminal, DeviceContext, MissionState } from "./terminalEngine";
import { sfx } from "./audio";

interface TerminalModalProps {
  device: DeviceContext;
  missionState: MissionState;
  onMissionStateChange: (state: MissionState) => void;
  onClose: () => void;
}

export function TerminalModal({
  device,
  missionState,
  onMissionStateChange,
  onClose,
}: TerminalModalProps) {
  const [terminal, setTerminal] = useState<VirtualTerminal | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [, setRenderTrigger] = useState(0);
  const [isMuted, setIsMuted] = useState(sfx.muted);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = new VirtualTerminal(device, missionState, (newState) => {
      onMissionStateChange(newState);
      sfx.successChime();
      setRenderTrigger((c) => c + 1);
    });
    setTerminal(term);
    sfx.terminalBeep(720);
  }, [device, missionState, onMissionStateChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminal?.lines.length]);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminal || !inputVal.trim()) return;
    sfx.keyClick();
    terminal.execute(inputVal);
    setInputVal("");
    setRenderTrigger((c) => c + 1);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sfx.keyClick();
    if (!terminal) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (terminal.historyIndex > 0) {
        terminal.historyIndex--;
        setInputVal(terminal.history[terminal.historyIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (terminal.historyIndex < terminal.history.length - 1) {
        terminal.historyIndex++;
        setInputVal(terminal.history[terminal.historyIndex] || "");
      } else {
        terminal.historyIndex = terminal.history.length;
        setInputVal("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const tokens = ["help", "status", "decode", "analyze", "firewall", "isolate", "zod-enforce", "ls", "cat", "grep", "netstat", "ps", "clear"];
      const match = tokens.find((t) => t.startsWith(inputVal.trim()));
      if (match) setInputVal(match);
    }
  };

  const handleQuickCommand = (cmd: string) => {
    if (!terminal) return;
    sfx.terminalBeep(880);
    terminal.execute(cmd);
    setRenderTrigger((c) => c + 1);
    inputRef.current?.focus();
  };

  const quickActions =
    device.id === "workstation"
      ? ["status", "ls /evidence", "cat /evidence/payload_b64.txt", "decode payload_b64.txt"]
      : device.id === "server"
        ? ["status", "grep SSRF /var/log/nginx/access.log", "netstat", "firewall drop 10.10.42.99"]
        : device.id === "iot"
          ? ["status", "ps", "cat /etc/config/wifi.conf", "isolate"]
          : ["status", "cat /app/agent_config.json", "zod-enforce", "clear"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[560px] max-h-[92vh] flex flex-col rounded-xl overflow-hidden border border-emerald-500/40 bg-[#0c1214] shadow-2xl shadow-emerald-950/50 font-mono text-sm">
        {/* CRT Scanline & Glow Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,rgba(0,0,0,0.45)_100%)] z-10" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-60" />

        {/* Modal Header */}
        <div className="relative z-20 flex items-center justify-between px-4 py-2.5 bg-[#080d0e] border-b border-emerald-900/60 select-none">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${device.status === "compromised" ? "bg-red-400" : device.status === "warning" ? "bg-amber-400" : "bg-emerald-400"}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${device.status === "compromised" ? "bg-red-500" : device.status === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-400 tracking-wide text-xs sm:text-sm">
                  {device.hostname}
                </span>
                <span className="text-[11px] text-emerald-600 border border-emerald-800/60 rounded px-1.5 py-0.2">
                  {device.ip}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400">{device.zone} · {device.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(sfx.toggleMute())}
              className="text-xs px-2 py-1 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-emerald-400 hover:border-emerald-700/50 transition-colors"
              title="Toggle SFX"
            >
              {isMuted ? "🔇 Muted" : "🔊 SFX On"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-red-400 hover:border-red-800/80 transition-colors"
              title="Close terminal (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Action Command Chips */}
        <div className="relative z-20 flex flex-wrap items-center gap-1.5 px-4 py-2 bg-[#0a1012] border-b border-emerald-950/60 text-xs overflow-x-auto select-none">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mr-1">
            Quick Actions:
          </span>
          {quickActions.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => handleQuickCommand(cmd)}
              className="px-2 py-0.5 rounded bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 hover:border-emerald-500/60 transition-all font-mono text-[11px]"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output Stream */}
        <div
          ref={scrollRef}
          className="relative z-20 flex-1 overflow-y-auto p-4 space-y-1.5 font-mono select-text scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-transparent"
        >
          {terminal?.lines.map((line, idx) => (
            <div
              key={idx}
              className={`leading-relaxed break-all ${
                line.type === "command"
                  ? "text-emerald-300 font-bold"
                  : line.type === "success"
                    ? "text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border-l-2 border-emerald-500"
                    : line.type === "error"
                      ? "text-rose-400 bg-rose-950/20 px-1.5 py-0.5 rounded border-l-2 border-rose-500"
                      : line.type === "warning"
                        ? "text-amber-300 bg-amber-950/20 px-1.5 py-0.5 rounded border-l-2 border-amber-500"
                        : line.type === "info"
                          ? "text-cyan-400"
                          : line.type === "system"
                            ? "text-zinc-500 text-[11px] uppercase tracking-wider"
                            : "text-zinc-300"
              }`}
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Command Line Input */}
        <form
          onSubmit={handleSubmit}
          className="relative z-20 flex items-center gap-2 p-3 bg-[#080d0e] border-t border-emerald-950"
        >
          <span className="text-emerald-500 font-bold select-none">
            {device.hostname}:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Type 'help' or command (Tab to autocomplete)..."
            className="flex-1 bg-transparent text-emerald-200 placeholder-emerald-900/70 focus:outline-none font-mono text-xs sm:text-sm"
            autoFocus
            spellCheck={false}
          />
          <button
            type="submit"
            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider transition-colors select-none"
          >
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}
