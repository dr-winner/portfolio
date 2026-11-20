"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  academyChapters,
  type AcademyLesson,
  type LessonStep,
} from "@/content/academy-lessons";
import { IsometricStage } from "./IsometricStage";
import { AcademyWaitlist } from "./AcademyWaitlist";
import { AcademyFaq } from "./AcademyFaq";
import { AcademyPractice } from "./AcademyPractice";
import { AcademyDesignLab } from "./AcademyDesignLab";
import { AcademyCheatsheets } from "./AcademyCheatsheets";
import { AcademyCommandPalette } from "./AcademyCommandPalette";

// ── Additional Curriculum Chapters to Match Reference Sidebar Richness ───────
const additionalCurriculumChapters = [
  {
    id: "chapter-4",
    number: "04",
    title: "Threat Modeling",
    domain: "Architecture",
    lessonCount: 4,
    color: "#f97316", // Orange
  },
  {
    id: "chapter-5",
    number: "05",
    title: "Red Team Labs",
    domain: "Offense",
    lessonCount: 4,
    color: "#3b82f6", // Blue
  },
  {
    id: "chapter-6",
    number: "06",
    title: "Cloud Identity",
    domain: "Infrastructure",
    lessonCount: 4,
    color: "#06b6d4", // Cyan
  },
  {
    id: "chapter-7",
    number: "07",
    title: "Defense Arch",
    domain: "Defense",
    lessonCount: 3,
    color: "#ec4899", // Pink
  },
];

function formatHudLabel(label: string): string {
  const map: Record<string, string> = {
    // Lesson 1-1
    "NETWORK SECURITY": "NET SEC",
    "NETWORK SEGMENT": "SEGMENT",
    "INTERNAL AUTHENTICATION": "AUTH",
    "INTERNAL AUTH": "AUTH",
    "USER CONTEXT": "IDENTITY",
    "IDENTITY PROPAGATION": "IDENTITY",
    "TRUST LEVEL": "TRUST",
    "EXPLOIT RISK": "RISK",
    "SECURITY STATUS": "STATUS",
    "SECURITY POSTURE": "POSTURE",
    "UNAUTHORIZED PINGS": "UNAUTH",
    "UNAUTHORIZED HOPS": "INTRUSION",
    "UNAUTH HOPS": "INTRUSION",
    "DATA SINK ACCESS": "DATA SINK",
    "DATA SINK": "DATA SINK",
    "CVSS MITIGATION": "CVSS",
    "POSTURE AUDIT": "POSTURE",

    // Lesson 1-2
    "ALLOWED ALGORITHMS": "ALGS",
    "ALLOWED ALGS": "ALGS",
    "SIGNATURE ENFORCEMENT": "SIGN",
    "SIGNATURE CHECK": "SIGN",
    "FORGED TOKEN": "FORGED",
    "EXPLOIT STATUS": "STATUS",
    "TEST SUITE": "TESTS",
    "NONE ALG TEST": "NONE ALG",
    "SIGNATURE TEST": "SIG TEST",
    "EXPIRED TEST": "EXP TEST",
    "AUTH STATE": "AUTH",

    // Lesson 1-3
    "COMPOSITION METHOD": "CONCAT",
    "COMPOSITION": "CONCAT",
    "INPUT SANITIZATION": "INPUT",
    "INPUT ESCAPING": "INPUT",
    "SYNTAX INTEGRITY": "SYNTAX",
    "SYNTAX TREE": "SYNTAX",
    "BOUNDARY STATE": "BOUND",
    "BOUNDARIES": "BOUND",
    "ORIGINAL INTENT": "INTENT",
    "ACTUAL EXECUTION": "EXEC",
    "AFFECTED DATA": "AFFECTED",
    "AFFECTED ROWS": "AFFECTED",
    "SECURITY INCIDENT": "INCIDENT",
    "CVSS SEVERITY": "CVSS",
    "CVSS SCORE": "CVSS",
    "CI RULE ENGINE": "CI SAST",
    "RULE ID": "RULE",
    "PULL REQUESTS": "PR GATE",
    "SECURITY AUDIT": "AUDIT",

    // Lesson 2-1 (BOLA)
    "CALLER IDENTITY": "CALLER",
    "REQUESTED RESOURCE": "RESOURCE",
    "RESOURCE OWNER": "OWNER",
    "ACCESS GATE": "ACCESS",
    "DATA EXPOSURE": "EXPOSURE",
    "ORIGIN DOMAIN": "ORIGIN",
    "AUTHENTICATION": "AUTH",
    "CROSS-TENANT GET": "TENANT GET",
    "CROSS-TENANT PUT": "TENANT PUT",
    "CROSS-TENANT DELETE": "TENANT DEL",
    "HTTP RESPONSE": "RESPONSE",
    "REMEDIATED QUERY": "QUERY",

    // Lesson 2-2 (SQLi)
    "INPUT USERNAME": "USERNAME",
    "QUERY STRUCTURE": "QUERY",
    "PARSER STATE": "PARSER",
    "DATABASE ROWS": "ROWS",
    "INPUT PAYLOAD": "PAYLOAD",
    "QUERY MUTATION": "MUTATION",
    "EVALUATION": "EVAL",
    "INJECTION TECHNIQUE": "TECHNIQUE",
    "TARGET METADATA": "METADATA",
    "DATA EXFILTRATED": "EXFIL",
    "QUERY BUILDER": "BUILDER",
    "PAYLOAD TREATMENT": "TREATMENT",
    "QUERY AST": "AST",
    "ATTACK RESULT": "RESULT",
    "FUZZ PAYLOADS": "FUZZ",
    "AUTH BYPASSES": "BYPASSES",
    "DB ERRORS LEAKED": "ERRORS",

    // Lesson 2-3 (SSRF)
    "REQUEST ORIGIN": "ORIGIN",
    "TARGET URL": "TARGET",
    "NETWORK BOUNDARY": "BOUNDARY",
    "DESTINATION IP": "DEST IP",
    "SUPPLIED URL": "URL",
    "DESTINATION TYPE": "DEST",
    "NETWORK PRIVILEGE": "PRIVILEGE",
    "SECURITY FILTER": "FILTER",
    "METADATA RESPONSE": "RESPONSE",
    "STOLEN CREDENTIALS": "CREDS",
    "CLOUD IMPACT": "IMPACT",
    "IP RESOLUTION": "DNS CHECK",
    "PRIVATE CIDR CHECK": "CIDR CHECK",
    "IMDS VERSION": "IMDS",
    "EGRESS FIREWALL": "EGRESS",
    "OCTAL/HEX IP TEST": "HEX TEST",
    "METADATA TEST": "META TEST",
    "AWS HOP LIMIT": "HOP LIMIT",

    // Lesson 2-4 (XSS)
    "PAYLOAD TYPE": "TYPE",
    "INLINE EVENT": "EVENT",
    "TARGET AUDIENCE": "AUDIENCE",
    "COOKIE FLAGS": "COOKIES",
    "DOM INJECTION SINK": "DOM SINK",
    "ATTACK IMPACT": "IMPACT",
    "HTTPONLY STATUS": "HTTPONLY",
    "CSP POLICY": "CSP",
    "BROWSER ACTIONS": "BROWSER",
    "CSP COMPLIANCE": "CSP AUDIT",
    "XSS ATTEMPTS": "XSS TEST",

    // Lesson 3-1 through 3-4 (AI / LLM)
    "PROMPT INPUT": "PROMPT",
    "SYSTEM PROMPT": "SYSTEM",
    "DATA BOUNDARY": "BOUNDARY",
    "MODEL COMPLIANCE": "MODEL",
    "WEB RETRIEVAL": "RAG DATA",
    "PROMPT SEPARATION": "DELIMIT",
    "DUAL-LLM GUARD": "GUARDRAIL",
    "INDIRECT INJECTION": "INJECTION",
    "TOOL CAPABILITY": "TOOLS",
    "CONFIRMATION GATE": "HUMAN GATE",
    "TOOL EXECUTION": "EXECUTION",
    "UNAUTHORIZED DELETES": "DELETES",
    "PRIVILEGE ESCALATION": "ESCALATE",
    "HUMAN GATES": "GATES",
    "CROSS-TENANT LEAK": "LEAK",
    "VECTOR EMBEDDING": "EMBEDDING",
    "METADATA FILTER": "FILTER",
    "SIMILARITY SEARCH": "SEARCH",
    "LLM AS JUDGE": "JUDGE",
    "JAILBREAK RISK": "JAILBREAK",
    "DETERMINISTIC GATE": "SCHEMA GATE",
    "FINAL AUDIT": "AUDIT",
  };
  if (map[label]) return map[label];
  const firstWord = label.split(" ")[0];
  return firstWord.length <= 8 ? firstWord : firstWord.slice(0, 8);
}

function formatHudValue(val: string): string {
  const map: Record<string, string> = {
    // Lesson 1-1
    "Encrypted Service Mesh": "Encrypted",
    "mTLS (SPIFFE/SPIRE X.509)": "SPIFFE Cert",
    "Signed Ed25519 JWT": "Ed25519",
    "Zero Trust Verified": "Verified",
    "Enforced Defense-in-Depth": "Enforced",
    "End-to-End Zero Trust": "Zero Trust",
    "100% Rejected (401)": "401 Reject",
    "Least-Privilege": "Scoped",
    "Lateral Movement Blocked": "Blocked",
    "Compliant (NIST 800-207)": "NIST Pass",
    "100% Blocked": "Blocked",
    "0.0 (Mitigated)": "0.0 / Safe",
    "NIST 800-207": "NIST Pass",

    // Lesson 1-2
    "['RS256'] (Pinned)": "RS256 Pin",
    "Enforced via RSA Public Key": "Enforced",
    "Rejected (401 Invalid Signature)": "401 Reject",
    "Rejected (401 None Alg)": "401 Reject",
    "Cryptographically Verified": "Verified",
    "8 / 8 Vectors Passing": "8/8 Pass",
    "Deterministic State": "Valid",
    "Stateful Session Cookie": "Cookie",
    "Tampered Signature": "Tampered",
    "alg: none Bypass": "Exploited",
    "RS256 Enforced": "Enforced",

    // Lesson 1-3
    "String Concatenation (+)": "Raw Concat",
    "String Concat (+)": "Raw Concat",
    "alice' OR '1'='1": "Injected",
    "Corrupted AST": "Corrupted",
    "Corrupted AST Grammar": "Corrupted",
    "Arbitrary Interpreter Control": "Hijacked",
    "Lookup 1 specific user": "1 Record",
    "Table Dump (Tautology)": "Dump All",
    "All Records (14,280 rows)": "All Rows",
    "Data Breach (Confidentiality)": "Breached",
    "8.6 HIGH": "8.6 High",
    "9.8 CRITICAL (Auth Bypass)": "9.8 Crit",
    "9.8 CRITICAL": "9.8 Crit",
    "Semgrep SAST Guard": "Semgrep",
    "security.sql.no-raw-string-interpolation": "No Concat",
    "Enforced at Gate": "PR Gate",
    "Prevented at Commit": "Prevented",
    "Verified Clean": "Verified",

    // Lesson 2-1
    "200 OK (LEAKED DATA)": "200 Leak",
    "403 Forbidden (Blocked by Policy)": "403 Block",
    "403 Forbidden": "403 Block",
    "12 / 12 Tenant Matrix Tests Passing": "12/12 Pass",
    "Remediated to 0.0": "0.0 / Safe",
    "WHERE id = ? AND tenant_id = ?": "Scoped RLS",
    "From Cryptographic JWT (globex)": "Scoped JWT",
    "Blocked (0 rows matched)": "Blocked",
    "Enforced at Database Layer": "Enforced",

    // Lesson 2-2
    "SELECT * FROM users WHERE username = ...": "Static SQL",
    "Single User Lookup": "1 User",
    "1 Row Matched": "1 Row",
    "Normal Processing": "Normal",
    "' OR 1=1 --": "Injected",
    "Password Check Commented Out": "Bypassed",
    "Always TRUE": "True (Bypass)",
    "BYPASSED without Password": "Bypassed",
    "UNION SELECT Reflection": "UNION Dump",
    "information_schema.tables": "Schema Dump",
    "Password Hashes & API Keys": "Exfiltrated",
    "Full Data Breach": "Breached",
    "P0 CRITICAL": "P0 Crit",
    "Prepared Statements (Binary Wire Protocol)": "Prepared",
    "Treated as Literal String Data": "Literal",
    "Immutable & Pre-Compiled": "Immutable",
    "No Rows Found (Lookup failed safely)": "Safe Miss",
    "100% Parameterized Immunity": "Immune",
    "24 Vectors Tested": "24/24 Pass",
    "0 Successful": "0 Exploited",
    "0 Leaked (Generic Errors)": "0 Leaks",
    "Semgrep Passed": "Semgrep",
    "Verified Hardened": "Hardened",

    // Lesson 2-3
    "Backend Application Server": "Backend",
    "Public Internet (WAN)": "WAN",
    "93.184.216.34 (Public)": "Public IP",
    "Normal Image Download": "Normal",
    "http://169.254.169.254/latest/meta-data/": "169.254...",
    "AWS Instance Metadata (Link-Local)": "AWS IMDS",
    "Server Local Network": "Local Net",
    "None (Unvalidated fetch)": "Unfiltered",
    "Probing Cloud Metadata": "Probing",
    "HTTP 200 OK (JSON Credentials)": "200 Stolen",
    "AWS_ACCESS_KEY_ID, SECRET_KEY": "Stolen IAM",
    "Full AWS Cloud Account Lateral Access": "Account C2",
    "Cloud Infrastructure Compromise": "Breached",
    "Pre-Flight DNS Resolution Check": "DNS Check",
    "169.254.169.254 REJECTED": "Rejected",
    "IMDSv2 (Session Token Required)": "IMDSv2",
    "Link-Local Egress Dropped": "Dropped",
    "SSRF Blocked at Network Boundary": "Blocked",
    "16 SSRF Bypasses Tested": "16/16 Pass",
    "Rejected (400)": "400 Reject",
    "Enforced (=1)": "Hop = 1",
    "Secure Against SSRF": "Hardened",

    // Lesson 2-4
    "Plain text bio": "Plain Text",
    "Idle (No inline execution)": "Idle",
    "Safe Rendering": "Safe",
    "Stored HTML Ingestion": "Stored HTML",
    "Viewing Administrators": "Admin Targets",
    "Full Admin Session Hijack": "Session Theft",
    "DOM textContent": "textContent",
    "Strict CSP (nonce-based)": "Strict CSP",
    "0 Injected Scripts Executed": "0 Executed",
    "0 / 12 Injections Passing": "12 Blocked",

    // Module 3
    "Raw Unparsed Text": "Raw Text",
    "Isolated System vs User": "Isolated",
    "Dual-LLM Supervisor": "Dual-LLM",
    "Prompt Injection Thwarted": "Blocked",
    "delete_account(102)": "Tool Call",
    "Human Approval Required": "Human Gate",
    "Action Rejected by Admin": "Rejected",
    "Zero Unauthorized Execution": "Protected",
    "Scoped Metadata ACL": "Scoped ACL",
    "Cross-Tenant Leak Prevented": "Prevented",
    "Deterministic AST Filter": "AST Gate",
    "Jailbreak Neutralized": "Neutralized",
  };
  if (map[val]) return map[val];
  if (val.length <= 12) return val;
  const prefix = val.split(/[(),]/)[0].trim();
  if (prefix.length <= 11) return prefix;
  return prefix.slice(0, 10);
}

// Helper to get short punchy chapter names for the sidebar
function getShortChapterTitle(chapterNumber: string, fullTitle: string): string {
  if (chapterNumber === "01") return "Foundations";
  if (chapterNumber === "02") return "AppSec Core";
  if (chapterNumber === "03") return "AI & LLM";
  return fullTitle.split("&")[0].trim();
}

// ── Editorial Notebook Pedagogical Panel (Right Column) ─────────────────────
function EditorialNotebookPanel({
  currentStep,
  currentLesson,
  onNextStep,
  onPrevStep,
  isNextDisabled,
  isPrevDisabled,
  nextStepTitle,
}: {
  currentStep: LessonStep;
  currentLesson: AcademyLesson;
  onNextStep: () => void;
  onPrevStep: () => void;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  nextStepTitle: string;
}) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const initial: Record<number, boolean> = {};
    currentLesson.learningObjectives.forEach((_, idx) => {
      initial[idx] = idx <= currentStep.checklistCompletedIdx;
    });
    setCheckedItems(initial);
  }, [currentLesson.learningObjectives, currentStep.checklistCompletedIdx]);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-4 text-[#26201b] w-full min-w-0">
      {/* ── Top Header: Step Badge + Problem Badge ── */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#26201b]/70">
            STEP {currentStep.stepNumber} / {currentLesson.steps.length}
          </span>

          <span className="scale-badge-problem">
            {currentStep.kindLabel}
          </span>
        </div>

        <h2 className="mt-2 text-[21px] font-bold leading-snug tracking-tight text-[#26201b]">
          {currentStep.title}
        </h2>

        <p className="mt-2 text-[13.5px] leading-relaxed text-[#26201b]/80">
          {currentStep.explanation}
        </p>
      </div>

      {/* ── Key Idea Box (Soft Lavender) ── */}
      {currentStep.callout && (
        <div className="scale-key-idea">
          <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-extrabold uppercase tracking-wider mb-1 text-[#6d28d9]">
            <span>✦ KEY IDEA</span>
          </div>
          <p className="font-bold text-[13px] mb-1 text-[#4c1d95]">{currentStep.callout.title}</p>
          <p className="text-[12px] leading-relaxed text-[#5b21b6] opacity-95">{currentStep.callout.text}</p>
        </div>
      )}

      {/* ── Action Buttons (Matching designed-to-scale.vercel.app position) ── */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={isPrevDisabled}
            className="scale-btn-back !py-2 !px-4 shrink-0"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={isNextDisabled}
            className="scale-btn-next flex-1 min-w-0 !py-2 !px-3 overflow-hidden"
          >
            <span className="truncate block flex-1 text-left">Next: {nextStepTitle}</span>
            <span aria-hidden className="shrink-0 font-mono">→</span>
          </button>
        </div>

        <div className="text-center font-mono text-[10px] text-[#26201b]/50">
          <span>[←] [→] step</span> &nbsp;•&nbsp; <span>[R] replay</span> &nbsp;•&nbsp; <span>[Space] pause</span>
        </div>
      </div>

      {/* ── "You'll Learn" Checklist Card ── */}
      <div className="scale-diff-box w-full min-w-0">
        <p className="font-mono text-[10.5px] font-extrabold uppercase tracking-wider text-[#26201b]/70 mb-2.5">
          YOU&apos;LL LEARN
        </p>

        <div className="space-y-2">
          {currentLesson.learningObjectives.map((item, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCheck(idx)}
                className="flex w-full items-start gap-2.5 text-left group"
              >
                <div
                  className={`scale-checkbox mt-0.5 ${isChecked ? "checked" : ""}`}
                >
                  {isChecked && (
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[12px] leading-snug ${
                    isChecked ? "line-through text-[#26201b]/50" : "text-[#26201b]/85"
                  }`}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── "What Changed" Diff Box (If Diff Lines Exist) ── */}
      {currentStep.diff && currentStep.diff.length > 0 && (
        <div className="scale-diff-box w-full min-w-0">
          <div className="flex items-center justify-between border-b border-[#26201b]/10 pb-2 mb-2 font-mono text-[10.5px]">
            <span className="uppercase font-extrabold tracking-wider text-[#26201b]/60">
              WHAT CHANGED
            </span>
            <span className="font-bold text-[#10b981] truncate max-w-[170px]" title={currentStep.diffTitle}>
              {currentStep.diffTitle}
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px] leading-relaxed overflow-x-auto w-full min-w-0 pb-1 scrollbar-thin">
            {currentStep.diff.map((line, idx) => (
              <div
                key={idx}
                className={`px-2 py-0.5 rounded font-medium whitespace-pre ${
                  line.type === "add"
                    ? "bg-[#dcfce7] text-[#14532d]"
                    : line.type === "remove"
                      ? "bg-[#fee2e2] text-[#991b1b]"
                      : line.type === "modify"
                        ? "bg-[#fef3c7] text-[#92400e]"
                        : "text-[#26201b]/70"
                }`}
              >
                <span>{line.type === "add" ? "+ " : line.type === "remove" ? "- " : "  "}</span>
                {line.code}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Studio Controller Component ─────────────────────────────────────────
export function AcademyStudio() {
  // Navigation & Interactive State
  const [activeLessonId, setActiveLessonId] = useState<string>("lesson-1-1");
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"interactive" | "practice" | "lab" | "cheatsheets" | "cohort">("interactive");
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    "chapter-1": true,
    "chapter-2": false,
    "chapter-3": false,
  });

  const notebookRef = useRef<HTMLDivElement>(null);
  const mobileNotebookRef = useRef<HTMLDivElement>(null);

  // Ensure notebook container is always scrolled to leftmost edge on step/lesson change
  useEffect(() => {
    if (notebookRef.current) notebookRef.current.scrollLeft = 0;
    if (mobileNotebookRef.current) mobileNotebookRef.current.scrollLeft = 0;
  }, [activeLessonId, activeStepIdx]);

  // Force warm paper light theme while on Academy
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.backgroundColor = "#f5efe6";
    root.style.colorScheme = "light";
    document.body.style.backgroundColor = "#f5efe6";
    document.body.style.color = "#26201b";
    return () => {
      root.style.backgroundColor = "";
      root.style.colorScheme = "";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  // Listen for open-command-palette custom event
  useEffect(() => {
    function handleOpenPalette() {
      setSearchOpen(true);
    }
    window.addEventListener("open-command-palette", handleOpenPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenPalette);
  }, []);

  // Current Lesson & Step Lookups
  const allLessons = useMemo<AcademyLesson[]>(
    () => academyChapters.flatMap((ch) => ch.lessons),
    []
  );

  const currentLesson: AcademyLesson = useMemo(() => {
    return allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0];
  }, [allLessons, activeLessonId]);

  const currentStep: LessonStep = useMemo(() => {
    return currentLesson.steps[activeStepIdx] ?? currentLesson.steps[0];
  }, [currentLesson, activeStepIdx]);

  const currentLessonIndex = useMemo(() => {
    return allLessons.findIndex((l) => l.id === currentLesson.id);
  }, [allLessons, currentLesson.id]);

  const nextLesson = useMemo(() => {
    return allLessons[currentLessonIndex + 1] ?? null;
  }, [allLessons, currentLessonIndex]);

  // Handle Step Navigation
  const goToNextStep = useCallback(() => {
    if (activeStepIdx < currentLesson.steps.length - 1) {
      setActiveStepIdx((s) => s + 1);
    } else {
      setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
      if (nextLesson) {
        setActiveLessonId(nextLesson.id);
        setActiveStepIdx(0);
        const parentChapter = academyChapters.find((ch) =>
          ch.lessons.some((l) => l.id === nextLesson.id)
        );
        if (parentChapter) {
          setOpenChapters((prev) => ({ ...prev, [parentChapter.id]: true }));
        }
      }
    }
  }, [activeStepIdx, currentLesson, nextLesson]);

  const goToPrevStep = useCallback(() => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((s) => s - 1);
    }
  }, [activeStepIdx]);

  const selectLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveStepIdx(0);
    setActiveTab("interactive");
  }, []);

  // Keyboard Shortcuts (Arrow Left/Right, Space Pause, R Replay)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevStep();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setIsPaused(false);
        window.dispatchEvent(new CustomEvent("scale-replay-step"));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextStep, goToPrevStep]);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const nextStepTitle = useMemo(() => {
    if (activeStepIdx < currentLesson.steps.length - 1) {
      return currentLesson.steps[activeStepIdx + 1]?.subtitle ?? "Next Step";
    }
    if (nextLesson) {
      return nextLesson.title.split("&")[0].trim();
    }
    return "Complete Course";
  }, [activeStepIdx, currentLesson.steps, nextLesson]);

  return (
    <div className="scale-app selection:bg-[#c5e8b7] selection:text-[#1b4332]">
      {/* ── TOP HEADER (EXACT 1:1 REPLICA OF DESIGNED-TO-SCALE) ──────────── */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b-[1.5px] border-[#26201b]/20 bg-[#f5efe6]/95 px-3 sm:px-6 backdrop-blur-md">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            title="Toggle Curriculum Sidebar"
            className="scale-header-btn"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/academy" className="flex items-center gap-2 no-underline">
            {/* Isometric Block Logo */}
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-[1.5px] border-[#26201b] bg-[#c5e8b7] shadow-[1px_1px_0px_#26201b]">
              <span className="text-[13px] font-bold">🛡️</span>
            </div>
            <div className="flex items-center">
              <span className="font-mono text-[15px] sm:text-[17px] font-extrabold tracking-tight text-[#26201b]">
                Security
              </span>
              <span className="scale-logo-badge">
                Design
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Mode Tabs (Exact Designed-To-Scale Navigation Pills) */}
        <div className="hidden md:flex items-center gap-1 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setActiveTab("interactive")}
            className={activeTab === "interactive" ? "scale-nav-pill-active" : "scale-nav-pill-inactive"}
          >
            <span>📖</span>
            <span>Learn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className={activeTab === "practice" ? "scale-nav-pill-active" : "scale-nav-pill-inactive"}
          >
            <span>⚙️</span>
            <span>Practice</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lab")}
            className={activeTab === "lab" ? "scale-nav-pill-active" : "scale-nav-pill-inactive"}
          >
            <span>📐</span>
            <span>Design Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cheatsheets")}
            className={activeTab === "cheatsheets" ? "scale-nav-pill-active" : "scale-nav-pill-inactive"}
          >
            <span>📑</span>
            <span>Cheatsheets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cohort")}
            className={activeTab === "cohort" ? "scale-nav-pill-active" : "scale-nav-pill-inactive"}
          >
            <span>🎓</span>
            <span>Cohort 1</span>
          </button>
        </div>

        {/* Right: Search, Language, Theme, and Author */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="scale-search-input"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden sm:inline">Search lessons & concepts...</span>
            <kbd className="hidden sm:inline-block rounded border border-[#26201b]/30 bg-[#ede5d8] px-1 py-0.2 text-[9.5px] font-bold">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector */}
          <div className="hidden sm:flex h-8 sm:h-9 items-center gap-1 rounded-xl border-[1.5px] border-[#26201b]/35 bg-[#ffffff] px-2 text-[11px] font-mono font-bold text-[#26201b]/80 shadow-[1px_1px_0px_rgba(38,32,27,0.06)]">
            <span>🌐</span>
            <span>EN</span>
            <span className="text-[9px]">▼</span>
          </div>

          {/* Theme Indicator */}
          <button
            type="button"
            title="Warm Parchment Paper Mode (Enforced)"
            className="scale-header-btn"
            onClick={() => {
              const root = document.documentElement;
              root.classList.remove("dark");
              root.classList.add("light");
            }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Author Badge */}
          <Link
            href="/"
            className="hidden xl:flex items-center gap-1.5 rounded-full border-[1.5px] border-[#26201b]/35 bg-[#ffffff] px-2.5 py-1 text-[11px] font-mono text-[#26201b]/80 no-underline shadow-[1px_1px_0px_rgba(38,32,27,0.06)] hover:border-[#26201b]"
          >
            <div className="h-4 w-4 rounded-full bg-[#10b981] flex items-center justify-center text-[9px] text-white font-bold">
              W
            </div>
            <span>designed by <strong className="text-[#26201b]">@drWinner</strong></span>
          </Link>
        </div>
      </header>

      {/* ── MOBILE NAVIGATION TAB STRIP (< md) ────────────────────────────── */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto border-b border-[#26201b]/15 bg-[#f5efe6] px-3 py-1.5 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab("interactive")}
          className={activeTab === "interactive" ? "scale-nav-pill-active !text-[11px] !py-1 !px-2.5 shrink-0" : "scale-nav-pill-inactive !text-[11px] !py-1 !px-2 shrink-0"}
        >
          <span>📖 Learn</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("practice")}
          className={activeTab === "practice" ? "scale-nav-pill-active !text-[11px] !py-1 !px-2.5 shrink-0" : "scale-nav-pill-inactive !text-[11px] !py-1 !px-2 shrink-0"}
        >
          <span>⚙️ Practice</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("lab")}
          className={activeTab === "lab" ? "scale-nav-pill-active !text-[11px] !py-1 !px-2.5 shrink-0" : "scale-nav-pill-inactive !text-[11px] !py-1 !px-2 shrink-0"}
        >
          <span>📐 Design Lab</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cheatsheets")}
          className={activeTab === "cheatsheets" ? "scale-nav-pill-active !text-[11px] !py-1 !px-2.5 shrink-0" : "scale-nav-pill-inactive !text-[11px] !py-1 !px-2 shrink-0"}
        >
          <span>📑 Cheatsheets</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("cohort")}
          className={activeTab === "cohort" ? "scale-nav-pill-active !text-[11px] !py-1 !px-2.5 shrink-0" : "scale-nav-pill-inactive !text-[11px] !py-1 !px-2 shrink-0"}
        >
          <span>🎓 Cohort 1</span>
        </button>
      </div>

      {/* ── MAIN BODY CONTENT (TAB ROUTER) ───────────────────────────────── */}
      {activeTab === "practice" ? (
        <AcademyPractice onReturnToStudio={() => setActiveTab("interactive")} />
      ) : activeTab === "lab" ? (
        <AcademyDesignLab onReturnToStudio={() => setActiveTab("interactive")} />
      ) : activeTab === "cheatsheets" ? (
        <AcademyCheatsheets onReturnToStudio={() => setActiveTab("interactive")} />
      ) : activeTab === "cohort" ? (
        <div className="max-w-4xl mx-auto w-full py-6 px-4 space-y-6">
          <div className="scale-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#26201b]/10 pb-4 mb-6 gap-3">
              <div>
                <p className="font-mono text-[11px] font-extrabold uppercase tracking-wider text-[#10b981]">
                  Cohort 1 Engineering Mentorship
                </p>
                <h1 className="mt-1 text-[24px] sm:text-[30px] font-mono font-extrabold text-[#26201b]">
                  Application Security & AI Defense
                </h1>
                <p className="mt-1.5 text-[13.5px] text-[#26201b]/70 max-w-[55ch]">
                  8-week intensive engineering mentorship with live lab teardowns, direct PR reviews, and capstone 1-on-1 interview prep.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("interactive")}
                className="scale-btn-back self-start sm:self-auto"
              >
                ← Return to Studio
              </button>
            </div>

            <AcademyWaitlist />

            <div className="mt-10 border-t border-[#26201b]/10 pt-6">
              <h2 className="mb-3 text-[18px] font-mono font-bold text-[#26201b]">
                Frequently Asked Questions
              </h2>
              <AcademyFaq />
            </div>
          </div>
        </div>
      ) : (
        <div className="scale-three-col-layout py-3">
          {/* ── LEFT COLUMN: CHAPTERS & LESSONS SIDEBAR ─────────────────────── */}
          <aside
            className={`scale-col-sidebar space-y-3 ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-[#26201b]/15 pb-2 px-1">
              <div className="flex items-center gap-1.5 font-mono text-[13px] font-bold text-[#26201b]">
                <span>📁</span>
                <span>Course</span>
              </div>
              <span className="font-mono text-[11px] text-[#26201b]/60">
                11 lessons
              </span>
            </div>

            {/* Chapters Accordion List */}
            <div className="space-y-1 text-[12px]">
              {academyChapters.map((chapter) => {
                const isOpen = openChapters[chapter.id] ?? false;
                const chapterDone = chapter.lessons.filter((l) => completedLessons.has(l.id)).length;
                const folderColor =
                  chapter.number === "01"
                    ? "#f59e0b" // Yellow/Amber
                    : chapter.number === "02"
                      ? "#10b981" // Green
                      : "#8b5cf6"; // Purple

                const shortTitle = getShortChapterTitle(chapter.number, chapter.title);

                return (
                  <div key={chapter.id} className="rounded-xl">
                    {/* Chapter Header */}
                    <button
                      type="button"
                      onClick={() => toggleChapter(chapter.id)}
                      className="flex w-full items-center justify-between py-1 px-1.5 rounded-lg text-left hover:bg-[#ede5d8]/70 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 min-w-0 pr-1">
                        <span className={`text-[9px] text-[#26201b]/60 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                          ▶
                        </span>
                        {/* Colored Folder Icon */}
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill={folderColor} stroke="#26201b" strokeWidth="1.2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="font-mono text-[12px] font-bold text-[#26201b] truncate">
                          {chapter.number}. {shortTitle}
                        </span>
                      </div>
                      <span className="font-mono text-[10.5px] text-[#26201b]/50 shrink-0">
                        {chapterDone}/{chapter.lessons.length}
                      </span>
                    </button>

                    {/* Lesson Items */}
                    {isOpen && (
                      <div className="pl-3.5 pr-1 py-1 space-y-1">
                        {chapter.lessons.map((lesson) => {
                          const isCurrent = lesson.id === activeLessonId;
                          const isDone = completedLessons.has(lesson.id);

                          return isCurrent ? (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => selectLesson(lesson.id)}
                              className="scale-active-lesson-item"
                            >
                              <span
                                style={{
                                  background: "#1b4332",
                                  color: "#c5e8b7",
                                  borderRadius: "9999px",
                                  width: "14px",
                                  height: "14px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "9px",
                                  fontWeight: "900",
                                  flexShrink: 0,
                                }}
                              >
                                ✓
                              </span>
                              <span className="truncate leading-snug">{lesson.title.split("&")[0].trim()}</span>
                            </button>
                          ) : (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => selectLesson(lesson.id)}
                              className="scale-inactive-lesson-item"
                            >
                              <span className="text-[10px] text-[#26201b]/40">
                                {isDone ? "✓" : "○"}
                              </span>
                              <span className="truncate">{lesson.title.split("&")[0].trim()}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Additional Chapters from Reference */}
              {additionalCurriculumChapters.map((ch) => (
                <div key={ch.id} className="rounded-xl opacity-75">
                  <div className="flex w-full items-center justify-between py-1 px-1.5 rounded-lg text-left">
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      <span className="text-[9px] text-[#26201b]/40">▶</span>
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill={ch.color} stroke="#26201b" strokeWidth="1.2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="font-mono text-[12px] font-bold text-[#26201b]/80 truncate">
                        {ch.number}. {ch.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#26201b]/40 shrink-0">
                      0/{ch.lessonCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Bottom Progress */}
            <div className="border-t border-[#26201b]/15 pt-2 px-1">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#26201b]">
                <span className="uppercase tracking-wider text-[#26201b]/60">PROGRESS</span>
                <span>{completedLessons.size} / 11 &gt;</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-[#ede5d8] overflow-hidden">
                <div
                  className="h-full bg-[#10b981] transition-all"
                  style={{ width: `${(completedLessons.size / 11) * 100}%` }}
                />
              </div>
            </div>
          </aside>

          {/* ── CENTER COLUMN: VISUAL STUDIO & SCRUBBER ─────────────────────── */}
          <main className="scale-col-center">
            <div className="scale-card space-y-3">
              {/* Lesson Header Row */}
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#26201b]/60">
                  {currentLesson.chapterTitle} / {currentLesson.lessonNumber}
                </p>

                <div className="mt-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h1 className="text-[22px] sm:text-[26px] font-bold tracking-tight text-[#26201b]">
                    {currentLesson.title}
                  </h1>

                  {/* 3 Pill Badges (Time, Difficulty, Steps) */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#f59e0b]/40 bg-[#fef3c7] px-2 py-0.5 text-[#78350f]">
                      <span>⏱</span>
                      <span>{currentLesson.duration}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md border border-[#15803d]/40 bg-[#c5e8b7] px-2 py-0.5 text-[#14532d]">
                      <span>📶</span>
                      <span>{currentLesson.difficulty}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-md border border-[#7e22ce]/40 bg-[#f3e8ff] px-2 py-0.5 text-[#581c87]">
                      <span>☰</span>
                      <span>{currentLesson.steps.length} steps</span>
                    </span>
                  </div>
                </div>

                <p className="mt-1.5 text-[13px] leading-relaxed text-[#26201b]/70">
                  {currentLesson.subhead}
                </p>
              </div>

              {/* HUD Metrics Bar in a Single Horizontal Row + Controls on Far Right */}
              <div className="scale-hud-row">
                {/* 5 Metric Slots in a single line */}
                <div className="scale-hud-slots-container">
                  {currentStep.hudMetrics.map((metric, i) => {
                    const icon =
                      i === 0 ? "🌐" : i === 1 ? "🔒" : i === 2 ? "👤" : i === 3 ? "🛡️" : "📦";

                    return (
                      <div
                        key={`${metric.label}-${i}`}
                        className="scale-hud-slot"
                        title={`${metric.label}: ${metric.value}`}
                      >
                        <p className="font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#26201b]/60 whitespace-nowrap flex items-center gap-1">
                          <span>{icon}</span>
                          <span className="truncate">{formatHudLabel(metric.label)}</span>
                        </p>
                        <p
                          className={`font-mono text-[10.5px] sm:text-[11.5px] font-bold whitespace-nowrap truncate ${
                            metric.status === "danger"
                              ? "text-[#ef4444]"
                              : metric.status === "warning"
                                ? "text-[#f97316]"
                                : metric.status === "success"
                                  ? "text-[#10b981]"
                                  : "text-[#26201b]"
                          }`}
                        >
                          {formatHudValue(metric.value)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Right Replay & Pause Buttons (Matching designed-to-scale.vercel.app) */}
                <div className="flex items-center gap-1.5 shrink-0 self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaused(false);
                      window.dispatchEvent(new CustomEvent("scale-replay-step"));
                    }}
                    title="Replay Animation (R)"
                    className="scale-btn-back !py-1 !px-2.5 !text-[11px] flex items-center gap-1"
                  >
                    <span>↺ Replay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaused((p) => !p)}
                    title="Pause / Resume Animation (Space)"
                    className="scale-btn-back !py-1 !px-2.5 !text-[11px] flex items-center gap-1"
                  >
                    <span>{isPaused ? "▶ Resume" : "⏸ Pause"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFullscreen((f) => !f)}
                    title="Toggle Fullscreen"
                    className="scale-header-btn !h-7 !w-7"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Isometric Stage Canvas (Seamless canvas floating in card) */}
              <div className="w-full relative">
                <IsometricStage
                  step={currentStep}
                  lesson={currentLesson}
                  isPaused={isPaused}
                  onTogglePause={() => setIsPaused((p) => !p)}
                  onReplay={() => setIsPaused(false)}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                />
              </div>

              {/* Stage Legend Matching designed-to-scale.vercel.app */}
              <div className="flex items-center gap-5 px-1 py-0.5 font-mono text-[11px] text-[#26201b]/70">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-[#26201b] bg-[#f97316] inline-block" />
                  <span>request</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-[#26201b] bg-[#10b981] inline-block" />
                  <span>response</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-[#26201b] bg-[#3b82f6] inline-block" />
                  <span>handshake</span>
                </span>
              </div>

              {/* Bottom Scrubber Timeline */}
              <div className="scale-scrubber-box">
                <div className="flex items-center justify-between border-b border-[#26201b]/10 pb-2 font-mono text-[11px] font-bold">
                  <span className="uppercase tracking-wider text-[#26201b]/60">
                    IN THIS LESSON
                  </span>
                  <span className="text-[#10b981]">
                    Step {currentStep.stepNumber} of {currentLesson.steps.length}
                  </span>
                </div>

                {/* Horizontal Step Circles Connected by Rail */}
                <div className="relative mt-4 mb-1">
                  {/* Connecting Rail */}
                  <div className="absolute top-[13px] left-6 right-6 h-[2px] bg-[#26201b]/20 -z-0">
                    <div
                      className="h-full bg-[#10b981] transition-all duration-300"
                      style={{
                        width: `${currentLesson.steps.length > 1 ? (activeStepIdx / (currentLesson.steps.length - 1)) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex items-start justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
                    {currentLesson.steps.map((st, idx) => {
                      const isPassed = idx < activeStepIdx;
                      const isCurrent = idx === activeStepIdx;

                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setActiveStepIdx(idx)}
                          className="group flex flex-1 flex-col items-center min-w-[65px] text-center focus:outline-none focus:ring-0 select-none"
                        >
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold border-2 transition-all ${
                              isCurrent
                                ? "border-[#26201b] bg-[#c5e8b7] text-[#1b4332] scale-110 shadow-[2px_2px_0px_#26201b]"
                                : isPassed
                                  ? "border-[#10b981] bg-[#d1fae5] text-[#065f46]"
                                  : "border-[#26201b]/30 bg-[#ffffff] text-[#26201b]/50 group-hover:border-[#26201b]"
                            }`}
                          >
                            {isPassed ? (
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#065f46]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              st.stepNumber
                            )}
                          </div>
                          <span
                            className={`mt-2 font-mono text-[10px] font-bold leading-tight px-1 transition-colors ${
                              isCurrent ? "text-[#26201b]" : "text-[#26201b]/60 group-hover:text-[#26201b]"
                            }`}
                          >
                            {st.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Editorial Notebook Panel (< 1080px) */}
            <div ref={mobileNotebookRef} className="scale-col-notebook-mobile scale-card">
              <EditorialNotebookPanel
                currentStep={currentStep}
                currentLesson={currentLesson}
                onNextStep={goToNextStep}
                onPrevStep={goToPrevStep}
                isNextDisabled={activeStepIdx === currentLesson.steps.length - 1 && !nextLesson}
                isPrevDisabled={activeStepIdx === 0}
                nextStepTitle={nextStepTitle}
              />
            </div>
          </main>

          {/* ── RIGHT COLUMN: FIXED EDITORIAL NOTEBOOK PANEL (>= 1080px) ───── */}
          <aside ref={notebookRef} className="scale-col-notebook scale-card">
            <EditorialNotebookPanel
              currentStep={currentStep}
              currentLesson={currentLesson}
              onNextStep={goToNextStep}
              onPrevStep={goToPrevStep}
              isNextDisabled={activeStepIdx === currentLesson.steps.length - 1 && !nextLesson}
              isPrevDisabled={activeStepIdx === 0}
              nextStepTitle={nextStepTitle}
            />
          </aside>
        </div>
      )}

      {/* ── COMMAND PALETTE SEARCH MODAL (⌘K) ─────────────────────────────── */}
      <AcademyCommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLesson={selectLesson}
      />
    </div>
  );
}
