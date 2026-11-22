'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ChevronRight, ArrowLeft } from './LabIcons';

interface DockedPhoneAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  unlockedClues: {
    surveillance: boolean;
    network: boolean;
    browser: boolean;
    archive: boolean;
    sms: boolean;
  };
}

interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  time: string;
  body: string[];
  taskRef?: string;
}

const EMAILS: EmailItem[] = [
  {
    id: 'holiday',
    sender: 'TBFC People & Culture <rewards@tbfc-holiday.com>',
    subject: '🎄 McSkidy, December is on us. Claim your paid holiday before midnight',
    time: '23:59',
    body: [
      'Hi McSkidy,',
      "What a year it's been in Cyber Security! So we're doing something we've never done before.",
      'All of December is yours: fully paid, fully covered, no work, no catch.',
      'As part of our Season of Thanks initiative, every eligible employee in Wareville will get a fully paid holiday of your choice (we know you have your eye on Mount Hackenbach 👀).',
      'Warmest wishes for the season,',
      'The TBFC People & Culture Team',
    ],
  },
  {
    id: 'task1',
    sender: 'TBFC Assistant <assistant@tbfc.internal>',
    subject: 'Task 1: Repair surveillance footage',
    time: '03:14',
    taskRef: 'Workstation',
    body: [
      'McSkidy! Emergency breach detected overnight.',
      'The surveillance camera streams from the loading bay are severely corrupted. We need high-end graphical processing power to de-obfuscate the video without overheating.',
      'Target: Locate the dedicated GPU Workstation in Zone 1 to enhance the footage.',
    ],
  },
  {
    id: 'task2',
    sender: 'TBFC Assistant <assistant@tbfc.internal>',
    subject: 'Task 2: Search the network log',
    time: '03:22',
    taskRef: 'Server',
    body: [
      'We need to determine the external IP address used by the intruder.',
      'Network visitor records are maintained 24/7 on the central server machine in the cold server room.',
      'Target: Connect to the central Server console and query the access log for the breach timestamp.',
    ],
  },
  {
    id: 'task3',
    sender: 'TBFC Assistant <assistant@tbfc.internal>',
    subject: 'Task 3: Recover browser profile',
    time: '03:31',
    taskRef: 'Laptop',
    body: [
      'A damaged computer was abandoned in the meeting room and cannot be moved.',
      'Bring a portable battery-powered machine, plug into the damaged chassis, and recover cached browser profiles to identify the hacker alias.',
      'Target: The meeting room Laptop.',
    ],
  },
  {
    id: 'task4',
    sender: 'TBFC Assistant <assistant@tbfc.internal>',
    subject: 'Task 4: Scan the archive',
    time: '03:40',
    taskRef: 'Desktop',
    body: [
      'A data archive was downloaded before the intruder severed connections.',
      'Use a standard daily office Desktop computer to decompress the archive and scan for location coordinates.',
      'Target: Office Desktop terminal.',
    ],
  },
  {
    id: 'task5',
    sender: 'TBFC Assistant <assistant@tbfc.internal>',
    subject: 'Task 5: Scan QR code & Location SMS',
    time: '03:45',
    taskRef: 'Smartphone',
    body: [
      'A QR label sticker was recovered on the desk.',
      'Only your handheld Smartphone possesses an optical camera lens and mobile SMS verification connectivity.',
      'Target: Use this smartphone to scan the QR sticker.',
    ],
  },
];

export function DockedPhoneAssistant({
  isOpen,
  onToggle,
  unlockedClues,
}: DockedPhoneAssistantProps) {
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  // If docked (not open in center)
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-40 group flex items-end focus:outline-none transition-transform hover:scale-105"
        title="Open Smartphone Assistant (P / Right-Click)"
      >
        {/* Miniature Docked iPhone */}
        <div className="w-28 h-52 bg-zinc-950 rounded-[22px] border-4 border-zinc-700 shadow-2xl overflow-hidden flex flex-col p-2 relative text-left">
          {/* Dynamic Island pill */}
          <div className="w-10 h-2 bg-black rounded-full mx-auto mb-2" />

          {/* Mini Status */}
          <div className="flex justify-between items-center text-[7px] text-zinc-400 font-mono px-1 mb-2">
            <span>22:12</span>
            <span>5G 100%</span>
          </div>

          {/* Mini Inbox Header */}
          <div className="bg-zinc-900/90 rounded-lg p-1.5 border border-zinc-800 space-y-1">
            <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-400 font-mono">
              <Mail className="w-2.5 h-2.5" />
              <span>INBOX</span>
              <span className="ml-auto w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[7px] flex items-center justify-center font-bold">
                5
              </span>
            </div>
            <p className="text-[7px] text-zinc-300 font-sans truncate">
              Task 1: Repair surveillance...
            </p>
          </div>

          <div className="mt-auto text-center font-mono text-[7px] text-zinc-500 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
            Click / [P]
          </div>
        </div>
      </button>
    );
  }

  // Expanded Phone in Center
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
      <div className="relative w-[340px] h-[640px] bg-zinc-950 rounded-[44px] border-[6px] border-zinc-700 shadow-2xl overflow-hidden flex flex-col p-4 text-white">
        {/* Dynamic Island Notch */}
        <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-center mb-3">
          <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
        </div>

        {/* Top Status Bar */}
        <div className="flex justify-between items-center text-xs font-mono text-zinc-400 px-3 pb-3 border-b border-zinc-800">
          <span className="font-bold">22:12</span>
          <span>5G · 100%</span>
        </div>

        {/* Phone Content Screen */}
        <div className="flex-1 overflow-y-auto pt-3 px-1 space-y-3">
          {selectedEmail ? (
            /* Email Detail View */
            <div className="space-y-3 font-sans text-xs">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="flex items-center gap-1 text-emerald-400 font-mono text-xs hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Inbox</span>
              </button>

              <div className="border-b border-zinc-800 pb-2">
                <h3 className="font-bold text-white text-sm leading-snug">
                  {selectedEmail.subject}
                </h3>
                <div className="text-[10px] text-zinc-400 font-mono mt-1">
                  From: {selectedEmail.sender}
                </div>
              </div>

              <div className="space-y-2 text-zinc-300 leading-relaxed text-[11px]">
                {selectedEmail.body.map((par, i) => (
                  <p key={i}>{par}</p>
                ))}
              </div>

              {selectedEmail.taskRef && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 font-mono text-[10px] space-y-1">
                  <div className="font-bold uppercase">Optimal Device Match:</div>
                  <div>→ {selectedEmail.taskRef}</div>
                </div>
              )}
            </div>
          ) : (
            /* Email List View */
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  MESSAGES ({EMAILS.length})
                </span>
                <span className="font-mono text-[10px] text-zinc-400">TBFC Mail</span>
              </div>

              {EMAILS.map((email) => {
                const isResolved =
                  (email.id === 'task1' && unlockedClues.surveillance) ||
                  (email.id === 'task2' && unlockedClues.network) ||
                  (email.id === 'task3' && unlockedClues.browser) ||
                  (email.id === 'task4' && unlockedClues.archive) ||
                  (email.id === 'task5' && unlockedClues.sms);

                return (
                  <button
                    key={email.id}
                    type="button"
                    onClick={() => setSelectedEmail(email)}
                    className="w-full text-left p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 transition-colors flex items-start gap-2.5"
                  >
                    <div className="mt-0.5">
                      {isResolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Mail className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[170px]">
                          {email.sender.split('<')[0].trim()}
                        </span>
                        <span className="font-mono text-[9px] text-zinc-500">{email.time}</span>
                      </div>
                      <div className="font-bold text-xs text-white truncate mt-0.5">
                        {email.subject}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600 mt-1" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Close Button / Home Bar */}
        <div className="pt-3 pb-1 border-t border-zinc-800 text-center">
          <button
            type="button"
            onClick={onToggle}
            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-mono text-xs font-bold text-zinc-200 transition-colors"
          >
            ← Exit Phone Focus (P / Esc)
          </button>
          <div className="w-28 h-1 bg-zinc-600 rounded-full mx-auto mt-2" />
        </div>
      </div>
    </div>
  );
}
