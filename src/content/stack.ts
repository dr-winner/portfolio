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
    id: "offensive",
    label: "Pentesting & AppSec",
    accent: "threat",
    iconKey: "Bug",
    description: "Tools and foundations for authorized web and network security testing.",
    items: [
      { name: "Wireshark", iconKey: "Activity", level: "core" },
      { name: "Nmap", iconKey: "Radar", level: "core" },
      { name: "Burp Suite", iconKey: "FlaskConical", level: "working" },
      { name: "OWASP Top 10", iconKey: "ShieldCheck", level: "working" },
      { name: "API Security", iconKey: "Network", level: "learning" },
      { name: "Metasploit", iconKey: "Zap", level: "working" },
      { name: "TryHackMe / HTB", iconKey: "Terminal", level: "core" },
      { name: "Log Forensics", iconKey: "FileSearch", level: "working" },
    ],
  },
  {
    id: "cloud-security",
    label: "Cloud & Security Engineering",
    accent: "ocean",
    iconKey: "Cloud",
    description: "Hardening cloud infrastructure, automation, and applied cryptographic systems.",
    items: [
      { name: "AWS IAM & CloudTrail", iconKey: "Cloud", level: "core" },
      { name: "Terraform", iconKey: "ServerCog", level: "working" },
      { name: "Linux", iconKey: "Terminal", level: "core" },
      { name: "Docker", iconKey: "Container", level: "core" },
      { name: "Cryptography", iconKey: "KeyRound", level: "working" },
      { name: "SQL / PostgreSQL", iconKey: "Database", level: "core" },
      { name: "LLM Security", iconKey: "Lock", level: "working" },
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
