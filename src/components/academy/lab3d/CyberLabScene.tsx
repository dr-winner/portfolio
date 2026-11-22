"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { InGamePhone } from "./InGamePhone";
import { TerminalModal } from "./TerminalModal";
import { DeviceContext, MissionState } from "./terminalEngine";
import { INITIAL_EMAILS, EmailMessage, CaseFileClue } from "./snowtrailData";
import { sfx } from "./audio";

interface InteractiveObject {
  id: string;
  name: string;
  type: "terminal" | "desk-qr" | "iot" | "embedded";
  position: THREE.Vector3;
  meshGroup?: THREE.Group;
  promptText: string;
  isDisconnected?: boolean;
}

export function CyberLabScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  // --- GAME STATE ---
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [activeEmailId, setActiveEmailId] = useState<string>("email-1");
  const [phoneOpen, setPhoneOpen] = useState<boolean>(true);
  const phoneOpenRef = useRef<boolean>(true);
  phoneOpenRef.current = phoneOpen;
  const [activePhoneApp, setActivePhoneApp] = useState<"email" | "tasks" | "casefile">("email");

  const [clues, setClues] = useState<Record<string, CaseFileClue>>({
    surveillance: {
      id: "surveillance",
      label: "Intruder Point of Origin",
      value: null,
      solved: false,
      deviceSource: "High-Performance Workstation",
    },
    ip: {
      id: "ip",
      label: "Attacker External C2 IP",
      value: null,
      solved: false,
      deviceSource: "Server Room Logging Cluster",
    },
    alias: {
      id: "alias",
      label: "Intruder Handle Alias",
      value: null,
      solved: false,
      deviceSource: "Meeting Room Laptop Profile",
    },
    serial: {
      id: "serial",
      label: "Physical Desk QR Serial",
      value: null,
      solved: false,
      deviceSource: "McSkidy Desk Case File QR",
    },
    perimeter: {
      id: "perimeter",
      label: "Office Perimeter Status",
      value: null,
      solved: false,
      deviceSource: "Isolated Wi-Fi IoT Appliances",
    },
  });

  const [iotStatus, setIotStatus] = useState({
    thermostat: { name: "Smart Thermostat", isIoT: true, isDisconnected: false },
    printer: { name: "Office Network Printer", isIoT: true, isDisconnected: false },
    speaker: { name: "Smart Voice Assistant", isIoT: true, isDisconnected: false },
    coffeeMaker: { name: "Standard Coffee Maker", isIoT: false, isDisconnected: false },
    wallClock: { name: "Digital Wall Clock", isIoT: false, isDisconnected: false },
  });

  // Terminal pop-up context (when interacting with a computer in first person)
  const [activeDevice, setActiveDevice] = useState<DeviceContext | null>(null);
  const activeDeviceRef = useRef<DeviceContext | null>(null);
  activeDeviceRef.current = activeDevice;
  const [missionState, setMissionState] = useState<MissionState>({
    workstationAnalyzed: false,
    serverFirewalled: false,
    iotIsolated: false,
    aiAgentEnforced: false,
  });

  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [lookTarget, setLookTarget] = useState<InteractiveObject | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ text: string; type: "success" | "warn" | "error" } | null>(null);

  // References for live 60fps render loop & first-person movement
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const keysRef = useRef<{ [k: string]: boolean }>({});
  const mouseMoveRef = useRef<{ movementX: number; movementY: number }>({ movementX: 0, movementY: 0 });
  const eulerRef = useRef<THREE.Euler>(new THREE.Euler(0, 0, 0, "YXZ"));
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 6)); // Standing eye-height 1.6m
  const interactiveObjectsRef = useRef<InteractiveObject[]>([]);

  // Trigger brief feedback toast on HUD
  const triggerToast = (text: string, type: "success" | "warn" | "error" = "success") => {
    setFeedbackToast({ text, type });
    setTimeout(() => setFeedbackToast(null), 3800);
  };

  // Dispatch task from in-game phone
  const handleDispatchTask = (email: EmailMessage) => {
    sfx.terminalBeep(920);

    // Mark current email read
    setEmails((prev) =>
      prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e))
    );

    if (email.taskType === "workstation") {
      triggerToast("Job dispatched to Forensics Workstation! Walk over to render frames.", "success");
    } else if (email.taskType === "server") {
      triggerToast("Log query pushed to Server Room cluster! Access server terminal to execute.", "success");
    } else if (email.taskType === "laptop") {
      triggerToast("Portable Laptop mounted for Meeting Room triage. Check meeting room desk.", "success");
    } else if (email.taskType === "qr") {
      triggerToast("Phone camera activated! Look at the QR sticker on McSkidy's desk.", "success");
    } else if (email.taskType === "iot") {
      triggerToast("Emergency containment started! Find and click to disconnect rogue IoT devices.", "warn");
    }
  };

  // Interact with targeted object via Left Click or E
  const handleInteract = useCallback(
    (target: InteractiveObject) => {
      sfx.keyClick();

      if (target.id === "workstation") {
        setActiveDevice({
          id: "workstation",
          name: "High-Performance Workstation",
          role: "Surveillance Image Frame Rendering & Forensic Compute",
          ip: "192.168.1.45",
          hostname: "forensics-ws01",
          status: clues.surveillance.solved ? "secure" : "warning",
          zone: "Forensics Lab",
        });
      } else if (target.id === "server") {
        setActiveDevice({
          id: "server",
          name: "Core Server Cluster",
          role: "Central Network Connection Syslog",
          ip: "192.168.1.10",
          hostname: "server-core01",
          status: clues.ip.solved ? "secure" : "compromised",
          zone: "Server Cold Room",
        });
      } else if (target.id === "laptop") {
        // Meeting room laptop triage
        setClues((prev) => ({
          ...prev,
          alias: { ...prev.alias, solved: true, value: "Grinch_H4x0r" },
        }));
        setEmails((prev) =>
          prev.map((e) => (e.id === "email-3" ? { ...e, isCompleted: true } : e))
        );
        sfx.successChime();
        triggerToast("Meeting room browser profile triaged! Attacker alias: Grinch_H4x0r", "success");
      } else if (target.id === "desk-qr") {
        // Physical QR code on desk
        setClues((prev) => ({
          ...prev,
          serial: { ...prev.serial, solved: true, value: "SNOW-TRL-9941-X" },
        }));
        setEmails((prev) =>
          prev.map((e) => (e.id === "email-4" ? { ...e, isCompleted: true } : e))
        );
        sfx.successChime();
        triggerToast("QR Code successfully scanned via camera! Serial: SNOW-TRL-9941-X", "success");
      } else if (target.type === "iot") {
        // Disconnecting IoT device
        if (target.id === "thermostat") {
          setIotStatus((prev) => ({ ...prev, thermostat: { ...prev.thermostat, isDisconnected: true } }));
          triggerToast("Smart Thermostat disconnected from office Wi-Fi!", "success");
        } else if (target.id === "printer") {
          setIotStatus((prev) => ({ ...prev, printer: { ...prev.printer, isDisconnected: true } }));
          triggerToast("Office Network Printer disconnected from office Wi-Fi!", "success");
        } else if (target.id === "speaker") {
          setIotStatus((prev) => ({ ...prev, speaker: { ...prev.speaker, isDisconnected: true } }));
          triggerToast("Smart Voice Speaker disconnected from office Wi-Fi!", "success");
        }
        sfx.alertTone();
      } else if (target.type === "embedded") {
        // Trap device! Standalone embedded machines
        triggerToast("CAUTION: This is a standalone embedded device (no Wi-Fi)! Leave it connected.", "warn");
        sfx.terminalBeep(420);
      }
    },
    [clues.surveillance.solved, clues.ip.solved]
  );

  // Sync terminal actions with clue completions
  const handleMissionStateChange = (newMissionState: MissionState) => {
    setMissionState(newMissionState);

    if (newMissionState.workstationAnalyzed && !clues.surveillance.solved) {
      setClues((prev) => ({
        ...prev,
        surveillance: { ...prev.surveillance, solved: true, value: "Wareville Northern Substation" },
      }));
      setEmails((prev) =>
        prev.map((e) => (e.id === "email-1" ? { ...e, isCompleted: true } : e))
      );
    }

    if (newMissionState.serverFirewalled && !clues.ip.solved) {
      setClues((prev) => ({
        ...prev,
        ip: { ...prev.ip, solved: true, value: "10.10.42.99" },
      }));
      setEmails((prev) =>
        prev.map((e) => (e.id === "email-2" ? { ...e, isCompleted: true } : e))
      );
    }
  };

  // Evaluate victory conditions
  useEffect(() => {
    const allIoTDisconnected =
      iotStatus.thermostat.isDisconnected &&
      iotStatus.printer.isDisconnected &&
      iotStatus.speaker.isDisconnected;

    if (allIoTDisconnected && !clues.perimeter.solved) {
      setClues((prev) => ({
        ...prev,
        perimeter: { ...prev.perimeter, solved: true, value: "Network Perimeter Contained" },
      }));
      setEmails((prev) =>
        prev.map((e) => (e.id === "email-5" ? { ...e, isCompleted: true } : e))
      );
    }

    const allCluesFound =
      clues.surveillance.solved &&
      clues.ip.solved &&
      clues.alias.solved &&
      clues.serial.solved &&
      allIoTDisconnected;

    if (allCluesFound && !showVictory) {
      setShowVictory(true);
      sfx.successChime();
    }
  }, [clues, iotStatus, showVictory]);

  // Keyboard & Pointer Lock Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;

      // P toggles handheld smartphone
      if (key === "p") {
        e.preventDefault();
        setPhoneOpen((prev) => !prev);
        sfx.terminalBeep(740);
      }

      // E interacts with target
      if (key === "e" && lookTarget && !activeDevice) {
        handleInteract(lookTarget);
      }

      // Escape closes terminal or phone
      if (e.key === "Escape") {
        if (activeDevice) {
          setActiveDevice(null);
        } else if (phoneOpen) {
          setPhoneOpen(false);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Right Click toggles phone like in TryHackMe Snow Trail
      e.preventDefault();
      setPhoneOpen((prev) => !prev);
      sfx.terminalBeep(740);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        mouseMoveRef.current.movementX += e.movementX;
        mouseMoveRef.current.movementY += e.movementY;
      }
    };

    const handlePointerLockChange = () => {
      setIsPointerLocked(!!document.pointerLockElement);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [lookTarget, activeDevice, phoneOpen, handleInteract]);

  // Click canvas to request Pointer Lock
  const handleCanvasClick = () => {
    if (activeDevice || phoneOpen) return;
    const canvas = mountRef.current?.querySelector("canvas");
    if (canvas && document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
    }
    if (lookTarget) {
      handleInteract(lookTarget);
    }
  };

  // --- 3D FIRST-PERSON SCENE SETUP ---
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0c151a");
    scene.fog = new THREE.FogExp2("#0c151a", 0.035);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.copy(playerPosRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 2. Realistic Office Lighting
    const ambientLight = new THREE.AmbientLight("#22333b", 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#e0f2fe", 1.6);
    sunLight.position.set(12, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 3. Office Architecture: Floor, Walls, Rooms
    // Wooden / Carpet Tiles Floor
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({ color: "#162026", roughness: 0.6, metalness: 0.2 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid runner
    const grid = new THREE.GridHelper(36, 36, "#10b981", "#1e293b");
    grid.position.y = 0.01;
    scene.add(grid);

    // Outer Perimeter Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.8 });
    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      wall.position.set(x, y, z);
      wall.receiveShadow = true;
      scene.add(wall);
      return wall;
    };

    createWall(36, 4, 0.6, 0, 2, -18); // North Wall
    createWall(36, 4, 0.6, 0, 2, 18);  // South Wall
    createWall(0.6, 4, 36, -18, 2, 0); // West Wall
    createWall(0.6, 4, 36, 18, 2, 0);  // East Wall

    // Room Partitions: Server Room (North-East), Meeting Room (North-West), Breakroom (South-West)
    createWall(14, 4, 0.4, 11, 2, -6); // Server room wall
    createWall(0.4, 4, 12, 4, 2, -12); // Server room glass door division

    createWall(14, 4, 0.4, -11, 2, -6); // Meeting room wall
    createWall(0.4, 4, 12, -4, 2, -12); // Meeting room side wall

    // Ceiling lights
    const officeLights = [
      { x: 0, z: 4 },
      { x: 10, z: -12 },
      { x: -10, z: -12 },
      { x: -10, z: 8 },
    ];
    officeLights.forEach((pos) => {
      const pl = new THREE.PointLight("#38bdf8", 1.8, 14);
      pl.position.set(pos.x, 3.5, pos.z);
      scene.add(pl);
    });

    const interactiveList: InteractiveObject[] = [];

    // --- OBJECT 1: McSkidy's Main Desk & Case File QR Sticker (x: 0, z: 4) ---
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, 4);

    const deskTable = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.8, 1.6),
      new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.4 })
    );
    deskTable.position.y = 0.4;
    deskTable.castShadow = true;
    deskTable.receiveShadow = true;
    deskGroup.add(deskTable);

    // Case file folder with physical QR sticker
    const folderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.04, 0.7),
      new THREE.MeshStandardMaterial({ color: "#f59e0b" })
    );
    folderMesh.position.set(0.6, 0.82, 0.1);
    deskGroup.add(folderMesh);

    // QR sticker
    const qrMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.24),
      new THREE.MeshBasicMaterial({ color: "#ffffff" })
    );
    qrMesh.rotation.x = -Math.PI / 2;
    qrMesh.position.set(0.6, 0.85, 0.1);
    deskGroup.add(qrMesh);

    scene.add(deskGroup);

    interactiveList.push({
      id: "desk-qr",
      name: "McSkidy's Case File (QR Sticker)",
      type: "desk-qr",
      position: new THREE.Vector3(0.6, 0.85, 4.1),
      promptText: "Left-Click / [E] to Scan QR Code with Phone Camera",
    });

    // --- OBJECT 2: Forensics High-Performance Workstation (x: 10, z: 6) ---
    const wsGroup = new THREE.Group();
    wsGroup.position.set(10, 0, 6);

    const wsDesk = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.8, 1.6),
      new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.3 })
    );
    wsDesk.position.y = 0.4;
    wsGroup.add(wsDesk);

    // Tower Computer Chassis
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.1, 0.8),
      new THREE.MeshStandardMaterial({ color: "#0284c7", metalness: 0.8 })
    );
    tower.position.set(1.1, 0.95, -0.2);
    wsGroup.add(tower);

    // Dual Monitors
    const screenGeo = new THREE.BoxGeometry(1.0, 0.65, 0.08);
    const screenMat = new THREE.MeshBasicMaterial({ color: "#10b981" });
    const s1 = new THREE.Mesh(screenGeo, screenMat);
    s1.position.set(-0.6, 1.2, 0);
    s1.rotation.y = 0.15;
    wsGroup.add(s1);

    const s2 = new THREE.Mesh(screenGeo, screenMat);
    s2.position.set(0.5, 1.2, 0);
    s2.rotation.y = -0.15;
    wsGroup.add(s2);

    scene.add(wsGroup);

    interactiveList.push({
      id: "workstation",
      name: "High-Performance Workstation",
      type: "terminal",
      position: new THREE.Vector3(10, 1.2, 6),
      promptText: "Left-Click / [E] to Access Forensic Image Workstation",
    });

    // --- OBJECT 3: Server Room Cluster & Terminal (x: 10, z: -12) ---
    const serverGroup = new THREE.Group();
    serverGroup.position.set(10, 0, -12);

    for (let i = -1; i <= 1; i++) {
      const rack = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 3.6, 1.4),
        new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.3, metalness: 0.8 })
      );
      rack.position.set(i * 1.8, 1.8, 0);
      rack.castShadow = true;
      serverGroup.add(rack);

      // Blinking rack LEDs
      for (let j = 0; j < 5; j++) {
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 0.08, 0.04),
          new THREE.MeshBasicMaterial({ color: "#38bdf8" })
        );
        led.position.set(i * 1.8, 0.8 + j * 0.5, 0.72);
        serverGroup.add(led);
      }
    }

    scene.add(serverGroup);

    interactiveList.push({
      id: "server",
      name: "Server Room Logging Cluster",
      type: "terminal",
      position: new THREE.Vector3(10, 1.8, -12),
      promptText: "Left-Click / [E] to Query 24/7 Network Logs",
    });

    // --- OBJECT 4: Meeting Room Portable Laptop (x: -10, z: -12) ---
    const meetingGroup = new THREE.Group();
    meetingGroup.position.set(-10, 0, -12);

    const conferenceTable = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.8, 24),
      new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.4 })
    );
    conferenceTable.position.y = 0.4;
    meetingGroup.add(conferenceTable);

    // Battery-powered laptop on conference table
    const laptopMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: "#94a3b8", metalness: 0.7 })
    );
    laptopMesh.position.set(0, 0.82, 0);
    meetingGroup.add(laptopMesh);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.04),
      new THREE.MeshBasicMaterial({ color: "#38bdf8" })
    );
    laptopScreen.position.set(0, 1.05, -0.25);
    laptopScreen.rotation.x = -0.2;
    meetingGroup.add(laptopScreen);

    scene.add(meetingGroup);

    interactiveList.push({
      id: "laptop",
      name: "Meeting Room Offline Laptop",
      type: "terminal",
      position: new THREE.Vector3(-10, 0.9, -12),
      promptText: "Left-Click / [E] to Extract Damaged Browser Profile",
    });

    // --- OBJECTS 5, 6, 7: IoT Devices (Thermostat, Printer, Voice Speaker) ---
    // 5A: Smart Thermostat mounted on north wall (x: 4, z: -17.6)
    const thermo = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: "#e11d48", emissive: "#881337" })
    );
    thermo.rotation.x = Math.PI / 2;
    thermo.position.set(4, 1.8, -17.6);
    scene.add(thermo);

    interactiveList.push({
      id: "thermostat",
      name: "Smart Thermostat (Wi-Fi IoT)",
      type: "iot",
      position: new THREE.Vector3(4, 1.8, -17.6),
      promptText: "Left-Click / [E] to Disconnect Rogue Smart Thermostat",
    });

    // 5B: Office Network Printer in hallway (x: -6, z: 2)
    const printerGroup = new THREE.Group();
    printerGroup.position.set(-6, 0, 2);
    const pStand = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 1.0), new THREE.MeshStandardMaterial({ color: "#1e293b" }));
    pStand.position.y = 0.35;
    printerGroup.add(pStand);
    const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.8), new THREE.MeshStandardMaterial({ color: "#cbd5e1" }));
    pBody.position.y = 0.95;
    printerGroup.add(pBody);
    scene.add(printerGroup);

    interactiveList.push({
      id: "printer",
      name: "Office Network Printer (Wi-Fi IoT)",
      type: "iot",
      position: new THREE.Vector3(-6, 0.95, 2),
      promptText: "Left-Click / [E] to Disconnect Network Printer",
    });

    // 5C: Smart Voice Speaker on side table (x: -12, z: 6)
    const speaker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16),
      new THREE.MeshStandardMaterial({ color: "#065f46", emissive: "#064e3b" })
    );
    speaker.position.set(-12, 0.9, 6);
    scene.add(speaker);

    interactiveList.push({
      id: "speaker",
      name: "Smart Voice Assistant (Wi-Fi IoT)",
      type: "iot",
      position: new THREE.Vector3(-12, 0.9, 6),
      promptText: "Left-Click / [E] to Disconnect Rogue Voice Speaker",
    });

    // --- TRAP OBJECTS: Standalone Embedded Electronics (No Wi-Fi) ---
    // Coffee Maker in Breakroom (x: -14, z: 12)
    const coffee = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.6, 0.4),
      new THREE.MeshStandardMaterial({ color: "#78350f" })
    );
    coffee.position.set(-14, 0.9, 12);
    scene.add(coffee);

    interactiveList.push({
      id: "coffeeMaker",
      name: "Standard Coffee Maker (Standalone Embedded)",
      type: "embedded",
      position: new THREE.Vector3(-14, 0.9, 12),
      promptText: "Inspect Standalone Coffee Maker (No Wi-Fi / Embedded)",
    });

    interactiveObjectsRef.current = interactiveList;

    // --- 4. 60FPS FIRST-PERSON ANIMATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Handle Mouse Look (Pointer Lock)
      if (document.pointerLockElement) {
        const sensitivity = 0.0022;
        eulerRef.current.y -= mouseMoveRef.current.movementX * sensitivity;
        eulerRef.current.x -= mouseMoveRef.current.movementY * sensitivity;

        // Clamp vertical pitch (-85 to +85 deg)
        eulerRef.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, eulerRef.current.x));
        camera.quaternion.setFromEuler(eulerRef.current);
      }
      mouseMoveRef.current = { movementX: 0, movementY: 0 };

      // Handle WASD First-Person Walking
      if (!activeDeviceRef.current && !phoneOpenRef.current) {
        const moveSpeed = 6.5 * delta;
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        right.y = 0;
        right.normalize();

        const moveVec = new THREE.Vector3();
        const keys = keysRef.current;
        if (keys["w"] || keys["arrowup"]) moveVec.add(forward);
        if (keys["s"] || keys["arrowdown"]) moveVec.sub(forward);
        if (keys["d"] || keys["arrowright"]) moveVec.add(right);
        if (keys["a"] || keys["arrowleft"]) moveVec.sub(right);

        if (moveVec.lengthSq() > 0) {
          moveVec.normalize().multiplyScalar(moveSpeed);
          playerPosRef.current.add(moveVec);

          // Office wall boundary clamping (-16.5 to 16.5)
          playerPosRef.current.x = Math.max(-16.5, Math.min(16.5, playerPosRef.current.x));
          playerPosRef.current.z = Math.max(-16.5, Math.min(16.5, playerPosRef.current.z));

          if (Math.random() < 0.08) sfx.footstep();
        }
      }

      camera.position.copy(playerPosRef.current);

      // Raycast or Proximity Check from Center Reticle to Interactive Nodes
      const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      let closestObj: InteractiveObject | null = null;
      let minAngle = 0.45; // ~26 degree viewing cone

      for (const obj of interactiveObjectsRef.current) {
        const toObj = new THREE.Vector3().subVectors(obj.position, camera.position);
        const dist = toObj.length();
        if (dist < 4.2) {
          toObj.normalize();
          const dot = cameraDir.dot(toObj);
          const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
          if (angle < minAngle) {
            minAngle = angle;
            closestObj = obj;
          }
        }
      }

      setLookTarget(closestObj);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={handleCanvasClick}
      className="relative w-full h-[640px] sm:h-[740px] rounded-2xl overflow-hidden border border-emerald-950/80 bg-[#070b0e] select-none cursor-crosshair"
    >
      {/* Reticle Crosshair (First-Person Center Screen) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
        <div
          className={`w-3.5 h-3.5 border-2 rounded-full transition-all duration-150 ${
            lookTarget
              ? "border-emerald-400 bg-emerald-400/40 scale-125"
              : "border-white/50 bg-transparent"
          }`}
        />
      </div>

      {/* Interactive Object Floating Interaction Banner */}
      {lookTarget && !activeDevice && !phoneOpen && (
        <div className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-black/85 border border-emerald-500 text-emerald-300 font-mono text-xs sm:text-sm font-bold shadow-xl backdrop-blur-md animate-bounce">
          <span className="bg-emerald-500 text-black px-1.5 py-0.5 rounded text-xs font-extrabold">
            [E] / Left-Click
          </span>
          <span>{lookTarget.promptText}</span>
        </div>
      )}

      {/* Top Left: Room Title & Pointer Lock Status */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-col gap-1 font-mono">
        <div className="px-3.5 py-2 rounded-xl bg-black/80 border border-emerald-800/40 backdrop-blur-md text-xs text-emerald-400 shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold uppercase tracking-wider text-[11px]">
            TBFC WAREVILLE OFFICE · 3D INVESTIGATION
          </span>
        </div>
        <div className="text-[10px] text-zinc-400 bg-black/60 px-2.5 py-1 rounded-md max-w-fit border border-zinc-800">
          {isPointerLocked ? "🎯 Mouse Lock Active (Press ESC to release)" : "🖱️ Click screen to enable first-person mouse look"}
        </div>
      </div>

      {/* Top Right: Clues Found Mini Badge & Phone Toggle Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 font-mono">
        <button
          type="button"
          onClick={() => {
            setPhoneOpen((prev) => !prev);
            sfx.terminalBeep(740);
          }}
          className={`px-3.5 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl backdrop-blur-md transition-all cursor-pointer ${
            phoneOpen
              ? "bg-emerald-500 text-black border-emerald-400"
              : "bg-black/80 text-emerald-400 border-emerald-800/60 hover:border-emerald-500"
          }`}
        >
          <span>📱 Phone Assistant [P / Right-Click]</span>
        </button>
      </div>

      {/* Bottom Center: Controls Reference Bar */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-black/75 border border-zinc-800 text-[11px] font-mono text-zinc-400 shadow-lg backdrop-blur-md">
        <span>Move: <strong className="text-emerald-400">[W][A][S][D]</strong></span>
        <span>·</span>
        <span>Look: <strong className="text-emerald-400">Mouse</strong></span>
        <span>·</span>
        <span>Phone: <strong className="text-emerald-400">[P] / Right-Click</strong></span>
        <span>·</span>
        <span>Interact: <strong className="text-emerald-400">[E] / Left-Click</strong></span>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackToast && (
        <div
          className={`pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-xl border font-mono text-xs font-bold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-200 ${
            feedbackToast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500 text-emerald-200"
              : feedbackToast.type === "warn"
                ? "bg-amber-950/90 border-amber-500 text-amber-200"
                : "bg-rose-950/90 border-rose-500 text-rose-200"
          }`}
        >
          {feedbackToast.text}
        </div>
      )}

      {/* In-Game Handheld Smartphone UI (TryHackMe Snowtrail 1:1) */}
      <InGamePhone
        isOpen={phoneOpen}
        onClose={() => setPhoneOpen(false)}
        activeApp={activePhoneApp}
        onChangeApp={(app) => setActivePhoneApp(app)}
        emails={emails}
        activeEmailId={activeEmailId}
        onSelectEmail={(id) => setActiveEmailId(id)}
        onDispatchTask={handleDispatchTask}
        clues={clues}
        iotStatus={iotStatus}
      />

      {/* Terminal Console Pop-Up (When accessing a computer terminal in person) */}
      {activeDevice && (
        <TerminalModal
          device={activeDevice}
          missionState={missionState}
          onMissionStateChange={handleMissionStateChange}
          onClose={() => setActiveDevice(null)}
        />
      )}

      {/* Mission Victory Modal */}
      {showVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-none animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-lg p-6 rounded-3xl border-2 border-emerald-500 bg-[#0a1418] text-center shadow-2xl shadow-emerald-500/30">
            <div className="text-5xl mb-3">🎄🏆</div>
            <h2 className="text-2xl font-black text-emerald-400 tracking-wider uppercase mb-1">
              Room Complete: Snow Trail Defended!
            </h2>
            <div className="text-xs text-emerald-600 font-bold mb-4">
              TBFC Offices in Wareville Fully Contained
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-5">
              Outstanding detective work, McSkidy. You successfully mapped every digital forensic artifact to its proper computing class, extracted all five critical dossier clues, and isolated the rogue IoT devices to prevent lateral network takeover.
            </p>

            <div className="grid grid-cols-2 gap-2 text-left text-xs mb-5 p-3 rounded-2xl bg-[#0e1c22] border border-emerald-950">
              <div>
                <span className="block text-[10px] text-zinc-400">1. ORIGIN CLUE</span>
                <span className="font-bold text-white text-[11px]">{clues.surveillance.value}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">2. ATTACKER IP</span>
                <span className="font-bold text-rose-400 text-[11px]">{clues.ip.value}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">3. INTRUDER ALIAS</span>
                <span className="font-bold text-amber-400 text-[11px]">{clues.alias.value}</span>
              </div>
              <div>
                <span className="block text-[10px] text-zinc-400">4. QR SERIAL</span>
                <span className="font-bold text-emerald-400 text-[11px]">{clues.serial.value}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVictory(false)}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              Continue Exploring Wareville Office
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
