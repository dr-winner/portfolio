'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  LogOut,
  FolderOpen,
  HelpCircle,
} from './LabIcons';
import { buildSnowTrailOfficeScene, OfficeObjectTargets } from './snowtrailOffice3D';
import { EvidenceBoardModal } from './EvidenceBoardModal';
import {
  InteractiveTerminalScreens,
  ActiveDeviceModalType,
} from './InteractiveTerminalScreens';
import { DockedPhoneAssistant } from './DockedPhoneAssistant';

interface SnowTrailLabViewProps {
  onExitLab?: () => void;
  onClueFound?: (clueIndex: number) => void;
}

export function SnowTrailLabView({ onExitLab, onClueFound }: SnowTrailLabViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // HUD & Game State
  const [caseFileOpen, setCaseFileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveDeviceModalType>(null);

  // Tutorial Progress
  const [tutorialSteps, setTutorialSteps] = useState({
    walkToCocoa: false,
    makeCocoa: false,
    takeMug: false,
    freeMouse: false,
    openPhone: false,
  });

  // Clues Progress (5 clues)
  const [unlockedClues, setUnlockedClues] = useState({
    surveillance: false,
    network: false,
    browser: false,
    archive: false,
    sms: false,
  });

  // Rogue IoT Neutralization (3 devices)
  const [disconnectedDevices, setDisconnectedDevices] = useState<string[]>([]);

  // Targets Ref
  const targetsRef = useRef<OfficeObjectTargets | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const activePromptRef = useRef<ActiveDeviceModalType>(null);

  // Pointer Lock Toggle
  const requestLock = useCallback(() => {
    if (containerRef.current && !phoneOpen && !caseFileOpen && !activeModal) {
      containerRef.current.requestPointerLock();
    }
  }, [phoneOpen, caseFileOpen, activeModal]);

  const unlockMouse = useCallback(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, []);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Three.js Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 750;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060c18);
    scene.fog = new THREE.FogExp2(0x060c18, 0.025);

    // Camera (Player Viewpoint at 1.7m eye height)
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
    camera.position.set(-5.5, 1.65, -0.5);
    camera.rotation.set(0, Math.PI, 0);
        cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // Build Authentic Office Scene
    const targets = buildSnowTrailOfficeScene(scene);
    targetsRef.current = targets;

    // Falling Snow Particles Outside Windows
    const snowCount = 400;
    const snowGeo = new THREE.BufferGeometry();
    const snowPos = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i++) {
      snowPos[i * 3] = 18 + Math.random() * 14;
      snowPos[i * 3 + 1] = Math.random() * 12;
      snowPos[i * 3 + 2] = -15 + Math.random() * 30;
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
    });
    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);

    // First-Person Movement State
    const keys = { w: false, a: false, s: false, d: false };
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    let isLocked = false;
    const euler = new THREE.Euler(0, Math.PI, 0, 'YXZ');

    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.key.toLowerCase();
      if (code === 'w' || e.key === 'ArrowUp') keys.w = true;
      if (code === 'a' || e.key === 'ArrowLeft') keys.a = true;
      if (code === 's' || e.key === 'ArrowDown') keys.s = true;
      if (code === 'd' || e.key === 'ArrowRight') keys.d = true;

      if (code === 'p') {
        setPhoneOpen((prev) => {
          if (!prev) unlockMouse();
          return !prev;
        });
        setTutorialSteps((t) => ({ ...t, openPhone: true }));
      }

      if (code === 'e') {
        if (activePromptRef.current) {
          unlockMouse();
          setActiveModal(activePromptRef.current);
        } else {
          // Toggle pointer lock
          if (document.pointerLockElement) unlockMouse();
          else requestLock();
        }
      }

      if (e.key === 'Escape') {
        setTutorialSteps((t) => ({ ...t, freeMouse: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.key.toLowerCase();
      if (code === 'w' || e.key === 'ArrowUp') keys.w = false;
      if (code === 'a' || e.key === 'ArrowLeft') keys.a = false;
      if (code === 's' || e.key === 'ArrowDown') keys.s = false;
      if (code === 'd' || e.key === 'ArrowRight') keys.d = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked) return;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      euler.setFromQuaternion(camera.quaternion);
      euler.y -= movementX * 0.0022;
      euler.x -= movementY * 0.0022;
      euler.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.x));
      camera.quaternion.setFromEuler(euler);
    };

    const handlePointerLockChange = () => {
      isLocked = document.pointerLockElement === container;
      setPointerLocked(isLocked);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPhoneOpen((prev) => !prev);
      setTutorialSteps((t) => ({ ...t, openPhone: true }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    container.addEventListener('contextmenu', handleContextMenu);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock(true);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Animate Snow Falling
      const positions = snowParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 1.5;
        if (positions[i] < 0) positions[i] = 12;
      }
      snowParticles.geometry.attributes.position.needsUpdate = true;

      // Handle Walking Physics
      if (isLocked) {
        direction.z = Number(keys.w) - Number(keys.s);
        direction.x = Number(keys.d) - Number(keys.a);
        direction.normalize();

        const moveSpeed = 4.2;
        if (keys.w || keys.s) velocity.z = direction.z * moveSpeed * delta;
        else velocity.z = 0;
        if (keys.a || keys.d) velocity.x = direction.x * moveSpeed * delta;
        else velocity.x = 0;

        // Apply movement relative to camera orientation
        const camYaw = euler.y;
        const forward = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
        const side = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));

        camera.position.addScaledVector(forward, velocity.z);
        camera.position.addScaledVector(side, velocity.x);

        // Office Boundary Collisions (Keep player inside room)
        camera.position.x = Math.max(-16.5, Math.min(16.5, camera.position.x));
        camera.position.z = Math.max(-13.5, Math.min(13.5, camera.position.z));
        camera.position.y = 1.7; // Maintain eye height
      }

      // Proximity Detection to Targets
      const playerPos = camera.position;
      let promptText: string | null = null;
      let promptTarget: ActiveDeviceModalType = null;

      // Distance to Cocoa Station (-15, 8)
      const dCocoa = Math.hypot(playerPos.x - (-15), playerPos.z - 8);
      if (dCocoa < 2.5) {
        setTutorialSteps((t) => ({ ...t, walkToCocoa: true }));
        promptText = '[E] Make Hot Cocoa at Breakroom Station';
        promptTarget = 'cocoa';
      }

      // Distance to Workstation (-6, -4)
      const dWorkstation = Math.hypot(playerPos.x - (-6), playerPos.z - (-4));
      if (dWorkstation < 2.5) {
        promptText = '[E] Analyze Surveillance Footage on Workstation';
        promptTarget = 'workstation';
      }

      // Distance to Server Rack (8.9, -8.8)
      const dServer = Math.hypot(playerPos.x - 8.9, playerPos.z - (-8.8));
      if (dServer < 2.8) {
        promptText = '[E] Query 24/7 Access Logs on Server Console';
        promptTarget = 'server';
      }

      // Distance to Meeting Room Laptop (10.5, 7.5)
      const dMeeting = Math.hypot(playerPos.x - 10.5, playerPos.z - 7.5);
      if (dMeeting < 2.8) {
        promptText = '[E] Recover Browser Profile on Meeting Room Laptop';
        promptTarget = 'laptop';
      }

      // Distance to Archive Desktop (6, 4)
      const dArchive = Math.hypot(playerPos.x - 6, playerPos.z - 4);
      if (dArchive < 2.5) {
        promptText = '[E] Decompress & Scan Archive on Desktop';
        promptTarget = 'archive';
      }

      // Distance to QR Desk (-6, 4)
      const dQr = Math.hypot(playerPos.x - (-6), playerPos.z - 4);
      if (dQr < 2.5) {
        promptText = '[E] Scan QR Code Sticker with Smartphone';
        promptTarget = 'qr';
      }

      // Rogue IoT Disconnects (Active if 5 clues found)
      const dThermostat = Math.hypot(playerPos.x - (-17.9), playerPos.z - 5.5);
      if (dThermostat < 2.5) {
        promptText = '[E] Isolate Rogue Smart Thermostat (Wi-Fi)';
        promptTarget = 'thermostat';
      }

      const dSnowman = Math.hypot(playerPos.x - (-12.8), playerPos.z - 8.1);
      if (dSnowman < 2.2) {
        promptText = '[E] Disconnect Rogue Smart Speaker';
        promptTarget = 'snowman';
      }

      const dPrinter = Math.hypot(playerPos.x - (-14), playerPos.z - (-10));
      if (dPrinter < 2.6) {
        promptText = '[E] Unplug Network Office Printer';
        promptTarget = 'printer';
      }

      setInteractionPrompt(promptText);
      activePromptRef.current = promptTarget;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 750;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      container.removeEventListener('contextmenu', handleContextMenu);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [requestLock, unlockMouse]);

  // Total clues found count
  const cluesFoundCount = Object.values(unlockedClues).filter(Boolean).length;

  const handleClueUnlocked = (clueKey: 'surveillance' | 'network' | 'browser' | 'archive' | 'sms') => {
    setUnlockedClues((prev) => ({ ...prev, [clueKey]: true }));
    const clueIndexMap = {
      surveillance: 0,
      network: 1,
      browser: 2,
      archive: 3,
      sms: 4,
    };
    onClueFound?.(clueIndexMap[clueKey]);
  };

  const handleDeviceDisconnected = (devId: string) => {
    setDisconnectedDevices((prev) => {
      if (prev.includes(devId)) return prev;
      const updated = [...prev, devId];
      if (updated.length === 3) {
        onClueFound?.(5); // 6th question: IoT class
      }
      return updated;
    });
  };

  return (
    <div
      ref={containerRef}
      onClick={requestLock}
      className="relative w-full h-[760px] lg:h-[820px] bg-black rounded-xl overflow-hidden select-none cursor-crosshair border border-zinc-800"
    >
      {/* 1. TOP BAR HUD (1:1 with TryHackMe Snow Trail) */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between pointer-events-none">
        {/* Top Left: [Case file] & [Ask for help] */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              unlockMouse();
              setCaseFileOpen(true);
            }}
            className="px-3.5 py-1.5 rounded bg-white text-zinc-900 font-mono text-xs font-bold hover:bg-zinc-200 transition-colors shadow flex items-center gap-1.5"
          >
            <FolderOpen className="w-4 h-4 text-amber-800" />
            <span>Case file</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              unlockMouse();
              setHelpOpen(true);
            }}
            className="px-3.5 py-1.5 rounded bg-white/90 text-zinc-800 font-mono text-xs font-bold hover:bg-white transition-colors shadow flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Ask for help</span>
          </button>
        </div>

        {/* Top Center: Badge */}
        <div className="pointer-events-auto">
          <div className="px-5 py-1.5 rounded bg-white text-zinc-900 font-mono text-xs font-extrabold shadow tracking-wider uppercase">
            {cluesFoundCount < 5
              ? `${cluesFoundCount}/5 Clues found`
              : `${disconnectedDevices.length}/3 devices disconnected`}
          </div>
        </div>

        {/* Top Right: Audio / Fullscreen / [Exit lab] */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((m) => !m);
            }}
            className="p-2 rounded bg-white text-zinc-800 hover:bg-zinc-100 shadow"
            title="Audio Mute Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            className="p-2 rounded bg-white text-zinc-800 hover:bg-zinc-100 shadow"
            title="Fullscreen Toggle"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              unlockMouse();
              onExitLab?.();
            }}
            className="px-3.5 py-1.5 rounded bg-white text-zinc-900 font-mono text-xs font-bold hover:bg-zinc-100 transition-colors shadow flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span>Exit lab</span>
          </button>
        </div>
      </div>

      {/* 2. LEFT OVERLAY: Tutorial Checklist (Authentic TryHackMe Tutorial) */}
      <div className="absolute top-16 left-6 z-20 pointer-events-none max-w-xs space-y-3 font-sans">
        <h4 className="text-white/90 text-sm font-bold tracking-wide">Tutorial</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] mt-0.5 ${
                tutorialSteps.walkToCocoa
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/40 text-transparent'
              }`}
            >
              ✓
            </span>
            <div>
              <span className={tutorialSteps.walkToCocoa ? 'text-zinc-300' : 'text-white font-medium'}>
                Walk to the hot cocoa station
              </span>
              {!tutorialSteps.walkToCocoa && (
                <p className="text-zinc-400 text-[10px] mt-0.5">
                  Use <span className="text-white font-mono font-bold">W A S D</span> or arrow keys to walk, and mouse to look around.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] mt-0.5 ${
                tutorialSteps.makeCocoa
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/40 text-transparent'
              }`}
            >
              ✓
            </span>
            <span className={tutorialSteps.makeCocoa ? 'text-zinc-400' : 'text-zinc-300'}>
              Make your hot cocoa
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] mt-0.5 ${
                tutorialSteps.takeMug
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/40 text-transparent'
              }`}
            >
              ✓
            </span>
            <span className={tutorialSteps.takeMug ? 'text-zinc-400' : 'text-zinc-300'}>
              Take the mug to your table
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] mt-0.5 ${
                tutorialSteps.freeMouse
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/40 text-transparent'
              }`}
            >
              ✓
            </span>
            <span className={tutorialSteps.freeMouse ? 'text-zinc-400' : 'text-zinc-300'}>
              Free your mouse (Press Esc)
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] mt-0.5 ${
                tutorialSteps.openPhone
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                  : 'border-white/40 text-transparent'
              }`}
            >
              ✓
            </span>
            <span className={tutorialSteps.openPhone ? 'text-zinc-400' : 'text-zinc-300'}>
              Open your phone (Press P / Right-Click)
            </span>
          </div>
        </div>
      </div>

      {/* 3. CENTER CROSSHAIR RETICLE & INTERACTION PROMPT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <div
          className={`w-2 h-2 rounded-full transition-transform ${
            interactionPrompt ? 'scale-150 bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-white/70'
          }`}
        />

        {interactionPrompt && (
          <div className="mt-4 px-4 py-2 rounded-lg bg-black/85 border border-emerald-500/50 text-white font-mono text-xs font-bold shadow-lg animate-in fade-in duration-150">
            {interactionPrompt}
          </div>
        )}
      </div>

      {/* 4. POINTER LOCK HINT */}
      {!pointerLocked && !caseFileOpen && !activeModal && !phoneOpen && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="px-6 py-3 rounded-xl bg-zinc-950/90 border border-zinc-700 text-center shadow-2xl space-y-1">
            <div className="text-sm font-bold text-white font-mono">
              Click anywhere to lock mouse & explore
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              WASD to walk · Mouse to look · Esc to release
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM STATUS BAR HINT */}
      <div className="absolute bottom-3 inset-x-0 z-20 text-center pointer-events-none">
        <span className="font-mono text-[11px] text-white/70 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          WASD / ARROWS to walk · MOVE to look · E to interact · RIGHT-CLICK / P for phone focus
        </span>
      </div>

      {/* 6. DOCKED SMARTPHONE ASSISTANT (Bottom-Right Corner) */}
      <DockedPhoneAssistant
        isOpen={phoneOpen}
        onToggle={() => {
          setPhoneOpen((p) => !p);
          if (phoneOpen) requestLock();
          else unlockMouse();
        }}
        unlockedClues={unlockedClues}
      />

      {/* 7. EVIDENCE BOARD / MANILA CASE FILE MODAL */}
      <EvidenceBoardModal
        isOpen={caseFileOpen}
        onClose={() => setCaseFileOpen(false)}
        unlockedClues={unlockedClues}
      />

      {/* 8. INTERACTIVE DEVICE TERMINAL MODALS */}
      <InteractiveTerminalScreens
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onClueUnlocked={handleClueUnlocked}
        onCocoaBrewed={() => {
          setTutorialSteps((t) => ({ ...t, makeCocoa: true, takeMug: true }));
        }}
        onDeviceDisconnected={handleDeviceDisconnected}
        disconnectedDevices={disconnectedDevices}
      />

      {/* 9. ASK FOR HELP MODAL */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="font-bold font-mono text-sm text-emerald-400">Digital Assistant Help</h3>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p>
                <strong>Mission Objective:</strong> Match the triage tasks in your phone inbox to the correct machines in the building.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                <li>Walk to highlighted zones and press <strong className="text-white">E</strong> to interact.</li>
                <li>Press <strong className="text-white">P</strong> or <strong className="text-white">Right-Click</strong> anytime to check your phone messages.</li>
                <li>Click <strong className="text-white">Case file</strong> in the top left to see collected clues.</li>
                <li>Click <strong className="text-white">Exit lab</strong> in the top right to return to the question submission board.</li>
              </ul>
            </div>
            <div className="text-right pt-2">
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
