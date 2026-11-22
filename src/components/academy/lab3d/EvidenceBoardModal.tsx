'use client';

import React, { useState } from 'react';
import { Camera, Wifi, User, MapPin, QrCode, X, ShieldAlert, Cpu } from './LabIcons';

interface EvidenceBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedClues: {
    surveillance: boolean;
    network: boolean;
    browser: boolean;
    archive: boolean;
    sms: boolean;
  };
}

export function EvidenceBoardModal({
  isOpen,
  onClose,
  unlockedClues,
}: EvidenceBoardModalProps) {
  const [activeTab, setActiveTab] = useState<'briefing' | 'evidence' | 'devices'>('evidence');

  if (!isOpen) return null;

  const foundCount = Object.values(unlockedClues).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Manila Detective Dossier Folder */}
      <div className="relative w-full max-w-4xl bg-[#f4ecd8] text-zinc-900 rounded-lg shadow-2xl border border-[#d6c4a5] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Metal Paperclip Graphic */}
        <div className="absolute top-2 left-6 w-5 h-12 border-2 border-zinc-400 rounded-full opacity-80 pointer-events-none z-20 shadow-sm" />

        {/* Top Folder Tabs */}
        <div className="flex items-center gap-1 px-8 pt-3 bg-[#e8dbbf] border-b border-[#d6c4a5] select-none">
          <button
            type="button"
            onClick={() => setActiveTab('briefing')}
            className={`px-5 py-2 rounded-t-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'briefing'
                ? 'bg-[#f4ecd8] text-zinc-900 border-t-2 border-amber-800'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Case File - Briefing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-5 py-2 rounded-t-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'evidence'
                ? 'bg-[#f4ecd8] text-zinc-900 border-t-2 border-red-600 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Evidence Board
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('devices')}
            className={`px-5 py-2 rounded-t-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'devices'
                ? 'bg-[#f4ecd8] text-zinc-900 border-t-2 border-amber-800'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Devices & Triage
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-300/60 text-zinc-600 hover:text-zinc-900"
              title="Close Case File"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Folder Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 relative flex-1">
          {/* Circular Watermark Seal */}
          <div className="absolute right-12 bottom-8 w-44 h-44 rounded-full border-4 border-amber-900/15 pointer-events-none flex flex-col items-center justify-center select-none rotate-[-12deg]">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-900/40 font-bold">
              TRYHACKME
            </span>
            <span className="font-serif text-lg font-black text-amber-900/35 tracking-tight">
              FORENSICS LAB
            </span>
            <span className="font-mono text-[8px] text-amber-900/30 uppercase mt-1">
              TBFC · WAREVILLE
            </span>
          </div>

          {activeTab === 'evidence' && (
            <>
              {/* Header with Red Ink Stamp Box */}
              <div className="flex items-start justify-between border-b border-amber-900/20 pb-4">
                <div>
                  <div className="font-mono text-[11px] font-bold text-amber-900/80 uppercase tracking-widest">
                    DIGITAL FORENSICS LAB · INCIDENT RESPONSE
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-zinc-900 font-serif mt-0.5">
                    EVIDENCE BOARD
                  </h2>
                </div>

                {/* Red Rubber Stamp */}
                <div className="border-2 border-red-700 text-red-700 px-4 py-1.5 rounded rotate-[-4deg] font-mono text-center shadow-sm select-none">
                  <div className="text-xs uppercase font-extrabold tracking-widest">
                    {foundCount}/5 CLUES FOUND
                  </div>
                </div>
              </div>

              {/* 5 Evidence Clue Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Attack Start */}
                <div className="bg-white p-4 rounded-md shadow border border-amber-900/15 flex flex-col justify-between min-h-[170px]">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-700 mb-2">
                      <span>1. ATTACK START</span>
                      <Camera className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="h-20 bg-zinc-900 rounded overflow-hidden flex items-center justify-center p-2 text-center">
                      {unlockedClues.surveillance ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-emerald-400 font-bold block">
                            CCTV RESTORED
                          </span>
                          <span className="font-mono text-[11px] text-zinc-300 block">
                            Breach time: 05:43
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-zinc-500 italic">
                          Scrambled footage...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    {unlockedClues.surveillance ? (
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        RECOVERED ✓
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-zinc-400">PENDING</span>
                    )}
                  </div>
                </div>

                {/* 2. IP Address */}
                <div className="bg-white p-4 rounded-md shadow border border-amber-900/15 flex flex-col justify-between min-h-[170px]">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-700 mb-2">
                      <span>2. IP ADDRESS</span>
                      <Wifi className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="h-20 bg-zinc-900 rounded overflow-hidden flex items-center justify-center p-2 text-center">
                      {unlockedClues.network ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-amber-400 font-bold block">
                            NETWORK LOG
                          </span>
                          <span className="font-mono text-[11px] text-white block">
                            IP: 197.45.82.16
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-zinc-500 italic">
                          Waiting for server log...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    {unlockedClues.network ? (
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        RECOVERED ✓
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-zinc-400">PENDING</span>
                    )}
                  </div>
                </div>

                {/* 3. Alias */}
                <div className="bg-white p-4 rounded-md shadow border border-amber-900/15 flex flex-col justify-between min-h-[170px]">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-700 mb-2">
                      <span>3. ALIAS</span>
                      <User className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="h-20 bg-zinc-900 rounded overflow-hidden flex items-center justify-center p-2 text-center">
                      {unlockedClues.browser ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-cyan-400 font-bold block">
                            BROWSER PROFILE
                          </span>
                          <span className="font-mono text-[11px] text-white block">
                            Hacker Alias: GBies
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-zinc-500 italic">
                          Damaged SSD in meeting room...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    {unlockedClues.browser ? (
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        RECOVERED ✓
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-zinc-400">PENDING</span>
                    )}
                  </div>
                </div>

                {/* 4. Geolocation */}
                <div className="bg-white p-4 rounded-md shadow border border-amber-900/15 flex flex-col justify-between min-h-[170px]">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-700 mb-2">
                      <span>4. GEOLOCATION</span>
                      <MapPin className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="h-20 bg-zinc-900 rounded overflow-hidden flex items-center justify-center p-2 text-center">
                      {unlockedClues.archive ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-emerald-400 font-bold block">
                            ARCHIVE SCANNED
                          </span>
                          <span className="font-mono text-[11px] text-zinc-300 block">
                            Location: Wareville
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-zinc-500 italic">
                          Suspicious archive on desktop...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    {unlockedClues.archive ? (
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        RECOVERED ✓
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-zinc-400">PENDING</span>
                    )}
                  </div>
                </div>

                {/* 5. Serial Number */}
                <div className="bg-white p-4 rounded-md shadow border border-amber-900/15 flex flex-col justify-between min-h-[170px]">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-700 mb-2">
                      <span>5. SERIAL NO.</span>
                      <QrCode className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="h-20 bg-zinc-900 rounded overflow-hidden flex items-center justify-center p-2 text-center">
                      {unlockedClues.sms ? (
                        <div className="space-y-1">
                          <span className="font-mono text-xs text-purple-400 font-bold block">
                            QR & SMS VERIFIED
                          </span>
                          <span className="font-mono text-[11px] text-white block">
                            Identifier: 4XJ-0117-RTD
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-zinc-500 italic">
                          Scan QR sticker on desk...
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    {unlockedClues.sms ? (
                      <span className="font-mono text-xs font-bold text-emerald-700">
                        RECOVERED ✓
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-zinc-400">PENDING</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'briefing' && (
            <div className="space-y-4 max-w-2xl font-serif leading-relaxed text-zinc-800">
              <div className="border-b border-amber-900/20 pb-2">
                <span className="font-mono text-xs text-amber-900 font-bold uppercase tracking-widest">
                  CASE DOSSIER · CONFIDENTIAL
                </span>
                <h3 className="text-xl font-bold font-serif text-zinc-900">
                  TBFC Facility Incident Briefing
                </h3>
              </div>
              <p>
                Wareville has gone silent overnight. The streets are empty, the holiday festival
                preparations are stalled, and an unauthorized intrusion has compromised the core
                offices of The Best Festival Company.
              </p>
              <p>
                As McSkidy, your mission is to investigate the office, pull evidence files from your
                handheld smartphone assistant, and match each forensic triage operation to the
                appropriate hardware machine across the building.
              </p>
              <div className="p-4 bg-amber-50 rounded border border-amber-200 font-mono text-xs space-y-1 text-zinc-800">
                <span className="font-bold text-amber-900 uppercase">Hardware Rules of Thumb:</span>
                <div>• Heavy GPU rendering / video decompression → Dedicated Workstation</div>
                <div>• 24/7 continuous network access logs → Server Rack</div>
                <div>• Damaged isolated machine requiring battery power → Meeting Room Laptop</div>
                <div>• General storage decompression & scanning → Office Desktop</div>
                <div>• Optical QR code capture & SMS verification → Handheld Smartphone</div>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-white rounded border border-amber-900/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Workstation vs. Desktop</span>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Workstations feature high-performance multi-threaded GPUs and ECC memory designed
                  for continuous heavy computational loads like 4K video de-obfuscation without
                  thermal throttling.
                </p>
              </div>

              <div className="p-4 bg-white rounded border border-amber-900/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-zinc-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>IoT Intrusion Class</span>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  Smart appliances that connect to the Wi-Fi network (thermostats, wireless speakers,
                  network printers) provide attackers with persistent pivot footholds. Standalone
                  embedded appliances (traditional coffee machines) without network stacks are
                  non-vector targets.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Back Button */}
        <div className="px-8 py-4 bg-[#e8dbbf] border-t border-[#d6c4a5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded bg-zinc-900 text-white font-mono text-xs font-bold hover:bg-zinc-800 transition-colors shadow"
          >
            ← Back to Room
          </button>
        </div>
      </div>
    </div>
  );
}
