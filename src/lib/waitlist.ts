import { promises as fs } from "node:fs";
import path from "node:path";

export type WaitlistEntry = {
  id: string;
  name?: string;
  email: string;
  role?: string;
  focus?: "appsec" | "ai_security" | "both";
  note?: string;
  createdAt: string;
};

const DATA_FILE = path.join(process.cwd(), ".waitlist_data.json");
const MEMORY_ENTRIES: WaitlistEntry[] = [];

async function getStoredEntries(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // File doesn't exist yet or not readable
  }
  return MEMORY_ENTRIES;
}

export async function getWaitlistCount(): Promise<number> {
  const entries = await getStoredEntries();
  // Base seed of initial interested candidates
  return 24 + entries.length;
}

export async function addWaitlistEntry(data: Omit<WaitlistEntry, "id" | "createdAt">): Promise<{ success: boolean; alreadyExists?: boolean; count: number }> {
  const entries = await getStoredEntries();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = entries.find((e) => e.email === normalizedEmail);
  if (existing) {
    return { success: true, alreadyExists: true, count: 24 + entries.length };
  }

  const newEntry: WaitlistEntry = {
    id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...data,
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
  };

  entries.push(newEntry);
  MEMORY_ENTRIES.push(newEntry);

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to waitlist data file, kept in memory", err);
  }

  return { success: true, count: 24 + entries.length };
}
