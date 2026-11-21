"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { TerminalModal } from "./TerminalModal";
import { DeviceContext, MissionState } from "./terminalEngine";
import { sfx } from "./audio";

const DEVICES: DeviceContext[] = [
  {
    id: "workstation",
    name: "Forensic Station",
    role: "Payload De-obfuscator & Memory Triage",
    ip: "192.168.1.45",
    hostname: "forensics-ws01",
    status: "warning",
    zone: "Forensics Lab",
  },
  {
    id: "server",
    name: "Core Auth Server",
    role: "Central Syslog & IAM Metadata Gateway",
    ip: "192.168.1.10",
    hostname: "server-core01",
    status: "compromised",
    zone: "Server Cold Room",
  },
  {
    id: "iot",
    name: "Rogue IoT Appliance",
    role: "Smart Office Gateway / Unauthorized Beacon",
    ip: "192.168.1.185",
    hostname: "iot-edge-node",
    status: "compromised",
    zone: "IoT Edge Lab",
  },
  {
    id: "ai-agent",
    name: "Agent Execution Node",
    role: "Generative Tool Calling Orchestrator",
    ip: "192.168.1.80",
    hostname: "ai-agent-core",
    status: "warning",
    zone: "Command Center",
  },
];

export function CyberLabScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [missionState, setMissionState] = useState<MissionState>({
    workstationAnalyzed: false,
    serverFirewalled: false,
    iotIsolated: false,
    aiAgentEnforced: false,
  });

  const [activeDevice, setActiveDevice] = useState<DeviceContext | null>(null);
  const [nearbyDevice, setNearbyDevice] = useState<DeviceContext | null>(null);
  const [, setDeviceList] = useState<DeviceContext[]>(DEVICES);
  const [showVictory, setShowVictory] = useState(false);

  // References for live 3D animation loop
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.75, 4));
  const keysRef = useRef<{ [k: string]: boolean }>({});
  const deviceMeshesRef = useRef<{ [id: string]: THREE.Group }>({});
  const alertLightsRef = useRef<{ [id: string]: THREE.PointLight }>({});

  // Sync devices status with mission state
  useEffect(() => {
    setDeviceList((prev) =>
      prev.map((dev) => {
        if (dev.id === "workstation") {
          return { ...dev, status: missionState.workstationAnalyzed ? "secure" : "warning" };
        }
        if (dev.id === "server") {
          return { ...dev, status: missionState.serverFirewalled ? "secure" : "compromised" };
        }
        if (dev.id === "iot") {
          return { ...dev, status: missionState.iotIsolated ? "secure" : "compromised" };
        }
        if (dev.id === "ai-agent") {
          return { ...dev, status: missionState.aiAgentEnforced ? "secure" : "warning" };
        }
        return dev;
      })
    );

    const isAllComplete =
      missionState.workstationAnalyzed &&
      missionState.serverFirewalled &&
      missionState.iotIsolated &&
      missionState.aiAgentEnforced;

    if (isAllComplete) {
      setShowVictory(true);
      sfx.successChime();
    }
  }, [missionState]);

  // Open active device modal
  const handleOpenTerminal = useCallback((device: DeviceContext) => {
    setActiveDevice(device);
    sfx.terminalBeep(800);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === "e" && nearbyDevice && !activeDevice) {
        handleOpenTerminal(nearbyDevice);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [nearbyDevice, activeDevice, handleOpenTerminal]);

  // Three.js Setup & Lifecycle
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#070b0e");
    scene.fog = new THREE.FogExp2("#070b0e", 0.024);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 16, 22);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 3. Ambient & Directional Cyber Lighting
    const ambientLight = new THREE.AmbientLight("#1a2a32", 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight("#4ade80", 1.2);
    dirLight.position.set(10, 24, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    scene.add(dirLight);

    const centerGlow = new THREE.PointLight("#38bdf8", 2, 18);
    centerGlow.position.set(0, 3, 0);
    scene.add(centerGlow);

    // 4. Floor Grid & Facility Layout
    const floorGeo = new THREE.PlaneGeometry(44, 44);
    const floorMat = new THREE.MeshStandardMaterial({
      color: "#091013",
      roughness: 0.35,
      metalness: 0.8,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid helper on floor
    const gridHelper = new THREE.GridHelper(44, 44, "#10b981", "#162726");
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Facility Wall Perimeter
    const wallMat = new THREE.MeshStandardMaterial({
      color: "#111b21",
      roughness: 0.7,
      metalness: 0.4,
    });
    const wallGeoH = new THREE.BoxGeometry(44, 3, 0.8);
    const wallGeoV = new THREE.BoxGeometry(0.8, 3, 44);

    const wallNorth = new THREE.Mesh(wallGeoH, wallMat);
    wallNorth.position.set(0, 1.5, -22);
    scene.add(wallNorth);

    const wallSouth = new THREE.Mesh(wallGeoH, wallMat);
    wallSouth.position.set(0, 1.5, 22);
    scene.add(wallSouth);

    const wallWest = new THREE.Mesh(wallGeoV, wallMat);
    wallWest.position.set(-22, 1.5, 0);
    scene.add(wallWest);

    const wallEast = new THREE.Mesh(wallGeoV, wallMat);
    wallEast.position.set(22, 1.5, 0);
    scene.add(wallEast);

    // Room Divider Partitions
    const dividerMat = new THREE.MeshStandardMaterial({
      color: "#15242b",
      roughness: 0.6,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    const div1 = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 0.4), dividerMat);
    div1.position.set(-14, 1.25, 0);
    scene.add(div1);

    const div2 = new THREE.Mesh(new THREE.BoxGeometry(14, 2.5, 0.4), dividerMat);
    div2.position.set(14, 1.25, 0);
    scene.add(div2);

    // Central Holo-Table in Command Center
    const holoTableGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.8, 16);
    const holoTableMat = new THREE.MeshStandardMaterial({ color: "#1b2e36", metalness: 0.8, roughness: 0.2 });
    const holoTable = new THREE.Mesh(holoTableGeo, holoTableMat);
    holoTable.position.set(0, 0.4, 0);
    holoTable.receiveShadow = true;
    holoTable.castShadow = true;
    scene.add(holoTable);

    // Rotating wireframe globe above holo-table
    const globeGeo = new THREE.SphereGeometry(1.1, 16, 12);
    const globeMat = new THREE.MeshBasicMaterial({ color: "#38bdf8", wireframe: true });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(0, 1.8, 0);
    scene.add(globe);

    // 5. Build 3D Interactive Device Objects

    // DEVICE 1: Forensic Workstation (x: -12, z: -8)
    const wsGroup = new THREE.Group();
    wsGroup.position.set(-12, 0, -8);
    const deskGeo = new THREE.BoxGeometry(3.6, 0.8, 1.8);
    const deskMat = new THREE.MeshStandardMaterial({ color: "#1a252c", metalness: 0.5, roughness: 0.4 });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.y = 0.4;
    deskMesh.castShadow = true;
    deskMesh.receiveShadow = true;
    wsGroup.add(deskMesh);

    // Monitors
    const monGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
    const monMat = new THREE.MeshBasicMaterial({ color: "#10b981" });
    const mon1 = new THREE.Mesh(monGeo, monMat);
    mon1.position.set(-0.7, 1.2, 0.2);
    mon1.rotation.y = 0.2;
    wsGroup.add(mon1);

    const mon2 = new THREE.Mesh(monGeo, monMat);
    mon2.position.set(0.7, 1.2, 0.2);
    mon2.rotation.y = -0.2;
    wsGroup.add(mon2);

    const wsAlertLight = new THREE.PointLight("#f59e0b", 1.8, 6);
    wsAlertLight.position.set(0, 2, 0);
    wsGroup.add(wsAlertLight);
    alertLightsRef.current["workstation"] = wsAlertLight;

    scene.add(wsGroup);
    deviceMeshesRef.current["workstation"] = wsGroup;

    // DEVICE 2: Server Rack Array (x: 12, z: -8)
    const serverGroup = new THREE.Group();
    serverGroup.position.set(12, 0, -8);

    for (let i = -1; i <= 1; i++) {
      const rackGeo = new THREE.BoxGeometry(1.2, 3.8, 1.4);
      const rackMat = new THREE.MeshStandardMaterial({ color: "#0d161a", roughness: 0.4, metalness: 0.8 });
      const rack = new THREE.Mesh(rackGeo, rackMat);
      rack.position.set(i * 1.5, 1.9, 0);
      rack.castShadow = true;
      rack.receiveShadow = true;
      serverGroup.add(rack);

      // LED Blinker lines
      for (let j = 0; j < 6; j++) {
        const ledGeo = new THREE.BoxGeometry(0.8, 0.1, 0.05);
        const ledMat = new THREE.MeshBasicMaterial({ color: "#ef4444" });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(i * 1.5, 0.8 + j * 0.5, 0.72);
        serverGroup.add(led);
      }
    }

    const serverAlertLight = new THREE.PointLight("#ef4444", 2.2, 8);
    serverAlertLight.position.set(0, 2.5, 1);
    serverGroup.add(serverAlertLight);
    alertLightsRef.current["server"] = serverAlertLight;

    scene.add(serverGroup);
    deviceMeshesRef.current["server"] = serverGroup;

    // DEVICE 3: Rogue IoT Smart Appliance (x: -12, z: 10)
    const iotGroup = new THREE.Group();
    iotGroup.position.set(-12, 0, 10);

    const iotPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.9, 16), deskMat);
    iotPedestal.position.y = 0.45;
    iotPedestal.castShadow = true;
    iotGroup.add(iotPedestal);

    // Glowing printer/thermostat hub
    const hubMesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 0.9), new THREE.MeshStandardMaterial({ color: "#263339", metalness: 0.9 }));
    hubMesh.position.y = 1.1;
    hubMesh.castShadow = true;
    iotGroup.add(hubMesh);

    // Pulsing antenna beacon
    const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
    const beaconMesh = new THREE.Mesh(beaconGeo, new THREE.MeshBasicMaterial({ color: "#ef4444" }));
    beaconMesh.position.set(0.3, 1.6, 0.2);
    iotGroup.add(beaconMesh);

    const iotAlertLight = new THREE.PointLight("#ef4444", 2.0, 7);
    iotAlertLight.position.set(0, 1.8, 0);
    iotGroup.add(iotAlertLight);
    alertLightsRef.current["iot"] = iotAlertLight;

    scene.add(iotGroup);
    deviceMeshesRef.current["iot"] = iotGroup;

    // DEVICE 4: AI Agent Node (x: 12, z: 10)
    const aiGroup = new THREE.Group();
    aiGroup.position.set(12, 0, 10);

    const aiPodGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.6, 16);
    const aiPod = new THREE.Mesh(aiPodGeo, deskMat);
    aiPod.position.y = 0.3;
    aiPod.castShadow = true;
    aiGroup.add(aiPod);

    // Floating neural ring
    const ringGeo = new THREE.TorusGeometry(0.85, 0.12, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: "#a855f7", emissive: "#7e22ce", roughness: 0.2 });
    const neuralRing = new THREE.Mesh(ringGeo, ringMat);
    neuralRing.position.y = 1.6;
    neuralRing.rotation.x = Math.PI / 3;
    aiGroup.add(neuralRing);

    const aiAlertLight = new THREE.PointLight("#a855f7", 1.8, 6);
    aiAlertLight.position.set(0, 1.8, 0);
    aiGroup.add(aiAlertLight);
    alertLightsRef.current["ai-agent"] = aiAlertLight;

    scene.add(aiGroup);
    deviceMeshesRef.current["ai-agent"] = aiGroup;

    // 6. Tactical Operative (Player Avatar)
    const playerGroup = new THREE.Group();
    playerGroup.position.copy(playerPosRef.current);

    // Chassis body
    const bodyGeo = new THREE.CapsuleGeometry(0.4, 0.7, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: "#059669", metalness: 0.6, roughness: 0.3 });
    const playerBody = new THREE.Mesh(bodyGeo, bodyMat);
    playerBody.position.y = 0.65;
    playerBody.castShadow = true;
    playerGroup.add(playerBody);

    // Visor
    const visorGeo = new THREE.BoxGeometry(0.4, 0.15, 0.2);
    const visorMat = new THREE.MeshBasicMaterial({ color: "#34d399" });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.85, 0.32);
    playerGroup.add(visor);

    // Flashlight beam
    const spotLight = new THREE.SpotLight("#6ee7b7", 2.5, 12, Math.PI / 6, 0.3);
    spotLight.position.set(0, 0.8, 0.2);
    spotLight.target.position.set(0, 0, 5);
    playerGroup.add(spotLight);
    playerGroup.add(spotLight.target);

    scene.add(playerGroup);

    // 7. Ambient Particle Motes (Data Dust)
    const moteGeo = new THREE.BufferGeometry();
    const moteCount = 180;
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount * 3; i += 3) {
      motePositions[i] = (Math.random() - 0.5) * 40;
      motePositions[i + 1] = Math.random() * 6;
      motePositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    moteGeo.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
    const moteMat = new THREE.PointsMaterial({ color: "#10b981", size: 0.08, transparent: true, opacity: 0.55 });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    // 8. Animation & Movement Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate central holographic globe & AI neural ring
      globe.rotation.y += delta * 0.45;
      globe.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      neuralRing.rotation.z += delta * 1.2;
      neuralRing.rotation.y += delta * 0.6;

      // Pulse alert lights according to status
      const pulse = 1.0 + Math.sin(elapsed * 5) * 0.45;
      if (alertLightsRef.current["server"]) {
        alertLightsRef.current["server"].intensity = missionState.serverFirewalled ? 1.0 : 2.2 * pulse;
        alertLightsRef.current["server"].color.set(missionState.serverFirewalled ? "#10b981" : "#ef4444");
      }
      if (alertLightsRef.current["iot"]) {
        alertLightsRef.current["iot"].intensity = missionState.iotIsolated ? 0.6 : 2.0 * pulse;
        alertLightsRef.current["iot"].color.set(missionState.iotIsolated ? "#10b981" : "#ef4444");
      }
      if (alertLightsRef.current["workstation"]) {
        alertLightsRef.current["workstation"].color.set(missionState.workstationAnalyzed ? "#10b981" : "#f59e0b");
      }
      if (alertLightsRef.current["ai-agent"]) {
        alertLightsRef.current["ai-agent"].color.set(missionState.aiAgentEnforced ? "#10b981" : "#a855f7");
      }

      // Handle Player Movement (WASD / Arrows)
      const moveSpeed = 7.0 * delta;
      let moveX = 0;
      let moveZ = 0;

      const keys = keysRef.current;
      if (keys["w"] || keys["arrowup"]) moveZ -= 1;
      if (keys["s"] || keys["arrowdown"]) moveZ += 1;
      if (keys["a"] || keys["arrowleft"]) moveX -= 1;
      if (keys["d"] || keys["arrowright"]) moveX += 1;

      if (moveX !== 0 || moveZ !== 0) {
        const length = Math.hypot(moveX, moveZ);
        const dx = (moveX / length) * moveSpeed;
        const dz = (moveZ / length) * moveSpeed;

        const nextX = playerGroup.position.x + dx;
        const nextZ = playerGroup.position.z + dz;

        // Wall boundary collision clamping (-19.5 to 19.5)
        if (Math.abs(nextX) < 19.5) playerGroup.position.x = nextX;
        if (Math.abs(nextZ) < 19.5) playerGroup.position.z = nextZ;

        // Rotate player towards movement direction
        const targetRot = Math.atan2(dx, dz);
        playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, targetRot, 0.2);

        // Footstep tick sound
        if (Math.random() < 0.08) sfx.footstep();
      }

      playerPosRef.current.copy(playerGroup.position);

      // Smooth Camera Follow
      const targetCamX = playerGroup.position.x;
      const targetCamY = playerGroup.position.y + 13;
      const targetCamZ = playerGroup.position.z + 15;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.06);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.06);
      camera.lookAt(playerGroup.position.x, 0.8, playerGroup.position.z);

      // Check Proximity to Devices (Interactive Trigger Zone)
      let foundNearby: DeviceContext | null = null;
      for (const dev of DEVICES) {
        const mesh = deviceMeshesRef.current[dev.id];
        if (mesh) {
          const dist = playerGroup.position.distanceTo(mesh.position);
          if (dist < 4.2) {
            foundNearby = dev;
            break;
          }
        }
      }
      setNearbyDevice(foundNearby);

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
  }, [missionState]);

  const completedCount =
    (missionState.workstationAnalyzed ? 1 : 0) +
    (missionState.serverFirewalled ? 1 : 0) +
    (missionState.iotIsolated ? 1 : 0) +
    (missionState.aiAgentEnforced ? 1 : 0);

  const postureScore = completedCount * 25;

  return (
    <div className="relative w-full h-[620px] sm:h-[720px] rounded-xl overflow-hidden border border-emerald-950/80 bg-[#070b0e] select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Facility Map & Radar HUD */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 pointer-events-none">
        <div className="px-3 py-2 rounded-lg bg-[#0a1215]/85 border border-emerald-800/40 backdrop-blur-md text-emerald-400 font-mono text-xs shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[11px]">DEFENSE ARENA · 3D FACILITY</span>
          </div>
          <div className="text-[10px] text-zinc-400">TBFC Security HQ · Wareville Division</div>
        </div>

        {/* Tactical Mini-Radar */}
        <div className="relative w-28 h-28 rounded-lg border border-emerald-900/60 bg-[#070d0f]/90 overflow-hidden shadow-inner p-1.5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
          <div className="relative w-full h-full border border-emerald-950/60 rounded flex items-center justify-center">
            {/* Center crosshair */}
            <div className="absolute w-full h-[1px] bg-emerald-950/40" />
            <div className="absolute h-full w-[1px] bg-emerald-950/40" />
            {/* Player Blip */}
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/80 ring-2 ring-emerald-900/60 animate-ping absolute" />
            <div className="w-2 h-2 rounded-full bg-emerald-300 absolute" />
            {/* Device Blips */}
            <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${missionState.workstationAnalyzed ? "bg-emerald-500" : "bg-amber-400"}`} title="Forensic Workstation" />
            <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${missionState.serverFirewalled ? "bg-emerald-500" : "bg-red-500"}`} title="Server Core" />
            <div className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${missionState.iotIsolated ? "bg-emerald-500" : "bg-red-500"}`} title="IoT Hub" />
            <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ${missionState.aiAgentEnforced ? "bg-emerald-500" : "bg-purple-400"}`} title="AI Agent" />
          </div>
        </div>
      </div>

      {/* Top Right: Mission Objectives Checklist */}
      <div className="absolute top-3 right-3 z-30 w-72 sm:w-80 flex flex-col gap-2">
        <div className="p-3 rounded-lg bg-[#0a1215]/90 border border-emerald-800/40 backdrop-blur-md text-xs font-mono text-zinc-300 shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-950/80 pb-1.5 mb-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
              Incident Response Checklist
            </span>
            <span className="font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 rounded px-1.5 py-0.5 text-[10px]">
              {postureScore}% SECURE
            </span>
          </div>

          <ul className="space-y-1.5 text-[11px]">
            <li className={`flex items-start gap-2 ${missionState.workstationAnalyzed ? "text-emerald-400 line-through opacity-80" : "text-zinc-300"}`}>
              <span>{missionState.workstationAnalyzed ? "✔" : "◻"}</span>
              <span>1. Triage Workstation & decode base64 reverse shell</span>
            </li>
            <li className={`flex items-start gap-2 ${missionState.serverFirewalled ? "text-emerald-400 line-through opacity-80" : "text-zinc-300"}`}>
              <span>{missionState.serverFirewalled ? "✔" : "◻"}</span>
              <span>2. Inspect Server syslog & firewall attacker C2 (10.10.42.99)</span>
            </li>
            <li className={`flex items-start gap-2 ${missionState.iotIsolated ? "text-emerald-400 line-through opacity-80" : "text-zinc-300"}`}>
              <span>{missionState.iotIsolated ? "✔" : "◻"}</span>
              <span>3. Disconnect compromised IoT Wi-Fi beacon</span>
            </li>
            <li className={`flex items-start gap-2 ${missionState.aiAgentEnforced ? "text-emerald-400 line-through opacity-80" : "text-zinc-300"}`}>
              <span>{missionState.aiAgentEnforced ? "✔" : "◻"}</span>
              <span>4. Enforce deterministic Zod AST schema on AI Agent</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Center Screen: Interactive Proximity Floating Prompt */}
      {nearbyDevice && !activeDevice && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-auto">
          <button
            type="button"
            onClick={() => handleOpenTerminal(nearbyDevice)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold font-mono text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/30 border border-emerald-300 transition-all cursor-pointer"
          >
            <span className="bg-black text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono font-extrabold">
              [E]
            </span>
            <span>Access {nearbyDevice.name} ({nearbyDevice.hostname})</span>
          </button>
        </div>
      )}

      {/* Bottom Left: Controls Help Banner */}
      <div className="absolute bottom-3 left-3 z-30 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#080d0e]/80 border border-zinc-800/80 font-mono text-[11px] text-zinc-400 pointer-events-none">
        <span>Controls:</span>
        <span className="text-emerald-400 font-bold">[W][A][S][D] / Arrows</span>
        <span>to move ·</span>
        <span className="text-emerald-400 font-bold">[E]</span>
        <span>to interact ·</span>
        <span className="text-emerald-400 font-bold">[ESC]</span>
        <span>close console</span>
      </div>

      {/* Interactive In-Browser Terminal Modal */}
      {activeDevice && (
        <TerminalModal
          device={activeDevice}
          missionState={missionState}
          onMissionStateChange={(newState) => setMissionState(newState)}
          onClose={() => setActiveDevice(null)}
        />
      )}

      {/* Victory Celebration Modal */}
      {showVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-emerald-500 bg-[#0a1416] text-center font-mono shadow-2xl shadow-emerald-500/20">
            <div className="text-4xl mb-3">🛡️</div>
            <h2 className="text-2xl font-extrabold text-emerald-400 tracking-wider mb-2 uppercase">
              Facility Contained!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm mb-4 leading-relaxed">
              Outstanding work, Incident Commander. All adversarial footholds, rogue IoT beacons, IMDS metadata leaks, and probabilistic prompt injection bypasses have been neutralized.
            </p>

            <div className="grid grid-cols-2 gap-2 my-4 text-xs">
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50">
                <span className="block text-zinc-400 text-[10px]">INCIDENT POSTURE</span>
                <span className="font-bold text-emerald-400 text-base">100% SECURE</span>
              </div>
              <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/50">
                <span className="block text-zinc-400 text-[10px]">DEFENSE RATING</span>
                <span className="font-bold text-emerald-400 text-base">ZERO TRUST A+</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVictory(false)}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Return to 3D Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
