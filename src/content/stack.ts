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
    label: "Application and API security",
    accent: "threat",
    iconKey: "Bug",
    description: "How I test web applications and APIs.",
    items: [
      { name: "Burp Suite", iconKey: "FlaskConical", level: "core" },
      { name: "OWASP Top 10", iconKey: "ShieldCheck", level: "core" },
      { name: "Nmap", iconKey: "Radar", level: "core" },
      { name: "SQL injection", iconKey: "ShieldAlert", level: "core" },
      { name: "John the Ripper", iconKey: "KeyRound", level: "core" },
      { name: "ExifTool", iconKey: "Activity", level: "working" },
      { name: "API security", iconKey: "Network", level: "working" },
    ],
  },
  {
    id: "cloud-security",
    label: "Cloud and detection",
    accent: "ocean",
    iconKey: "Cloud",
    description: "Detections and the cloud tools behind them.",
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
    id: "frontend",
    label: "Languages",
    accent: "ok",
    iconKey: "Code2",
    description: "Python, TypeScript, SQL and PHP.",
    items: [
      { name: "Python", iconKey: "FileCode", level: "working" },
      { name: "TypeScript", iconKey: "Braces", level: "core" },
      { name: "SQL", iconKey: "Database", level: "core" },
      { name: "PHP", iconKey: "Server", level: "working" },
      { name: "React / Next.js", iconKey: "Code2", level: "core" },
      { name: "GitHub / CI", iconKey: "GitBranch", level: "core" },
    ],
  },
];
