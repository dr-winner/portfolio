/**
 * Seed data for the tech stack.
 *
 * Icons are stored as string keys (see `src/lib/icons.ts`) so the data is
 * JSON-safe and can be passed from server components to client components.
 */
export type StackLevel = "core" | "working" | "learning";

export type StackItem = {
  name: string;
  iconKey: string;
  level?: StackLevel;
};

export type StackCategory = {
  id: string;
  label: string;
  accent: "ocean" | "signal" | "ok" | "threat";
  iconKey: string;
  description: string;
  items: StackItem[];
};

export const stackCategories: StackCategory[] = [
  {
    id: "security",
    label: "Security Operations",
    accent: "signal",
    iconKey: "ShieldAlert",
    description: "What I use to detect, hunt, and respond.",
    items: [
      { name: "Splunk", iconKey: "Search", level: "core" },
      { name: "Microsoft Sentinel", iconKey: "Radar", level: "core" },
      { name: "Elastic / ELK", iconKey: "LineChart", level: "core" },
      { name: "CrowdStrike EDR", iconKey: "ShieldCheck", level: "working" },
      { name: "MITRE ATT&CK", iconKey: "Network", level: "core" },
      { name: "Incident Response", iconKey: "AlertTriangle", level: "core" },
      { name: "SOAR / Playbooks", iconKey: "Workflow", level: "working" },
      { name: "Vulnerability Mgmt", iconKey: "Bug", level: "working" },
    ],
  },
  {
    id: "offensive",
    label: "Offensive & Forensics",
    accent: "threat",
    iconKey: "Bug",
    description: "Thinking like the adversary to defend better.",
    items: [
      { name: "Wireshark", iconKey: "Activity", level: "core" },
      { name: "Nmap", iconKey: "Radar", level: "core" },
      { name: "Burp Suite", iconKey: "FlaskConical", level: "working" },
      { name: "Metasploit", iconKey: "Zap", level: "working" },
      { name: "TryHackMe / HTB", iconKey: "Terminal", level: "core" },
      { name: "Log Forensics", iconKey: "FileSearch", level: "working" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Platform",
    accent: "ocean",
    iconKey: "Cloud",
    description: "Where I deploy, harden, and monitor.",
    items: [
      { name: "AWS", iconKey: "Cloud", level: "core" },
      { name: "Microsoft Azure", iconKey: "Cloud", level: "working" },
      { name: "Google Cloud", iconKey: "Cloud", level: "working" },
      { name: "DigitalOcean", iconKey: "Server", level: "working" },
      { name: "Vercel", iconKey: "Globe", level: "core" },
      { name: "Docker", iconKey: "Container", level: "core" },
      { name: "Kubernetes", iconKey: "ServerCog", level: "learning" },
      { name: "Terraform", iconKey: "CircuitBoard", level: "working" },
    ],
  },
  {
    id: "ai",
    label: "AI & Agents",
    accent: "ocean",
    iconKey: "Bot",
    description: "Where agentic systems meet the real world.",
    items: [
      { name: "LLM Agents", iconKey: "Bot", level: "core" },
      { name: "LangChain / LangGraph", iconKey: "Workflow", level: "working" },
      { name: "RAG Pipelines", iconKey: "Brain", level: "core" },
      { name: "Vector DBs", iconKey: "Database", level: "working" },
      { name: "LLM Security", iconKey: "Lock", level: "working" },
      { name: "Prompt Eng.", iconKey: "Sparkles", level: "core" },
      { name: "PyTorch / TF", iconKey: "Satellite", level: "working" },
    ],
  },
  {
    id: "fullstack",
    label: "Full-Stack Engineering",
    accent: "ok",
    iconKey: "Code2",
    description: "Shipping the products I help defend.",
    items: [
      { name: "TypeScript", iconKey: "Braces", level: "core" },
      { name: "Python", iconKey: "FileCode", level: "core" },
      { name: "React / Next.js", iconKey: "Code2", level: "core" },
      { name: "Node.js", iconKey: "Server", level: "core" },
      { name: "PostgreSQL", iconKey: "Database", level: "working" },
      { name: "Solidity", iconKey: "KeyRound", level: "working" },
      { name: "GitHub / CI", iconKey: "GitBranch", level: "core" },
    ],
  },
];
