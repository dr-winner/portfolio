export interface EmailMessage {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  content: string;
  targetDeviceName: string;
  targetDeviceId: string;
  taskType: "workstation" | "server" | "laptop" | "qr" | "iot";
  isRead: boolean;
  isCompleted: boolean;
  actionPrompt?: string;
  cluePayload?: string;
}

export interface CaseFileClue {
  id: string;
  label: string;
  value: string | null;
  solved: boolean;
  discoveredAt?: string;
  deviceSource: string;
}

export interface SnowtrailGameState {
  currentObjectiveIndex: number;
  tasksCompleted: number;
  totalTasks: number;
  phoneOpen: boolean;
  activePhoneApp: "email" | "tasks" | "casefile";
  activeEmailId: string | null;
  clues: Record<string, CaseFileClue>;
  iotDevices: {
    thermostat: { name: "Smart Thermostat", isIoT: true, isDisconnected: boolean };
    printer: { name: "Office Network Printer", isIoT: true, isDisconnected: boolean };
    speaker: { name: "Smart Voice Assistant", isIoT: true, isDisconnected: boolean };
    coffeeMaker: { name: "Standard Coffee Maker", isIoT: false, isDisconnected: boolean };
    wallClock: { name: "Digital Wall Clock", isIoT: false, isDisconnected: boolean };
  };
  missionVictory: boolean;
}

export const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: "email-1",
    sender: "TBFC Assistant <assistant@wareville.corp>",
    subject: "URGENT: Warehouse Surveillance Extraction",
    preview: "McSkidy, the warehouse cameras recorded an overnight intrusion...",
    timestamp: "03:14 AM",
    content: `McSkidy,

The warehouse cameras recorded an overnight intrusion. The video buffer was dumped into an encrypted, multi-channel raster archive.

We need to de-scramble the frames without overheating the system. A standard laptop or office terminal will freeze. 

Please navigate over to the High-Performance Forensics Workstation at the east bay to render and process the footage.`,
    targetDeviceName: "High-Performance Workstation",
    targetDeviceId: "workstation",
    taskType: "workstation",
    isRead: false,
    isCompleted: false,
    actionPrompt: "Send Render Job to Workstation",
    cluePayload: "Wareville Northern Substation",
  },
  {
    id: "email-2",
    sender: "TBFC Assistant <assistant@wareville.corp>",
    subject: "CRITICAL: Central Network Connection Logs",
    preview: "Someone established an external reverse connection...",
    timestamp: "03:22 AM",
    content: `McSkidy,

Someone established an external reverse connection during the intrusion. The perimeter firewall forwarded the raw packet stream into the 24/7 logging cluster.

We need to extract the intruder's remote IP address. This connection log is only retained on the Server Room terminal cluster.

Go into the Server Room, access the central Server Terminal, and execute the log query filter.`,
    targetDeviceName: "Server Room Cluster Terminal",
    targetDeviceId: "server",
    taskType: "server",
    isRead: false,
    isCompleted: false,
    actionPrompt: "Query Server Access Log",
    cluePayload: "10.10.42.99",
  },
  {
    id: "email-3",
    sender: "TBFC Assistant <assistant@wareville.corp>",
    subject: "RECOVERY: Meeting Room Damaged Terminal",
    preview: "The intruder accessed a meeting room workstation...",
    timestamp: "03:31 AM",
    content: `McSkidy,

The intruder apparently sat in the Conference Meeting Room and left their session cached in a browser profile database before cutting the power.

Because the wall sockets in the meeting room are blown, take the battery-powered Portable Laptop over to the meeting room desk to interface with the offline machine.

Extract the cached database profile to reveal the intruder's handle.`,
    targetDeviceName: "Portable Laptop (Meeting Room)",
    targetDeviceId: "laptop",
    taskType: "laptop",
    isRead: false,
    isCompleted: false,
    actionPrompt: "Mount Laptop & Extract Profile",
    cluePayload: "Grinch_H4x0r",
  },
  {
    id: "email-4",
    sender: "TBFC Assistant <assistant@wareville.corp>",
    subject: "PHYSICAL CLUE: Desk QR Code Artifact",
    preview: "There is a physical sticker left on your desk...",
    timestamp: "03:39 AM",
    content: `McSkidy,

Look closely at your own desk! Forensics found a physical sticker stuck to your desk case file. 

Use your phone's integrated camera sensor to scan the QR code sticker directly.

This will extract the physical intruder serial number.`,
    targetDeviceName: "McSkidy's Desk QR Sticker",
    targetDeviceId: "desk-qr",
    taskType: "qr",
    isRead: false,
    isCompleted: false,
    actionPrompt: "Scan Physical QR Code",
    cluePayload: "SNOW-TRL-9941-X",
  },
  {
    id: "email-5",
    sender: "TBFC Assistant <assistant@wareville.corp>",
    subject: "EMERGENCY: Contain Lateral Movement (Disconnect IoT)",
    preview: "The intruder is attempting an office takeover through smart appliances...",
    timestamp: "03:45 AM",
    content: `EMERGENCY ALERT:

The intruder is attempting a persistent lateral takeover by beaconing through Wi-Fi connected smart appliances!

You must isolate and disconnect all IoT devices connected to the office Wi-Fi:
1. Smart Thermostat
2. Smart Voice Speaker
3. Office Network Printer

IMPORTANT CAUTION:
Do NOT unplug standard standalone embedded electronics (such as the standard coffee maker or digital wall clock)—they have no Wi-Fi transceivers and disconnecting them will trip the breaker!`,
    targetDeviceName: "Office IoT Network Devices",
    targetDeviceId: "iot-containment",
    taskType: "iot",
    isRead: false,
    isCompleted: false,
    actionPrompt: "Disconnect Rogue IoT Devices",
    cluePayload: "Network Perimeter Contained",
  },
];
