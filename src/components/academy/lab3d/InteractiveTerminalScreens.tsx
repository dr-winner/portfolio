'use client';

import React, { useState } from 'react';
import { Terminal, Check, Video, HardDrive, FileArchive, QrCode, Coffee, X } from './LabIcons';

export type ActiveDeviceModalType =
  | 'cocoa'
  | 'workstation'
  | 'server'
  | 'laptop'
  | 'archive'
  | 'qr'
  | 'thermostat'
  | 'snowman'
  | 'printer'
  | null;

interface InteractiveTerminalScreensProps {
  activeModal: ActiveDeviceModalType;
  onClose: () => void;
  onClueUnlocked: (clueKey: 'surveillance' | 'network' | 'browser' | 'archive' | 'sms') => void;
  onCocoaBrewed: () => void;
  onDeviceDisconnected: (devId: string) => void;
  disconnectedDevices: string[];
}

export function InteractiveTerminalScreens({
  activeModal,
  onClose,
  onClueUnlocked,
  onCocoaBrewed,
  onDeviceDisconnected,
  disconnectedDevices,
}: InteractiveTerminalScreensProps) {
  // State for Workstation video
  const [videoProcessed, setVideoProcessed] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // State for Server Terminal
  const [cmdRunning, setCmdRunning] = useState(false);
  const [serverOutput, setServerOutput] = useState<string[]>([]);

  // State for Laptop SSD recovery
  const [ssdRecovering, setSsdRecovering] = useState(false);
  const [ssdProgress, setSsdProgress] = useState(0);
  const [ssdDone, setSsdDone] = useState(false);

  // State for Archive Desktop
  const [archiveScanning, setArchiveScanning] = useState(false);
  const [archiveDone, setArchiveDone] = useState(false);

  // State for QR & SMS
  const [qrScanning, setQrScanning] = useState(false);
  const [qrDone, setQrDone] = useState(false);

  // State for Cocoa
  const [brewing, setBrewing] = useState(false);
  const [brewed, setBrewed] = useState(false);

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Interactive Terminal Interface</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* 1. Hot Cocoa Machine */}
          {activeModal === 'cocoa' && (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-950/60 border border-red-700/50 flex items-center justify-center text-red-400">
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">TBFC Breakroom Cocoa Dispenser</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Enjoy a hot beverage before commencing the warehouse breach triage.
                </p>
              </div>

              {brewed ? (
                <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 text-xs font-mono space-y-2">
                  <p className="font-bold">✓ Hot Cocoa Poured into Holiday Mug!</p>
                  <p className="text-zinc-400 text-[11px]">Take your mug and return to your desk to check incoming messages.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  <button
                    type="button"
                    disabled={brewing}
                    onClick={() => {
                      setBrewing(true);
                      setTimeout(() => {
                        setBrewing(false);
                        setBrewed(true);
                        onCocoaBrewed();
                      }, 1800);
                    }}
                    className="p-3 rounded-lg border border-red-800 bg-red-900/30 hover:bg-red-900/50 text-white font-mono text-xs font-bold transition-all shadow"
                  >
                    {brewing ? 'Brewing...' : '☕ Hot Cocoa'}
                  </button>
                  <button
                    type="button"
                    disabled={brewing}
                    onClick={() => {
                      setBrewing(true);
                      setTimeout(() => {
                        setBrewing(false);
                        setBrewed(true);
                        onCocoaBrewed();
                      }, 1800);
                    }}
                    className="p-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 font-mono text-xs hover:border-zinc-700 transition-all"
                  >
                    🥛 Warm Milk
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. Forensic Workstation */}
          {activeModal === 'workstation' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 font-bold border-b border-zinc-800 pb-2">
                <Video className="w-4 h-4" />
                <span>Forensic Workstation · Surveillance Footage Analyzer</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Task 1: Large 4K security footage stream is scrambled. The high-performance GPU workstation can de-obfuscate raw frames without thermal bottlenecking.
              </p>

              <div className="h-44 bg-black rounded-lg border border-zinc-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                {videoProcessed ? (
                  <div className="space-y-2 animate-in zoom-in-95 duration-200">
                    <span className="inline-block px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-800">
                      FRAME DEOBFUSCATION COMPLETE
                    </span>
                    <div className="font-mono text-lg font-black text-white">
                      BREACH DETECTED: 05:43 AM
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Target door: North Loading Dock · Intruder entered facility
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="font-mono text-xs text-zinc-500 animate-pulse">
                      {videoProgress > 0 ? `GPU Parallel Render: ${videoProgress}%` : '[ Encrypted Frame Buffer ]'}
                    </div>
                    <button
                      type="button"
                      disabled={videoProgress > 0}
                      onClick={() => {
                        setVideoProgress(15);
                        const interval = setInterval(() => {
                          setVideoProgress((prev) => {
                            if (prev >= 100) {
                              clearInterval(interval);
                              setVideoProcessed(true);
                              return 100;
                            }
                            return prev + 25;
                          });
                        }, 300);
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors shadow"
                    >
                      De-scramble & Enhance Footage
                    </button>
                  </div>
                )}
              </div>

              {videoProcessed && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClueUnlocked('surveillance');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors shadow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Added to case file ✓</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Server Console */}
          {activeModal === 'server' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-bold border-b border-zinc-800 pb-2">
                <Terminal className="w-4 h-4" />
                <span>Central Server Rack Console · 24/7 Access Logs</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Task 2: Query the dedicated 24/7 server to isolate the external intruder IP recorded at the 05:43 breach timestamp.
              </p>

              <div className="p-4 bg-black rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 min-h-[160px] space-y-2">
                <div className="text-zinc-500">sysadmin@office-server:~$</div>
                {serverOutput.map((line, idx) => (
                  <div key={idx} className={line.includes('Hacker IP') ? 'text-amber-400 font-bold' : ''}>
                    {line}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={cmdRunning || serverOutput.length > 0}
                  onClick={() => {
                    setCmdRunning(true);
                    setServerOutput(['sysadmin@office-server:~$ grep "05:43" /var/log/network.log']);
                    setTimeout(() => {
                      setServerOutput((prev) => [
                        ...prev,
                        '[/] Retrieving network logs',
                        '[/] Processing visitor connections',
                        'Hacker IP: 197.45.82.16',
                        'sysadmin@office-server:~$ _',
                      ]);
                      setCmdRunning(false);
                    }, 1200);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono text-xs font-bold transition-colors shadow"
                >
                  {cmdRunning ? 'Running query...' : 'Paste and Run (grep 05:43)'}
                </button>

                {serverOutput.length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClueUnlocked('network');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors shadow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Added to case file ✓</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. Meeting Room Laptop SSD Recovery */}
          {activeModal === 'laptop' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold border-b border-zinc-800 pb-2">
                <HardDrive className="w-4 h-4" />
                <span>Meeting Room Laptop · Damaged SSD Recovery</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Task 3: A portable computer running on battery is plugged into the damaged case in the conference room. Recover cached browser artifacts.
              </p>

              <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-20 rounded-md bg-zinc-800 border-2 border-zinc-700 flex flex-col items-center justify-center p-2 shadow-inner">
                  <HardDrive className="w-6 h-6 text-cyan-400" />
                  <span className="font-mono text-[9px] font-bold text-zinc-400 mt-1">SSD 512GB</span>
                </div>

                {ssdDone ? (
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      BROWSER ARTIFACTS RECOVERED
                    </span>
                    <div className="font-mono text-lg font-black text-white">
                      Hacker Alias: GBies
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 w-full max-w-xs">
                    <h4 className="font-bold text-white text-sm">Damaged SSD detected</h4>
                    <p className="text-zinc-400 text-xs">Signs of physical shock detected. Attempt data recovery.</p>
                    {ssdRecovering ? (
                      <div className="space-y-1 pt-2">
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${ssdProgress}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400">Recovering... {ssdProgress}%</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSsdRecovering(true);
                          const interval = setInterval(() => {
                            setSsdProgress((p) => {
                              if (p >= 100) {
                                clearInterval(interval);
                                setSsdRecovering(false);
                                setSsdDone(true);
                                return 100;
                              }
                              return p + 20;
                            });
                          }, 300);
                        }}
                        className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-colors shadow"
                      >
                        Recover Data
                      </button>
                    )}
                  </div>
                )}
              </div>

              {ssdDone && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClueUnlocked('browser');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors shadow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Added to case file ✓</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. Archive Desktop */}
          {activeModal === 'archive' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-purple-400 font-bold border-b border-zinc-800 pb-2">
                <FileArchive className="w-4 h-4" />
                <span>Office Desktop · Suspicious Archive Extraction</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Task 4: A regular daily office desktop machine was used to decompress and virus-scan the suspicious archive downloaded during the breach.
              </p>

              <div className="p-6 bg-black rounded-lg border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
                {archiveDone ? (
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      ARCHIVE PARSED & GEOLOCATED
                    </span>
                    <div className="font-mono text-lg font-black text-white">
                      Location: Wareville
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="font-mono text-xs text-zinc-400">
                      File: <span className="text-white">tbfc_evidence_dump.tar.gz</span> (24.8 MB)
                    </div>
                    <button
                      type="button"
                      disabled={archiveScanning}
                      onClick={() => {
                        setArchiveScanning(true);
                        setTimeout(() => {
                          setArchiveScanning(false);
                          setArchiveDone(true);
                        }, 1200);
                      }}
                      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-colors shadow"
                    >
                      {archiveScanning ? 'Extracting & Scanning...' : 'Decompress Archive on Desktop'}
                    </button>
                  </div>
                )}
              </div>

              {archiveDone && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClueUnlocked('archive');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors shadow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Added to case file ✓</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 6. QR Code Scanner */}
          {activeModal === 'qr' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-blue-400 font-bold border-b border-zinc-800 pb-2">
                <QrCode className="w-4 h-4" />
                <span>Smartphone Assistant · Optical QR Code Scanner</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Task 5: Use the portable camera and cellular connection of the Smartphone to scan the QR label left on the desk.
              </p>

              <div className="p-6 bg-black rounded-lg border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
                {qrDone ? (
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      QR LINK RESOLVED & SMS RECEIVED
                    </span>
                    <div className="font-mono text-lg font-black text-white">
                      Identifier: 4XJ-0117-RTD
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto border-2 border-dashed border-blue-500/60 rounded-lg flex items-center justify-center p-2">
                      <QrCode className="w-12 h-12 text-blue-400" />
                    </div>
                    <button
                      type="button"
                      disabled={qrScanning}
                      onClick={() => {
                        setQrScanning(true);
                        setTimeout(() => {
                          setQrScanning(false);
                          setQrDone(true);
                        }, 1200);
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors shadow"
                    >
                      {qrScanning ? 'Scanning QR...' : 'Scan with Smartphone Camera'}
                    </button>
                  </div>
                )}
              </div>

              {qrDone && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClueUnlocked('sms');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors shadow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Added to case file ✓</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 7. IoT Device Disconnect Modal */}
          {(activeModal === 'thermostat' || activeModal === 'snowman' || activeModal === 'printer') && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-rose-400 font-bold border-b border-zinc-800 pb-2">
                <span>Rogue IoT Device Isolation</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Task 6: Disconnect Wi-Fi / network interfaces of connected IoT appliances to neutralize the attacker&apos;s lateral movement vector across the facility.
              </p>

              <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800 text-center space-y-3">
                <div className="font-mono text-sm font-bold text-white uppercase">
                  Target: {activeModal}
                </div>
                {disconnectedDevices.includes(activeModal) ? (
                  <span className="font-mono text-xs font-bold text-emerald-400 block">
                    ✓ Device disconnected from local network
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onDeviceDisconnected(activeModal);
                    }}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-colors shadow"
                  >
                    Sever Network Connection (Isolate IoT)
                  </button>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
