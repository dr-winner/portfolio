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
