import * as THREE from 'three';

export interface OfficeObjectTargets {
  cocoaStation: THREE.Object3D;
  mugObject: THREE.Object3D;
  workstation: THREE.Object3D;
  serverRack: THREE.Object3D;
  laptopMeeting: THREE.Object3D;
  archiveDesktop: THREE.Object3D;
  qrStickerDesk: THREE.Object3D;
  smartThermostat: THREE.Object3D;
  smartSnowman: THREE.Object3D;
  networkPrinter: THREE.Object3D;
  monitors: THREE.Mesh[];
}

export function buildSnowTrailOfficeScene(scene: THREE.Scene): OfficeObjectTargets {
  // Ground / Carpet Floor - Cozy beige office carpeting
  const floorGeo = new THREE.PlaneGeometry(36, 30);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xcdc4b5,
    roughness: 0.85,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling - Dark industrial ceiling with exposed wooden beams
  const ceilingGeo = new THREE.PlaneGeometry(36, 30);
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x222226,
    roughness: 0.9,
  });
  const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 5.2;
  scene.add(ceiling);

  // Walls Material - Warm cream painted drywall
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xe8e0d5,
    roughness: 0.8,
  });
  const accentWallMat = new THREE.MeshStandardMaterial({
    color: 0xd8ccbe,
    roughness: 0.75,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x5a3d28,
    roughness: 0.6,
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x3d281a,
    roughness: 0.65,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x2e3035,
    metalness: 0.8,
    roughness: 0.3,
  });
  const redChairMat = new THREE.MeshStandardMaterial({
    color: 0x9b1c28,
    roughness: 0.7,
  });
  const screenGlowMat = new THREE.MeshBasicMaterial({
    color: 0x0088cc,
  });

  // Perimeter Walls
  // Back Wall (North: z = -15)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(36, 5.2, 0.4), wallMat);
  backWall.position.set(0, 2.6, -15);
  scene.add(backWall);

  // Front Wall (South: z = 15)
  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(36, 5.2, 0.4), wallMat);
  frontWall.position.set(0, 2.6, 15);
  scene.add(frontWall);

  // Left Wall (West: x = -18)
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.2, 30), wallMat);
  leftWall.position.set(-18, 2.6, 0);
  scene.add(leftWall);

  // Right Wall (East: x = 18 with large panoramic windows)
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.2, 30), accentWallMat);
  rightWall.position.set(18, 2.6, 0);
  scene.add(rightWall);

  // Panoramic Window Frames on East Wall
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x252528, roughness: 0.5 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x99ccff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.8,
  });
  for (let z = -8; z <= 8; z += 8) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.4, 6), windowFrameMat);
    frame.position.set(17.9, 2.8, z);
    scene.add(frame);

    const glass = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.2), glassMat);
    glass.rotation.y = -Math.PI / 2;
    glass.position.set(17.8, 2.8, z);
    scene.add(glass);
  }

  // Outdoor Snowy Night Backdrop visible through windows
  const outdoorSkyGeo = new THREE.SphereGeometry(60, 32, 16);
  const outdoorSkyMat = new THREE.MeshBasicMaterial({
    color: 0x060c18,
    side: THREE.BackSide,
  });
  const outdoorSky = new THREE.Mesh(outdoorSkyGeo, outdoorSkyMat);
  scene.add(outdoorSky);

  // Snowy Pine Trees outside windows
  function createSnowyPine(x: number, z: number, scale = 1) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25 * scale, 0.35 * scale, 2 * scale),
      darkWoodMat
    );
    trunk.position.set(x, 1 * scale, z);
    scene.add(trunk);

    const pineMat = new THREE.MeshStandardMaterial({ color: 0x1d3a24, roughness: 0.8 });
    const snowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry((2 - i * 0.45) * scale, 1.8 * scale, 8),
        pineMat
      );
      cone.position.set(x, (2 + i * 1.2) * scale, z);
      scene.add(cone);

      const snowCap = new THREE.Mesh(
        new THREE.ConeGeometry((2.05 - i * 0.45) * scale, 0.5 * scale, 8),
        snowMat
      );
      snowCap.position.set(x, (2.7 + i * 1.2) * scale, z);
      scene.add(snowCap);
    }
  }
  createSnowyPine(24, 0, 1.8);
  createSnowyPine(26, -7, 1.5);
  createSnowyPine(25, 7, 1.6);

  // Ambient & Warm Holiday Lights
  const ambientLight = new THREE.AmbientLight(0xffedd8, 0.75);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff3e0, 0.9);
  mainLight.position.set(5, 12, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  // Holiday Garlands with Twinkling Warm Fairy Lights along ceiling beams
  const garlandMat = new THREE.MeshStandardMaterial({ color: 0x16381e, roughness: 0.9 });
  const bulbColors = [0xffdd88, 0xff3333, 0xffcc44, 0x33cc66];

  for (let z = -12; z <= 12; z += 6) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(35.6, 0.25, 0.4), darkWoodMat);
    beam.position.set(0, 5.0, z);
    scene.add(beam);

    const garland = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 35, 8), garlandMat);
    garland.rotation.z = Math.PI / 2;
    garland.position.set(0, 4.85, z);
    scene.add(garland);

    // Glowing fairy light bulbs along each beam
    for (let x = -16; x <= 16; x += 1.8) {
      const bulbColor = bulbColors[Math.floor(Math.random() * bulbColors.length)];
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: bulbColor })
      );
      bulb.position.set(x, 4.75 + Math.sin(x * 1.5) * 0.08, z);
      scene.add(bulb);
    }
  }

  // Warm glowing point lights for cozy office ambiance
  const lampLight1 = new THREE.PointLight(0xffeedd, 0.8, 12);
  lampLight1.position.set(-6, 3.8, -4);
  scene.add(lampLight1);

  const lampLight2 = new THREE.PointLight(0xffeedd, 0.8, 12);
  lampLight2.position.set(6, 3.8, 4);
  scene.add(lampLight2);

  // Wall Decor: TryHackMe Neon / Backlit Sign on North Wall
  const logoCanvas = document.createElement('canvas');
  logoCanvas.width = 512;
  logoCanvas.height = 128;
  const ctx = logoCanvas.getContext('2d')!;
  ctx.fillStyle = '#1b2738';
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#a4c639';
  ctx.font = 'bold 36px monospace';
  ctx.fillText('[TRYHACKME]', 40, 75);
  ctx.fillStyle = '#ffffff';
  ctx.font = '22px sans-serif';
  ctx.fillText('TBFC Headquarters · Wareville', 230, 72);
  const logoTex = new THREE.CanvasTexture(logoCanvas);
  const logoSign = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 1.5),
    new THREE.MeshBasicMaterial({ map: logoTex })
  );
  logoSign.position.set(0, 3.8, -14.75);
  scene.add(logoSign);

  // Reindeer & Sleigh Neon Outline on East Wall
  const neonMat = new THREE.MeshBasicMaterial({ color: 0xffe8cf });
  const neonReindeer = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.04, 8, 24), neonMat);
  neonReindeer.position.set(17.7, 4.0, -12);
  neonReindeer.rotation.y = -Math.PI / 2;
  scene.add(neonReindeer);

  // Wall Stockings
  const stockingMat = new THREE.MeshStandardMaterial({ color: 0xc4202b, roughness: 0.8 });
  const stockingWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  for (let i = 0; i < 4; i++) {
    const sBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.45), stockingMat);
    sBody.position.set(6 + i * 1.2, 3.2, -14.75);
    scene.add(sBody);
    const sTop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.48), stockingWhite);
    sTop.position.set(6 + i * 1.2, 3.6, -14.75);
    scene.add(sTop);
  }

  // Potted Fiddle Leaf Plants
  function createPlant(x: number, z: number) {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.35, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    pot.position.set(x, 0.4, z);
    scene.add(pot);

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d281a });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x24552b, roughness: 0.6 });

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8), stemMat);
    stem.position.set(x, 1.1, z);
    scene.add(stem);

    for (let a = 0; a < 6; a++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), leafMat);
      leaf.scale.set(1.4, 0.2, 0.8);
      leaf.rotation.y = (a * Math.PI) / 3;
      leaf.rotation.z = 0.3;
      leaf.position.set(
        x + Math.cos((a * Math.PI) / 3) * 0.4,
        1.0 + a * 0.15,
        z + Math.sin((a * Math.PI) / 3) * 0.4
      );
      scene.add(leaf);
    }
  }
  createPlant(-16.5, -13.5);
  createPlant(-16.5, 13.5);
  createPlant(16.5, -13.5);

  // Helper: Office Desk Generator
  const allMonitors: THREE.Mesh[] = [];
  function createOfficeDesk(x: number, z: number, rotationY = 0) {
    const deskGroup = new THREE.Group();

    // Tabletop - Rich natural oak wood
    const top = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.12, 2.2), woodMat);
    top.position.y = 1.35;
    top.castShadow = true;
    top.receiveShadow = true;
    deskGroup.add(top);

    // Metal Legs
    const legGeo = new THREE.BoxGeometry(0.1, 1.35, 0.1);
    const legCoords = [
      [-1.95, -0.95],
      [1.95, -0.95],
      [-1.95, 0.95],
      [1.95, 0.95],
    ];
    legCoords.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(lx, 0.675, lz);
      deskGroup.add(leg);
    });

    // Dual Monitors on Desk
    [-0.8, 0.8].forEach((mx) => {
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.4, 8), metalMat);
      stand.position.set(mx, 1.6, -0.5);
      deskGroup.add(stand);

      const monitorCase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.85, 0.08), metalMat);
      monitorCase.position.set(mx, 2.05, -0.5);
      deskGroup.add(monitorCase);

      const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.75), screenGlowMat);
      screen.position.set(mx, 2.05, -0.45);
      deskGroup.add(screen);
      allMonitors.push(screen);
    });

    // Red Swivel Chair
    const chair = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9), redChairMat);
    seat.position.y = 0.85;
    chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.12), redChairMat);
    back.position.set(0, 1.3, 0.42);
    chair.add(back);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85, 8), metalMat);
    stem.position.y = 0.425;
    chair.add(stem);
    chair.position.set(0, 0, 0.9);
    deskGroup.add(chair);

    deskGroup.position.set(x, 0, z);
    deskGroup.rotation.y = rotationY;
    scene.add(deskGroup);
    return deskGroup;
  }

  // 1. ZONE 1: McSkidy's Workstation (Target: Forensic Workstation)
  const workstationGroup = createOfficeDesk(-6, -4, 0);

  // Add Snow Globe on McSkidy's Desk
  const globeBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.25, 0.12, 16),
    new THREE.MeshStandardMaterial({ color: 0x9b1c28, roughness: 0.5 })
  );
  globeBase.position.set(1.4, 1.47, 0.3);
  workstationGroup.add(globeBase);

  const globeGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      transmission: 0.9,
    })
  );
  globeGlass.position.set(1.4, 1.7, 0.3);
  workstationGroup.add(globeGlass);

  // Tiny Pine Tree inside Snow Globe
  const tinyTree = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.25, 8),
    new THREE.MeshStandardMaterial({ color: 0x1d3a24 })
  );
  tinyTree.position.set(1.4, 1.62, 0.3);
  workstationGroup.add(tinyTree);

  // 2. Desk with QR Code Sticker
  const qrDeskGroup = createOfficeDesk(-6, 4, 0);
  const qrSticker = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.01, 0.25),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  qrSticker.position.set(0.6, 1.42, 0.4);
  qrDeskGroup.add(qrSticker);

  // 3. Desk with Archive Scanner Desktop PC
  const archiveDeskGroup = createOfficeDesk(6, 4, Math.PI);
  const pcTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.95, 0.85),
    new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.4 })
  );
  pcTower.position.set(1.6, 1.9, 0.0);
  archiveDeskGroup.add(pcTower);

  // 4. BREAKROOM: Hot Cocoa Station & Smart Sideboard (South-West: x = -14, z = 8)
  const sideboard = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.6, 1.8), darkWoodMat);
  sideboard.position.set(-14, 0.8, 8);
  scene.add(sideboard);

  // Red Commercial Hot Cocoa Machine
  const cocoaMachineMat = new THREE.MeshStandardMaterial({ color: 0x9e1b24, roughness: 0.4 });
  const cocoaBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), cocoaMachineMat);
  cocoaBody.position.set(-15, 2.5, 8);
  scene.add(cocoaBody);

  const cocoaDispenser = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), metalMat);
  cocoaDispenser.position.set(-15, 2.2, 8.45);
  scene.add(cocoaDispenser);

  // White Holiday Mug with Christmas Tree Stripe
  const mug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.16, 0.35, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  );
  mug.position.set(-15, 1.8, 8.45);
  scene.add(mug);

  // Smart Snowman Speaker on sideboard
  const snowmanMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const snowmanBase = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), snowmanMat);
  snowmanBase.position.set(-12.8, 1.95, 8.1);
  scene.add(snowmanBase);
  const snowmanHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), snowmanMat);
  snowmanHead.position.set(-12.8, 2.45, 8.1);
  scene.add(snowmanHead);
  const snowmanScarf = new THREE.Mesh(
    new THREE.TorusGeometry(0.23, 0.06, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xb51c27 })
  );
  snowmanScarf.rotation.x = Math.PI / 2;
  snowmanScarf.position.set(-12.8, 2.25, 8.1);
  scene.add(snowmanScarf);

  // Smart Thermostat on Wall
  const thermostat = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.75, 1.1),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  thermostat.position.set(-17.9, 2.8, 5.5);
  scene.add(thermostat);

  // Office Multifunction Printer / Copier
  const printerMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.5 });
  const printerBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), printerMat);
  printerBase.position.set(-14, 0.9, -10);
  scene.add(printerBase);
  const printerTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 1.2), metalMat);
  printerTop.position.set(-14, 2.0, -10);
  scene.add(printerTop);

  // 5. SERVER ROOM: Partitioned Data Center (North-East: x = 10, z = -8)
  // Glass partition wall with door frame
  const serverGlassWall = new THREE.Mesh(new THREE.BoxGeometry(14, 5.2, 0.15), glassMat);
  serverGlassWall.position.set(11, 2.6, -5);
  scene.add(serverGlassWall);

  // Server Racks with Blinking Status LEDs
  const rackGroup = new THREE.Group();
  for (let r = 0; r < 3; r++) {
    const rack = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 4.4, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.4 })
    );
    rack.position.set(6.5 + r * 2.4, 2.2, -10);
    rackGroup.add(rack);

    // Green and blue flashing status lights
    for (let l = 0; l < 8; l++) {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        new THREE.MeshBasicMaterial({ color: l % 2 === 0 ? 0x22c55e : 0x0ea5e9 })
      );
      led.position.set(6.5 + r * 2.4, 1.0 + l * 0.4, -9.18);
      rackGroup.add(led);
    }
  }
  // Pull-out rack terminal console
  const consoleShelf = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.8), metalMat);
  consoleShelf.position.set(8.9, 1.6, -8.8);
  rackGroup.add(consoleShelf);
  const consoleScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.7),
    new THREE.MeshBasicMaterial({ color: 0x00ff88 })
  );
  consoleScreen.position.set(8.9, 2.1, -9.15);
  rackGroup.add(consoleScreen);
  scene.add(rackGroup);

  // 6. MEETING ROOM: Glass Partitioned Conference Room (South-East: x = 10, z = 7)
  const confTable = new THREE.Mesh(
    new THREE.BoxGeometry(7.5, 0.14, 3.2),
    new THREE.MeshStandardMaterial({ color: 0x3d281a, roughness: 0.5 })
  );
  confTable.position.set(10.5, 1.35, 7.5);
  scene.add(confTable);

  // Damaged open PC chassis on table
  const damagedCase = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.4, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x2e3035, roughness: 0.6 })
  );
  damagedCase.position.set(8.5, 1.6, 7.5);
  scene.add(damagedCase);

  // Holographic Blue "Click to place" Laptop Ghost Box
  const laptopGhost = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.15, 1.0),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      wireframe: true,
    })
  );
  laptopGhost.position.set(10.5, 1.5, 7.5);
  scene.add(laptopGhost);

  // High-back Executive Conference Chairs
  const execChairMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.7 });
  for (let c = 0; c < 3; c++) {
    const chairS = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9), execChairMat);
    chairS.position.set(8.5 + c * 2.0, 0.85, 9.6);
    scene.add(chairS);
    const chairB = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.14), execChairMat);
    chairB.position.set(8.5 + c * 2.0, 1.45, 10.05);
    scene.add(chairB);
  }

  // Return target references for user click and raycasting
  return {
    cocoaStation: cocoaBody,
    mugObject: mug,
    workstation: workstationGroup,
    serverRack: rackGroup,
    laptopMeeting: laptopGhost,
    archiveDesktop: archiveDeskGroup,
    qrStickerDesk: qrSticker,
    smartThermostat: thermostat,
    smartSnowman: snowmanBase,
    networkPrinter: printerBase,
    monitors: allMonitors,
  };
}
