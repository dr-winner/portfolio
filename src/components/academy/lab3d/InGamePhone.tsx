"use client";

import React from "react";
import { EmailMessage, CaseFileClue } from "./snowtrailData";
import { sfx } from "./audio";

interface InGamePhoneProps {
  isOpen: boolean;
  onClose: () => void;
  activeApp: "email" | "tasks" | "casefile";
  onChangeApp: (app: "email" | "tasks" | "casefile") => void;
  emails: EmailMessage[];
  activeEmailId: string | null;
  onSelectEmail: (id: string) => void;
  onDispatchTask: (email: EmailMessage) => void;
  clues: Record<string, CaseFileClue>;
  iotStatus: {
    thermostat: { name: string; isIoT: boolean; isDisconnected: boolean };
    printer: { name: string; isIoT: boolean; isDisconnected: boolean };
    speaker: { name: string; isIoT: boolean; isDisconnected: boolean };
    coffeeMaker: { name: string; isIoT: boolean; isDisconnected: boolean };
    wallClock: { name: string; isIoT: boolean; isDisconnected: boolean };
  };
}

export function InGamePhone({
  isOpen,
  onClose,
  activeApp,
  onChangeApp,
  emails,
  activeEmailId,
  onSelectEmail,
  onDispatchTask,
  clues,
  iotStatus,
}: InGamePhoneProps) {
  if (!isOpen) return null;

  const activeEmail = emails.find((e) => e.id === activeEmailId) || emails[0];
  const unreadCount = emails.filter((e) => !e.isRead).length;
  const cluesList = Object.values(clues);
  const solvedCluesCount = cluesList.filter((c) => c.solved).length;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end animate-in slide-in-from-bottom-8 duration-200 select-none font-mono">
      {/* Handheld Smartphone Housing */}
      <div className="relative w-[340px] h-[580px] bg-[#0c1214] border-[3px] border-[#253942] rounded-[36px] shadow-2xl shadow-black/80 flex flex-col overflow-hidden ring-1 ring-emerald-500/30">
        {/* Top Speaker Ear-piece & Dynamic Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#060a0c] rounded-full flex items-center justify-center gap-2 z-30">
          <div className="w-10 h-1 bg-[#1a2b33] rounded-full" />
          <div className="w-2 h-2 rounded-full bg-[#10222a] border border-cyan-800/40" />
        </div>

        {/* Status Bar */}
        <div className="relative z-20 pt-6 px-5 pb-2 flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800/60 bg-[#090f12]">
          <span className="font-bold text-emerald-400">03:45 AM</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-emerald-500">5G · 100%</span>
            <button
              type="button"
              onClick={onClose}
              className="ml-1 w-5 h-5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs"
              title="Close Phone (P or Right Click)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* App Navigation Header Tabs */}
        <div className="grid grid-cols-3 bg-[#0c161a] border-b border-emerald-950/80 p-1.5 text-xs text-center z-20">
          <button
            type="button"
            onClick={() => {
              sfx.keyClick();
              onChangeApp("email");
            }}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeApp === "email"
                ? "bg-emerald-600 text-black font-extrabold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>✉️ Inbox</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.keyClick();
              onChangeApp("tasks");
            }}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeApp === "tasks"
                ? "bg-emerald-600 text-black font-extrabold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>📋 Tasks</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.keyClick();
              onChangeApp("casefile");
            }}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeApp === "casefile"
                ? "bg-emerald-600 text-black font-extrabold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <span>📁 Clues</span>
            <span className="text-[10px] opacity-75">({solvedCluesCount})</span>
          </button>
        </div>

        {/* Screen Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#080d0f] text-xs scrollbar-thin scrollbar-thumb-zinc-700">
          {/* APP 1: EMAIL DISPATCH INBOX */}
          {activeApp === "email" && (
            <div className="space-y-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                MESSAGES ({emails.length})
              </div>

              {/* Email List Accordion / Selector */}
              <div className="space-y-1.5">
                {emails.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sfx.keyClick();
                      onSelectEmail(m.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                      m.id === activeEmail.id
                        ? "bg-emerald-950/40 border-emerald-500/80 text-emerald-200"
                        : "bg-[#0f171b] border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="font-bold text-emerald-400 truncate max-w-[180px]">
                        {m.sender.split("<")[0].trim()}
                      </span>
                      <span className="text-zinc-500">{m.timestamp}</span>
                    </div>
                    <div className="font-bold text-white text-[11px] truncate mb-0.5">
                      {m.subject}
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1">
                      {m.preview}
                    </div>
                  </button>
                ))}
              </div>

              {/* Reading Selected Email */}
              {activeEmail && (
                <div className="mt-3 p-3 rounded-xl border border-emerald-900/60 bg-[#0c1418] space-y-2">
                  <div className="border-b border-zinc-800 pb-2">
                    <div className="text-white font-bold text-xs">{activeEmail.subject}</div>
                    <div className="text-[10px] text-emerald-400">{activeEmail.sender}</div>
                  </div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed whitespace-pre-line">
                    {activeEmail.content}
                  </div>

                  {/* Dispatch Action Button */}
                  <div className="pt-2 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={() => onDispatchTask(activeEmail)}
                      className={`w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                        activeEmail.isCompleted
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-700/60 cursor-default"
                          : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20"
                      }`}
                    >
                      {activeEmail.isCompleted ? (
                        <>
                          <span>✔</span>
                          <span>Task Verified & Processed</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>{activeEmail.actionPrompt || "Send Task to Target Node"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APP 2: ACTIVE TASKS & DEVICE MATCHING */}
          {activeApp === "tasks" && (
            <div className="space-y-3">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                INCIDENT RESPONSE DIRECTIVES
              </div>
              <div className="p-2.5 rounded-xl border border-emerald-900/40 bg-[#0c1418] text-[11px] text-zinc-300 space-y-2">
                <div className="text-emerald-400 font-bold uppercase text-[10px]">Architecture Rulebook</div>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Match each evidence artifact to its proper machine class: Workstations for heavy image rendering, Servers for 24/7 network logging, Laptops for portable triage, and disconnect IoT equipment while leaving standalone embedded machines untouched.
                </p>
              </div>

              <div className="space-y-2">
                {emails.map((e, idx) => (
                  <div
                    key={e.id}
                    className={`p-2.5 rounded-xl border text-[11px] space-y-1 transition-all ${
                      e.isCompleted
                        ? "border-emerald-800/40 bg-emerald-950/20 text-emerald-300"
                        : "border-zinc-800 bg-[#0e161a] text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px]">
                      <span>Task {idx + 1}: {e.targetDeviceName}</span>
                      <span>{e.isCompleted ? "✔ RESOLVED" : "⏳ PENDING"}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">{e.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APP 3: CASE FILE & EVIDENCE TRACKER */}
          {activeApp === "casefile" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                <span>BREACH DOSSIER</span>
                <span className="text-emerald-400 font-bold">{solvedCluesCount}/5 DISCOVERED</span>
              </div>

              <div className="space-y-2">
                {cluesList.map((c) => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl border space-y-1 transition-all ${
                      c.solved
                        ? "border-emerald-600/50 bg-emerald-950/20 text-emerald-200"
                        : "border-zinc-800/80 bg-[#0e161a] text-zinc-500"
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {c.label}
                    </div>
                    <div className="font-mono text-xs font-extrabold text-white">
                      {c.solved ? c.value : "●●●●●●●● (Pending Triage)"}
                    </div>
                    <div className="text-[9px] text-zinc-500">
                      Source Node: {c.deviceSource}
                    </div>
                  </div>
                ))}
              </div>

              {/* IoT Containment Matrix */}
              <div className="mt-4 p-2.5 rounded-xl border border-zinc-800 bg-[#0a1215] space-y-2">
                <div className="text-[10px] uppercase font-bold text-amber-400">
                  Perimeter IoT Containment
                </div>
                <div className="space-y-1 text-[10px]">
                  {Object.entries(iotStatus).map(([k, item]) => (
                    <div key={k} className="flex items-center justify-between py-0.5 border-b border-zinc-900">
                      <span className={item.isIoT ? "text-zinc-300" : "text-zinc-500"}>
                        {item.name} {item.isIoT ? "(Wi-Fi IoT)" : "(Standalone Embedded)"}
                      </span>
                      <span className={`font-bold ${item.isDisconnected ? "text-emerald-400" : item.isIoT ? "text-rose-400" : "text-zinc-500"}`}>
                        {item.isDisconnected ? "ISOLATED" : item.isIoT ? "CONNECTED (RISK)" : "ONLINE (SAFE)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Home Button & Quick Dismiss */}
        <div className="relative z-20 py-2.5 px-4 bg-[#090f12] border-t border-zinc-800/60 flex items-center justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-24 h-1 bg-zinc-600 hover:bg-emerald-400 rounded-full transition-colors"
            title="Dismiss Phone"
          />
        </div>
      </div>
    </div>
  );
}
