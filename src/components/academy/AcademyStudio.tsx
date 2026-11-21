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
import { DtsIcon, DtsFolder } from "./AcademyIcons";

// ── Hud formatting utilities ────────────────────────────────────────────────
function formatHudLabel(label: string): string {
  const map: Record<string, string> = {
    "HOP TYPE": "HOP",
    "PROTOCOL / PORT": "PROTO",
    "IDENTITY AUTH": "AUTH",
    "INSPECTION GATE": "GATE",
    "PACKET STATE": "STATE",
    "NETWORK POSITION": "POS",
    "PACKET SIGNATURE": "SIG",
    "VPC EGRESS RULE": "EGRESS",
    "TRANSIT ROUTE": "ROUTE",
    "NETWORK LATENCY": "LATENCY",
    "ZERO TRUST STATE": "ZERO TRUST",
    "PERIMETER STATUS": "PERIMETER",
    "POLICY VIOLATIONS": "POLICY",
    "JWT ALGORITHM": "ALG",
    "SIGNATURE VALID": "SIG CHECK",
    "TENANT ID": "TENANT",
    "TOKEN EXPIRY": "EXPIRY",
    "REVOCATION CHECK": "REVOKE",
    "CRYPTO STRENGTH": "CRYPTO",
    "SIGNATURE STATUS": "STATUS",
    "ATTACK VECTOR": "VECTOR",
    "TOKEN TAMPERING": "TAMPER",
    "SIGNING METHOD": "SIGNING",
    "KEY PINNING": "PINNING",
    "CONFORMANCE TEST": "AUDIT",
    "SECURITY POSTURE": "POSTURE",
    "INPUT TYPE": "INPUT",
    "PARSER SINK": "PARSER",
    "PARSER CONTEXT": "CONTEXT",
    "EXECUTION IMPACT": "IMPACT",
    "CONTROL PLANE": "CONTROL",
    "AST STRUCTURE": "AST",
    "ATTACK SEVERITY": "SEVERITY",
    "SAST RULE": "SAST",
    "SECURITY GATE": "GATE",
    "AST INTEGRITY": "INTEGRITY",
    "INVARIANT STATUS": "INVARIANT",
    "TARGET URL": "TARGET",
    "DESTINATION IP": "DEST IP",
    "SUPPLIED URL": "URL",
    "SECURITY FILTER": "FILTER",
    "PROMPT INPUT": "PROMPT",
    "TOOL EXECUTION": "EXECUTION",
    "STRESS TEST VECTORS": "VECTORS",
    "GATE ACCURACY": "ACCURACY",
    "FALSE POSITIVE RATE": "FALSE POS",
    "INSPECTION LATENCY": "LATENCY",
    "FINAL CERTIFICATION": "CERTIFIED",
    "SYSTEM PROMPT": "SYSTEM",
    "USER INPUT": "USER",
    "MODEL ARCHITECTURE": "MODEL",
    "AGENT AUTONOMY": "AUTONOMY",
    "HUMAN GATES": "HUMAN GATE",
    "HUMAN-IN-THE-LOOP": "HITL",
    "MUTATION SINK": "SINK",
    "DATA PROVENANCE": "PROVENANCE",
    "TAINT TRACKING": "TAINT",
    "BOUNDARY INTEGRITY": "BOUNDARY",
    "SEARCH PARTITION": "PARTITION",
    "TENANT FILTER": "TENANT",
    "VECTOR DATABASE": "VECTOR DB",
    "EMBEDDING MODEL": "EMBEDDING",
    "COSINE SIMILARITY": "SIMILARITY",
    "ALLOWED ALGS": "ALLOWED",
    "ARGUMENT BOUNDS": "BOUNDS",
    "ATTACK RESULT": "RESULT",
    "BROWSER SINK": "SINK",
    "BROWSER EXECUTION": "BROWSER",
    "BROWSER SCRIPT ENGINE": "ENGINE",
    "CSP POLICY": "CSP",
    "CSP ENGINE": "CSP",
    "DOM SANITIZER": "SANITIZER",
    "EGRESS FIREWALL": "FIREWALL",
    "IMDS VERSION": "IMDS",
    "CALLER PRIVILEGE": "PRIVILEGE",
    "CALLER IDENTITY": "IDENTITY",
    "ADVERSARIAL INPUT": "INPUT",
    "ADVERSARIAL SIMULATIONS": "SIMULATION",
    "CROSS-TENANT ACCESS": "TENANT",
    "CROSS-TENANT DELETE": "DELETE",
    "CROSS-TENANT GET": "ACCESS",
    "CROSS-TENANT PUT": "MUTATION",
    "DATA EXPOSURE": "EXPOSURE",
    "DATA EXFILTRATED": "LEAKED",
    "DATABASE QUERY": "QUERY",
    "DATABASE RECORD": "RECORD",
    "DATABASE ROWS": "ROWS",
    "DB ERRORS LEAKED": "LEAKAGE",
    "DEFENSE ARCHITECTURE": "DEFENSE",
    "DETERMINISTIC GATES": "GATE",
    "EXPLOIT RISK": "RISK",
    "EXPLOIT STATUS": "EXPLOIT",
    "FAILURE MODE": "FAILURE",
    "INJECTED DIRECTIVE": "INJECTION",
    "INJECTION TECHNIQUE": "TECHNIQUE",
    "METADATA RESPONSE": "METADATA",
    "ORIGINAL INTENT": "INTENT",
    "OUTPUT POLICY": "POLICY",
    "OVERALL STATUS": "STATUS",
    "PRIVILEGE ESCALATION": "ESCALATION",
    "PROPOSED ACTION": "ACTION",
    "REASONED ACTION": "ACTION",
    "REASONING TRACE": "TRACE",
    "RESOURCE OWNER": "OWNER",
    "SECURITY AUDIT": "AUDIT",
    "SECURITY BOUNDARY": "BOUNDARY",
    "SEMANTIC JUDGE": "JUDGE",
    "SEMANTIC QUERY": "QUERY",
    "SESSION IDENTITY": "IDENTITY",
    "STATIC CODE RULES": "SAST RULES",
    "TARGET METADATA": "METADATA",
    "TARGET USER ID": "USER ID",
    "TENANT SCOPE": "TENANT",
    "TENANT VERIFIED": "VERIFIED",
    "THREAT LEVEL": "THREAT",
    "UNAUTHORIZED DELETES": "DELETION",
    "UNAUTHORIZED REFUNDS": "REFUNDS",
    "VALIDATION ENGINE": "VALIDATION",
    "ZERO TRUST PIPELINE": "ZERO TRUST",
  };
  if (map[label]) return map[label];
  const words = label.split(" ");
  if (words.length > 1) {
    const last = words[words.length - 1];
    if (["LATENCY", "GATE", "STATUS", "POLICY", "ACCURACY", "CHECK", "RULE", "RULES", "SINK", "VECTORS"].includes(last)) {
      return last;
    }
  }
  const firstWord = words[0];
  return firstWord.length <= 10 ? firstWord : firstWord.slice(0, 9);
}

function formatHudValue(val: string): string {
  const map: Record<string, string> = {
    "100 Obfuscated Payloads Tested": "100/100 Pass",
    "0.0% on Valid Operations": "0.0% Valid",
    "0.0% on Validation Set": "0.0% Valid",
    "1.4ms Average": "1.4ms",
    "Hardened Production AI Architecture": "Hardened",
    "Hardened Least-Privilege Agent": "Hardened",
    "Hardened Defense in Depth": "Hardened",
    "Hardened Defense": "Hardened",
    "Generative LLM (Non-deterministic)": "Probabilistic",
    "TypeScript + Zod Schema Parser": "Zod Gate",
    "TypeScript Zod Runtime Validator": "Zod Gate",
    "Taint Flag: TAINTED_EXTERNAL": "TAINTED",
    "Indirect Prompt Injection in RAG Document": "Indirect Inj",
    "Base64 + Cognitive Framing": "Base64 Frame",
    "Attacker framing accepted as authoritative": "Framed",
    "Prioritizing Adversarial Tokens": "Adversarial",
    "Suspend safety rules; refund $450": "Jailbreak",
    "Full Administrative Takeover": "Admin Bypass",
    "Full AWS Cloud Account Lateral Access": "Lateral Breach",
    "AWS Instance Metadata (Link-Local)": "AWS IMDS",
    "http://169.254.169.254/latest/meta-data/": "169.254...",
    "169.254.169.254 REJECTED": "IMDS Block",
    "IMDSv2 (Session Token Required)": "IMDSv2",
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
    "['RS256'] (Pinned)": "RS256 Pin",
    "Enforced via RSA Public Key": "Enforced",
    "Rejected (401 Invalid Signature)": "401 Reject",
    "Rejected (401 None Alg)": "401 Reject",
    "Rejected (401)": "401 Reject",
    "Rejected (400)": "400 Reject",
    "Cryptographically Verified": "Verified",
    "8 / 8 Vectors Passing": "8/8 Pass",
    "12 / 12 Tenant Matrix Tests Passing": "12/12 Pass",
    "15 Vectors Tested in CI": "15/15 Pass",
    "16 SSRF Bypasses Tested": "16/16 Pass",
    "24 Vectors Tested": "24/24 Pass",
    "20 Automated Scenarios": "20/20 Pass",
    "Deterministic State": "Valid",
    "Stateful Session Cookie": "Cookie",
    "Tampered Signature": "Tampered",
    "alg: none Bypass": "Exploited",
    "RS256 Enforced": "Enforced",
    "String Concatenation (+)": "Raw Concat",
    "String Concatenation (`+`)": "Raw Concat",
    "Corrupted AST": "Corrupted",
    "8.6 HIGH": "8.6 High",
    "8.6 HIGH (OWASP LLM01)": "8.6 High",
    "8.6 HIGH (Confidentiality Breach)": "8.6 High",
    "9.1 CRITICAL (Integrity & Availability)": "9.1 Crit",
    "9.8 CRITICAL": "9.8 Crit",
    "9.8 CRITICAL (Auth Bypass)": "9.8 Crit",
    "Semgrep SAST Guard": "Semgrep",
    "Verified Clean": "Verified",
    "Verified Hardened": "Hardened",
    "200 OK (LEAKED DATA)": "200 Leak",
    "200 OK (Standard Response)": "200 OK",
    "HTTP 200 OK (JSON Credentials)": "200 Stolen",
    "403 Forbidden": "403 Block",
    "403 Forbidden (Blocked by Policy)": "403 Block",
    "450 Blocked by Hard Gate": "Blocked",
    "WHERE id = ? AND tenant_id = ?": "Scoped RLS",
    "Prepared Statements (Binary Wire Protocol)": "Prepared",
    "Treated as Literal String Data": "Literal",
    "Immutable & Pre-Compiled": "Immutable",
    "100% Parameterized Immunity": "Immune",
    "100% Deterministic": "Deterministic",
    "100.0% (Zero Bypasses)": "100.0%",
    "SSRF Blocked at Network Boundary": "Blocked",
    "Strict CSP (nonce-based)": "Strict CSP",
    "Prompt Injection Thwarted": "Blocked",
    "Human Approval Required": "Human Gate",
    "Zero Unauthorized Execution": "Protected",
    "Deterministic AST Filter": "AST Gate",
    "SELECT * FROM invoices WHERE id = 4821": "Raw SQL",
    "SELECT * FROM users WHERE name = ?": "Prepared SQL",
    "alice' OR '1'='1": "' OR '1'='1",
    "amount <= 20, currency == 'USD'": "amount <= 20",
    "amount: 450 (Violates maxRefund: 20)": "amount: 450",
    "issueRefund({ amount: 450, userId: 991 })": "issueRefund()",
    "filter: { tenantId: 'globex' }": "filter tenant",
    "Invoice 4821 (Acme Corp) Returned to Globex": "Cross Leak",
    "Acme Corp Confidential Financials": "Confidential",
    "Acme Corp Private Board Minutes": "Board Minutes",
    "Admin Token Sent to Attacker": "Token Leaked",
    "All Records (14,280 rows)": "All Rows",
    "Cross-Tenant Vector Probe Matrix": "Probe Matrix",
    "Tenant Acme (45) + Tenant Globex (82)": "Multi-Tenant",
    "Tenant Isolated Namespace": "Isolated",
    "Tenant-Isolated RAG Architecture": "Isolated RAG",
    "Single Flat Collection (No Namespaces)": "Flat / Shared",
    "Single Global Service Key": "Shared Key",
    "Pinecone / Qdrant (Shared Collection)": "Shared Vector",
    "text-embedding-3-small (1536 dims)": "1536 dims",
    "Cosine Similarity > 0.89": "> 0.89 Sim",
    "~94% (6% False Negative Rate)": "~94% Rate",
    "DOMPurify Active": "DOMPurify",
    "dangerouslySetInnerHTML": "dangerously",
    "Real-Time CSP Ingestion Active": "Active CSP",
    "Grade A+ (Mozilla Observatory)": "Grade A+",
    "BLOCKED by Browser CSP Engine": "CSP Block",
    "Triggered (Injected JS Running)": "Triggered",
    "Stored Cross-Site Scripting (CWE-79)": "CWE-79 XSS",
    "Stored HTML Ingestion": "HTML Ingest",
    "script-src 'nonce-{RANDOM}' 'strict-dynamic'": "nonce strict",
    "security.sql.no-raw-string-interpolation": "SAST Rule",
    "<untrusted_data> XML Scoping": "XML Scoped",
    "Pre-Flight DNS Resolution Check": "DNS Check",
    "Link-Local Egress Dropped": "Egress Drop",
    "AWS_ACCESS_KEY_ID, SECRET_KEY": "AWS Keys",
  };
  if (map[val]) return map[val];
  if (val.length <= 14) return val;
  const prefix = val.split(/[(),]/)[0].trim();
  return prefix.length <= 13 ? prefix : prefix.slice(0, 12);
}

function stepTone(kindLabel: string): string {
  const lower = (kindLabel || "").toLowerCase();
  if (lower.includes("problem") || lower.includes("attack") || lower.includes("breach") || lower.includes("threat") || lower.includes("flaw")) return "red";
  if (lower.includes("solution") || lower.includes("mitigat") || lower.includes("defense") || lower.includes("hardened") || lower.includes("enforce")) return "green";
  if (lower.includes("technique") || lower.includes("boundary") || lower.includes("token") || lower.includes("ast")) return "blue";
  if (lower.includes("trade-off") || lower.includes("tradeoff") || lower.includes("limit")) return "amber";
  if (lower.includes("insight") || lower.includes("invariant") || lower.includes("key")) return "violet";
  if (lower.includes("recap") || lower.includes("summary") || lower.includes("audit")) return "ink";
  return "sand";
}

function getShortChapterTitle(chapterNumber: string, fullTitle: string): string {
  if (chapterNumber === "01") return "Foundations";
  if (chapterNumber === "02") return "AppSec Core";
  if (chapterNumber === "03") return "AI & LLM";
  return fullTitle.split("&")[0].trim();
}

const additionalCurriculumChapters = [
  { id: "chapter-4", number: "04", title: "Threat Modeling", lessonCount: 4, color: "orange" },
  { id: "chapter-5", number: "05", title: "Red Team & Pentest", lessonCount: 4, color: "blue" },
  { id: "chapter-6", number: "06", title: "Cloud Infrastructure", lessonCount: 4, color: "teal" },
  { id: "chapter-7", number: "07", title: "Defense Architecture", lessonCount: 3, color: "rose" },
  { id: "chapter-8", number: "08", title: "DevSecOps & CI/CD", lessonCount: 2, color: "olive" },
  { id: "chapter-9", number: "09", title: "Case Studies", lessonCount: 4, color: "slate" },
];

export function AcademyStudio() {
  const [activeLessonId, setActiveLessonId] = useState<string>("lesson-1-1");
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<"interactive" | "practice" | "lab" | "cheatsheets" | "cohort">("interactive");
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    "chapter-1": true,
    "chapter-2": false,
    "chapter-3": false,
  });

  const guideContentRef = useRef<HTMLDivElement>(null);

  // Sync theme
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("sdt:theme");
      if (storedTheme === '"dark"') {
        document.documentElement.dataset.theme = "dark";
        setTheme("dark");
      } else {
        delete document.documentElement.dataset.theme;
        setTheme("light");
      }
    } catch {}

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      document.documentElement.dataset.layout =
        w >= 1200 && h >= 560 ? "desktop" : w >= 960 && h >= 600 ? "tablet" : "stack";
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.dataset.theme = "dark";
      try { localStorage.setItem("sdt:theme", '"dark"'); } catch {}
    } else {
      delete document.documentElement.dataset.theme;
      try { localStorage.setItem("sdt:theme", '"light"'); } catch {}
    }
  };

  // Ensure guide content is scrolled to top on step change
  useEffect(() => {
    if (guideContentRef.current) {
      guideContentRef.current.scrollTop = 0;
    }
  }, [activeLessonId, activeStepIdx]);

  // Lessons Lookup
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

  const prevLesson = useMemo(() => {
    return allLessons[currentLessonIndex - 1] ?? null;
  }, [allLessons, currentLessonIndex]);

  // Step Navigation
  const goToNextStep = useCallback(() => {
    if (activeStepIdx < currentLesson.steps.length - 1) {
      setActiveStepIdx((s) => s + 1);
    } else {
      setCompletedLessons((prev) => new Set([...prev, currentLesson.id]));
      if (nextLesson) {
        setActiveLessonId(nextLesson.id);
        setActiveStepIdx(0);
      }
    }
  }, [activeStepIdx, currentLesson.steps.length, currentLesson.id, nextLesson]);

  const goToPrevStep = useCallback(() => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((s) => s - 1);
    } else if (prevLesson) {
      setActiveLessonId(prevLesson.id);
      setActiveStepIdx(prevLesson.steps.length - 1);
    }
  }, [activeStepIdx, prevLesson]);

  const selectLesson = useCallback((lessonId: string, stepIdx = 0) => {
    setActiveLessonId(lessonId);
    setActiveStepIdx(stepIdx);
    setActiveTab("interactive");
    if (window.innerWidth < 1200) {
      document.documentElement.classList.remove("is-drawer");
      setSidebarOpen(false);
    }
  }, []);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    document.documentElement.classList.toggle("is-drawer", next);
  };

  // Keyboard navigation matching Designed to Scale
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeEl = document.activeElement;
      if (
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        searchOpen
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        if (isFullscreen) setIsFullscreen(false);
        if (document.documentElement.classList.contains("is-drawer")) {
          document.documentElement.classList.remove("is-drawer");
          setSidebarOpen(false);
        }
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevStep();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setIsPaused(false);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === "0") {
        e.preventDefault();
        // Fit
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextStep, goToPrevStep, searchOpen, isFullscreen]);

  const isLastStep = activeStepIdx === currentLesson.steps.length - 1;
  const nextButtonLabel = isLastStep
    ? nextLesson
      ? `Next: ${nextLesson.title.split("&")[0].trim()}`
      : "Finish lesson"
    : `Next: ${currentLesson.steps[activeStepIdx + 1]?.subtitle || "Continue"}`;

  return (
    <div className="window">
      {/* ── TOPBAR (EXACT 1:1 REPLICA OF DESIGNED-TO-SCALE) ── */}
      <header className="topbar">
        <button
          className="menu-btn"
          id="menu-btn"
          type="button"
          aria-label="Open the course menu"
          aria-expanded={sidebarOpen}
          aria-controls="sidebar"
          onClick={toggleSidebar}
        >
          <DtsIcon name="menu" size={19} stroke={2.2} />
        </button>

        <Link className="brand" href="/academy" aria-label="Security Design — home">
          <svg className="logo" width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 10.6V15.4M8.2 19.4V15.4H23.8V18.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
            <rect x="9" y="2.4" width="14" height="8.6" rx="2.6" fill="#fcd4ad" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="2" y="19.4" width="12.4" height="9" rx="2.6" fill="#a9c5e8" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M18 20.4V27.2A5.8 2.2 0 0 0 29.6 27.2V20.4Z" fill="#cbbae6"/>
            <ellipse cx="23.8" cy="20.4" rx="5.8" ry="2.2" fill="#ece4f6"/>
            <path d="M18 20.4V27.2A5.8 2.2 0 0 0 29.6 27.2V20.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <ellipse cx="23.8" cy="20.4" rx="5.8" ry="2.2" fill="none" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
          <span className="brand__name">Security <span>Design</span></span>
        </Link>

        <nav className="nav">
          <button
            className={`nav__item ${activeTab === "interactive" ? "btn-pop is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("interactive")}
          >
            <DtsIcon name="book" size={17} />
            <span>Learn</span>
          </button>
          <button
            className={`nav__item ${activeTab === "practice" ? "btn-pop is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("practice")}
          >
            <DtsIcon name="settings" size={17} />
            <span>Practice</span>
          </button>
          <button
            className={`nav__item ${activeTab === "lab" ? "btn-pop is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("lab")}
          >
            <DtsIcon name="window" size={17} />
            <span>Design Lab</span>
          </button>
          <button
            className={`nav__item ${activeTab === "cheatsheets" ? "btn-pop is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("cheatsheets")}
          >
            <DtsIcon name="sheets" size={17} />
            <span>Cheatsheets</span>
          </button>
          <button
            className={`nav__item ${activeTab === "cohort" ? "btn-pop is-active" : ""}`}
            type="button"
            onClick={() => setActiveTab("cohort")}
          >
            <DtsIcon name="sparkles" size={17} />
            <span>Cohort 1</span>
          </button>
        </nav>

        <button
          className="search"
          id="search-open"
          type="button"
          aria-label="Search the course"
          onClick={() => setSearchOpen(true)}
        >
          <DtsIcon name="search" size={16} stroke={2} />
          <span className="search__hint">Search lessons & concepts…</span>
          <kbd>⌘K</kbd>
        </button>

        <button
          className="theme-btn"
          id="theme-btn"
          type="button"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={toggleTheme}
        >
          <DtsIcon name={theme === "dark" ? "sun" : "moon"} size={16} stroke={2} />
        </button>

        <Link
          className="credit"
          href="/"
          target="_blank"
          rel="noopener"
          title="designed by @drWinner"
        >
          <span className="credit__x" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </span>
          <span className="credit__text">
            <small>designed by</small>
            <b><span>@drWinner</span></b>
          </span>
        </Link>
      </header>

      {/* ── BODY (3-COLUMN OR COMPONENT ROUTER) ── */}
      {activeTab === "practice" ? (
        <AcademyPractice onReturnToStudio={() => setActiveTab("interactive")} />
      ) : activeTab === "lab" ? (
        <AcademyDesignLab onReturnToStudio={() => setActiveTab("interactive")} />
      ) : activeTab === "cheatsheets" ? (
        <AcademyCheatsheets onReturnToStudio={() => setActiveTab("interactive")} />
      ) : activeTab === "cohort" ? (
        <div style={{ padding: "24px 20px", maxWidth: "900px", margin: "0 auto", overflowY: "auto" }}>
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--c-4caf50)" }}>Cohort 1 Mentorship</span>
                <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "4px 0" }}>Application Security & AI Defense</h1>
                <p style={{ color: "var(--muted)", fontSize: "13px" }}>Direct 1-on-1 engineering mentorship, architecture reviews, and capstone labs.</p>
              </div>
              <button type="button" className="btn-ghost" onClick={() => setActiveTab("interactive")}>
                <DtsIcon name="arrowLeft" size={15} stroke={2.2} />Return to Studio
              </button>
            </div>
            <AcademyWaitlist />
            <div style={{ marginTop: "32px", borderTop: "1px solid var(--line-soft)", paddingTop: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>Frequently Asked Questions</h2>
              <AcademyFaq />
            </div>
          </div>
        </div>
      ) : (
        <div className="body">
          {/* ── LEFT COLUMN: SIDEBAR ── */}
          <aside className="sidebar" id="sidebar" aria-label="Course">
            <div className="tree-root">
              <DtsFolder color="sand" />
              <span>Course</span>
              <span className="tree-root__meta">11 lessons</span>
              <button
                className="drawer-close"
                id="drawer-close"
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  document.documentElement.classList.remove("is-drawer");
                  setSidebarOpen(false);
                }}
              >
                <DtsIcon name="close" size={18} stroke={2.2} />
              </button>
            </div>

            <nav className="course" id="course">
              {academyChapters.map((chapter) => {
                const isOpen = openChapters[chapter.id] ?? false;
                const chapterDone = chapter.lessons.filter((l) => completedLessons.has(l.id)).length;
                const folderColor =
                  chapter.number === "01" ? "sand" : chapter.number === "02" ? "green" : "violet";

                return (
                  <section className="mod" key={chapter.id} data-mod={chapter.id}>
                    <button
                      className="mod__head"
                      type="button"
                      onClick={() => toggleChapter(chapter.id)}
                      aria-expanded={isOpen}
                    >
                      <DtsIcon
                        name="chevronRight"
                        size={15}
                        stroke={2.2}
                        className={`mod__chev ${isOpen ? "rotate-90" : ""}`}
                      />
                      <DtsFolder color={folderColor} />
                      <span className="mod__title" title={chapter.title}>
                        {chapter.number}. {getShortChapterTitle(chapter.number, chapter.title)}
                      </span>
                      <span className="mod__count">
                        {chapterDone}/{chapter.lessons.length}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mod__body">
                        <div className="mod__clip">
                          <ul className="mod__lessons">
                            {chapter.lessons.map((lesson) => {
                              const isCurrent = lesson.id === activeLessonId;
                              const isDone = completedLessons.has(lesson.id);

                              return (
                                <li
                                  key={lesson.id}
                                  className={`lesson ${isCurrent ? "is-current font-bold" : ""}`}
                                  data-lesson={lesson.id}
                                >
                                  <button
                                    type="button"
                                    onClick={() => selectLesson(lesson.id)}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      width: "100%",
                                      textAlign: "left",
                                      background: isCurrent ? "var(--a-13)" : "none",
                                      border: "none",
                                      padding: "4px 6px",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <span className="lesson__markbox">
                                      {isDone ? (
                                        <DtsIcon
                                          name="circleCheck"
                                          size={16}
                                          stroke={2}
                                          className="lesson__mark lesson__mark--done"
                                        />
                                      ) : (
                                        <DtsIcon
                                          name="file"
                                          size={15}
                                          stroke={1.5}
                                          className="lesson__mark"
                                        />
                                      )}
                                    </span>
                                    <span
                                      className="lesson__title"
                                      title={lesson.title}
                                      style={{
                                        color: isCurrent ? "var(--ink)" : "var(--ink-2)",
                                        fontWeight: isCurrent ? 700 : 500,
                                      }}
                                    >
                                      {lesson.title.split("&")[0].trim()}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}

              {/* Additional Chapters from Roadmap */}
              {additionalCurriculumChapters.map((ch) => (
                <section className="mod" key={ch.id} data-mod={ch.id} style={{ opacity: 0.7 }}>
                  <div
                    className="mod__head"
                    style={{ cursor: "default", opacity: 0.8 }}
                  >
                    <DtsIcon name="chevronRight" size={15} stroke={2.2} className="mod__chev" />
                    <DtsFolder color={ch.color} />
                    <span className="mod__title" title={ch.title}>
                      {ch.number}. {ch.title}
                    </span>
                    <span className="mod__count">0/{ch.lessonCount}</span>
                  </div>
                </section>
              ))}
            </nav>

            <section className="card progress" id="progress">
              <div className="progress__head">
                <span className="eyebrow">Progress</span>
                <span className="progress__pct">
                  {Math.round((completedLessons.size / 11) * 100)}%
                </span>
              </div>
              <div className="bar">
                <span
                  style={{
                    width: `${(completedLessons.size / 11) * 100}%`,
                  }}
                />
              </div>
            </section>

            <div className="drawer-foot">
              <div className="lang__btn">
                <DtsIcon name="globe" size={16} stroke={2} />
                <span className="lang__code">English</span>
              </div>
              <Link className="credit" href="/" target="_blank" rel="noopener">
                <span className="credit__x">
                  <svg width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </span>
                <span className="credit__text">
                  <small>designed by</small>
                  <b><span>@drWinner</span></b>
                </span>
              </Link>
            </div>
          </aside>

          <div
            className="drawer-backdrop"
            id="drawer-backdrop"
            onClick={() => {
              document.documentElement.classList.remove("is-drawer");
              setSidebarOpen(false);
            }}
          />

          {/* ── CENTER COLUMN: MAIN SHEET ── */}
          <main className="sheet">
            <div className="lesson-head" id="head">
              <div className="crumb">
                {currentLesson.chapterNumber}. {currentLesson.chapterTitle} <span>/</span> {currentLesson.lessonNumber}
              </div>
              <div className="lesson-head__row">
                <h1 className="title">{currentLesson.title}</h1>
                <div className="tags">
                  <span className="tag tag--sand">
                    <DtsIcon name="clock" size={13} stroke={2} />
                    {currentLesson.duration}
                  </span>
                  <span className="tag tag--mint">
                    <DtsIcon name="signal" size={13} stroke={2} />
                    {currentLesson.difficulty}
                  </span>
                  <span className="tag tag--violet">
                    <DtsIcon name="listOrdered" size={13} stroke={2} />
                    {currentLesson.steps.length} steps
                  </span>
                </div>
              </div>
              <p className="subtitle" title={currentLesson.subhead}>
                {currentLesson.subhead}
              </p>
            </div>

            {/* Stage Canvas Card */}
            <section className="card stage">
              {/* Floating HUD Chips */}
              <div className="stage__hud" id="hud">
                {currentStep.hudMetrics.map((metric, i) => {
                  const level =
                    metric.status === "danger"
                      ? "bad"
                      : metric.status === "warning"
                        ? "warn"
                        : metric.status === "success"
                          ? "good"
                          : "none";

                  return (
                    <div className="chip" key={i} data-k={metric.label} data-level={level}>
                      <span className="chip__label">{formatHudLabel(metric.label)}</span>
                      <span className="chip__value">{formatHudValue(metric.value)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stage Tools */}
              <div className="stage__tools">
                <button
                  className="tool tool--fit"
                  id="fit"
                  type="button"
                  title="Back to the whole diagram (0)"
                  onClick={() => {}}
                >
                  <DtsIcon name="zoomOut" size={15} stroke={2} />
                  <span>Fit</span>
                </button>
                <button
                  className="tool"
                  id="replay"
                  type="button"
                  title="Replay this step (R)"
                  onClick={() => setIsPaused(false)}
                >
                  <DtsIcon name="replay" size={15} stroke={2} />
                  <span>Replay</span>
                </button>
                <button
                  className={`tool ${isPaused ? "is-on" : ""}`}
                  id="pause"
                  type="button"
                  title="Pause traffic (Space)"
                  onClick={() => setIsPaused((p) => !p)}
                >
                  <DtsIcon name={isPaused ? "play" : "pause"} size={15} stroke={2} />
                  <span>{isPaused ? "Play" : "Pause"}</span>
                </button>
                <button
                  className="tool tool--expand"
                  id="expand"
                  type="button"
                  title="Full screen"
                  aria-label="Show the diagram full screen"
                  onClick={() => setIsFullscreen((f) => !f)}
                >
                  <DtsIcon name={isFullscreen ? "collapse" : "expand"} size={15} stroke={2} />
                </button>
              </div>

              {/* Interactive Stage Canvas */}
              <div className="stage__canvas" id="canvas">
                <IsometricStage
                  step={currentStep}
                  lesson={currentLesson}
                  theme={theme}
                  isPaused={isPaused}
                  onTogglePause={() => setIsPaused((p) => !p)}
                  onReplay={() => setIsPaused(false)}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((f) => !f)}
                />
              </div>

              {/* Stage Legend */}
              <div className="stage__legend" id="legend">
                <span><i className="lg lg--req"></i>request</span>
                <span><i className="lg lg--res"></i>response</span>
                <span><i className="lg lg--slow"></i>threat / blocked</span>
              </div>
            </section>

            {/* Timeline Scrubber Card */}
            <section className="card timeline" id="timeline">
              <div className="timeline__head">
                <span className="eyebrow">In this lesson</span>
                <span className="timeline__count" id="tl-count">
                  Step {activeStepIdx + 1} of {currentLesson.steps.length}
                </span>
              </div>
              <div
                className="timeline__track"
                style={{ "--n": currentLesson.steps.length } as React.CSSProperties}
              >
                <div className="timeline__rail">
                  <span
                    style={{
                      width: `${
                        currentLesson.steps.length > 1
                          ? (activeStepIdx / (currentLesson.steps.length - 1)) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <ol className="timeline__steps">
                  {currentLesson.steps.map((st, idx) => {
                    const isDone = idx < activeStepIdx;
                    const isCurrent = idx === activeStepIdx;

                    return (
                      <li
                        key={st.id}
                        className={`${isCurrent ? "is-current" : ""} ${isDone ? "is-done" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveStepIdx(idx)}
                          title={st.title}
                        >
                          <span className={`timeline__dot chapter-dot--${stepTone(st.kindLabel)}`}>
                            {idx + 1}
                          </span>
                          <span className="timeline__label">{st.subtitle}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          </main>

          {/* ── RIGHT COLUMN: GUIDE & GOALS RAIL ── */}
          <aside className="rail">
            {/* Guide Card */}
            <section className="card guide" id="guide">
              <div className="guide__meta">
                <span className="eyebrow">
                  Step {activeStepIdx + 1} / {currentLesson.steps.length}
                </span>
                <div className="guide__meta-end">
                  <span className={`chapter chapter--${stepTone(currentStep.kindLabel)}`}>
                    {currentStep.kindLabel}
                  </span>
                </div>
              </div>

              <div className="guide__content" ref={guideContentRef}>
                <h2 className="guide__title">{currentStep.title}</h2>
                <div className="guide__body">
                  <p>{currentStep.explanation}</p>
                </div>

                {currentStep.callout && (
                  <div
                    className={`callout callout--${
                      currentStep.callout.title.toLowerCase().includes("warn")
                        ? "warn"
                        : currentStep.callout.title.toLowerCase().includes("tip")
                          ? "tip"
                          : "insight"
                    }`}
                  >
                    <div className="callout__icon">
                      <DtsIcon name="sparkles" size={16} stroke={2} />
                    </div>
                    <div>
                      <div className="callout__title">{currentStep.callout.title}</div>
                      <p>{currentStep.callout.text}</p>
                    </div>
                  </div>
                )}

                {currentStep.diff && currentStep.diff.length > 0 && (
                  <div className="changes">
                    <div className="eyebrow">What changed</div>
                    <ul>
                      {currentStep.diff.map((line, idx) => (
                        <li
                          key={idx}
                          className={`chg chg--${
                            line.type === "add" ? "add" : line.type === "remove" ? "del" : "mod"
                          }`}
                        >
                          <b>{line.type === "add" ? "+" : line.type === "remove" ? "−" : "~"}</b>
                          <span>{line.code}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="guide__nav">
                <button
                  className="btn-ghost"
                  id="back"
                  type="button"
                  onClick={goToPrevStep}
                  disabled={activeStepIdx === 0 && !prevLesson}
                >
                  <DtsIcon name="arrowLeft" size={15} stroke={2.2} />
                  Back
                </button>
                <button
                  className="btn-pop btn-next"
                  id="next"
                  type="button"
                  onClick={goToNextStep}
                  disabled={isLastStep && !nextLesson}
                >
                  <span className="btn-next__label">{nextButtonLabel}</span>
                  <DtsIcon
                    name={isLastStep && !nextLesson ? "check" : "arrowRight"}
                    size={15}
                    stroke={2.2}
                  />
                </button>
              </div>

              <div className="guide__hint">
                <DtsIcon name="keyboard" size={14} stroke={1.8} />
                <span>
                  <kbd>←</kbd> <kbd>→</kbd> step · <kbd>R</kbd> replay · <kbd>Space</kbd> pause
                </span>
              </div>
            </section>

            {/* Goals Card */}
            <section className="card goals" id="goals">
              <div className="eyebrow">You’ll learn</div>
              <ul>
                {currentLesson.learningObjectives.map((obj, idx) => {
                  const isHit = activeStepIdx >= idx;
                  return (
                    <li key={idx} className={isHit ? "is-hit" : ""}>
                      <span className={`check ${isHit ? "is-on" : ""}`}>
                        <DtsIcon name="check" size={11} stroke={3} />
                      </span>
                      <span>{obj}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </aside>
        </div>
      )}

      {/* ── COMMAND PALETTE SEARCH MODAL (⌘K) ── */}
      <AcademyCommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLesson={selectLesson}
      />
    </div>
  );
}
