"use client";

import { useState } from "react";

interface CheatsheetSection {
  id: string;
  title: string;
  badge: string;
  items: {
    rule: string;
    description: string;
    badCode?: string;
    goodCode?: string;
    metric?: string;
  }[];
}

const cheatsheetSections: CheatsheetSection[] = [
  {
    id: "appsec",
    title: "OWASP AppSec Top 10 Production Rules",
    badge: "AppSec",
    items: [
      {
        rule: "1. BOLA / IDOR Defense (Tenant Isolation)",
        description: "Never trust client-supplied record IDs. Every database SELECT, UPDATE, or DELETE must bind the caller's verified tenant_id or user_id.",
        badCode: `SELECT * FROM invoices WHERE id = :id;`,
        goodCode: `SELECT * FROM invoices WHERE id = :id AND tenant_id = :session_tenant_id;`,
      },
      {
        rule: "2. SSRF & Cloud Metadata (IMDSv2)",
        description: "Enforce AWS IMDSv2 token exchange with a hop limit of 1. Block egress to link-local address 169.254.169.254 and private subnets from image fetchers.",
        badCode: `fetch(userProvidedUrl); // Blind SSRF to internal VPC or cloud metadata`,
        goodCode: `validatePublicIpOnly(userProvidedUrl); // Enforce allowlist, resolve DNS, ban 169.254.0.0/16`,
      },
      {
        rule: "3. SQL Injection (Deterministic Parameterization)",
        description: "String concatenation in SQL queries allows control-plane hijacking. Use parameterized placeholders ($1, ?) without exception.",
        badCode: `db.query("SELECT * FROM users WHERE email = '" + email + "'");`,
        goodCode: `db.query("SELECT * FROM users WHERE email = $1", [email]);`,
      },
      {
        rule: "4. Strict Content Security Policy (XSS Defense)",
        description: "Deploy strict CSP with cryptographic nonces and ban 'unsafe-inline'.",
        badCode: `Content-Security-Policy: default-src * 'unsafe-inline' 'unsafe-eval';`,
        goodCode: `Content-Security-Policy: default-src 'self'; script-src 'nonce-rAnd0m123' 'strict-dynamic'; object-src 'none';`,
      },
    ],
  },
  {
    id: "ai-sec",
    title: "OWASP LLM & AI Agent Security Top 10",
    badge: "AI / LLM",
    items: [
      {
        rule: "1. Direct & Indirect Prompt Injection Boundary",
        description: "Treat all external retrieved content (emails, web pages, PDFs, search results) as untrusted user data. Never concatenate raw text into the system prompt.",
        badCode: `const prompt = \`System: \${rules}\\nUser query: \${emailBody}\`;`,
        goodCode: `messages: [ { role: 'system', content: rules }, { role: 'user', content: sanitizeDataPlane(emailBody) } ]`,
      },
      {
        rule: "2. Excessive Agency & Tool Authorization Gate",
        description: "Autonomous agents must not execute high-impact mutations (funds transfer, user deletion, schema drop) without out-of-band deterministic human approval.",
        badCode: `if (agentCall.tool === 'delete_user') executeDelete(agentCall.args);`,
        goodCode: `if (agentCall.tool === 'delete_user') requestHumanInTheLoopApproval(agentCall);`,
      },
      {
        rule: "3. Vector Retrieval & RAG Multi-Tenant Isolation",
        description: "Vector similarity search ignores tenant boundaries unless hard-filtered in metadata. Always add tenant metadata filters to vector similarity queries.",
        badCode: `vectorDb.search(queryEmbedding, { limit: 5 });`,
        goodCode: `vectorDb.search(queryEmbedding, { filter: { tenant_id: session.tenant_id }, limit: 5 });`,
      },
    ],
  },
  {
    id: "latency",
    title: "Security & System Latency Numbers Every Engineer Should Know",
    badge: "Latency",
    items: [
      {
        rule: "L1 Cache Reference",
        description: "Hardware L1 cache read",
        metric: "1 ns",
      },
      {
        rule: "Mutex Lock / Unlock",
        description: "Fast in-process synchronization",
        metric: "17 ns",
      },
      {
        rule: "Main Memory Reference",
        description: "RAM access fetch",
        metric: "100 ns",
      },
      {
        rule: "AES-GCM Encryption (1 KB)",
        description: "Hardware AES-NI symmetric encryption",
        metric: "0.2 µs",
      },
      {
        rule: "SHA-256 Hash Calculation (1 KB)",
        description: "Cryptographic digest computation",
        metric: "1.5 µs",
      },
      {
        rule: "TLS 1.3 Handshake (Resumption)",
        description: "0-RTT or 1-RTT cryptographic session establishment",
        metric: "10 – 30 ms",
      },
      {
        rule: "Cross-Continent Packet Round Trip",
        description: "Speed-of-light in fiber cable (Accra to London / US)",
        metric: "80 – 160 ms",
      },
    ],
  },
];

export function AcademyCheatsheets({ onReturnToStudio }: { onReturnToStudio: () => void }) {
  const [activeSection, setActiveSection] = useState<string>("appsec");

  const current = cheatsheetSections.find((s) => s.id === activeSection) ?? cheatsheetSections[0];

  return (
    <div className="max-w-4xl mx-auto w-full py-4 space-y-6">
      <div className="scale-card">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#26201b]/10 pb-4 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#10b981]">
              <span>📑 REFERENCE CHEATSHEETS</span>
              <span>•</span>
              <span>Production Security Rules</span>
            </div>
            <h1 className="mt-1 text-[24px] sm:text-[28px] font-mono font-bold text-[#26201b]">
              Security & Latency Cheatsheets
            </h1>
            <p className="mt-1.5 text-[13.5px] text-[#26201b]/70 max-w-[60ch]">
              Hardened rules for AppSec, LLM agent boundaries, multi-tenant isolation, and critical latency budgets.
            </p>
          </div>

          <button
            type="button"
            onClick={onReturnToStudio}
            className="scale-btn-back self-start sm:self-auto"
          >
            ← Back to Studio
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-[#26201b]/10 pb-3 mb-6 overflow-x-auto">
          {cheatsheetSections.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`rounded-lg px-3 py-1.5 font-mono text-[12px] font-bold transition-all ${
                activeSection === sec.id
                  ? "bg-[#c5e8b7] text-[#1b4332] border-[1.5px] border-[#26201b] shadow-sm"
                  : "text-[#26201b]/70 hover:text-[#26201b]"
              }`}
            >
              {sec.title.split(" ")[0]} ({sec.badge})
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          <h2 className="text-[19px] font-bold text-[#26201b]">
            {current.title}
          </h2>

          <div className="space-y-4">
            {current.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border-[1.5px] border-[#26201b] bg-[#ffffff] p-4 shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <h3 className="font-bold text-[14px] text-[#26201b]">
                    {item.rule}
                  </h3>
                  {item.metric && (
                    <span className="rounded bg-[#c5e8b7] text-[#1b4332] border border-[#26201b] px-2 py-0.5 font-extrabold text-[11.5px]">
                      {item.metric}
                    </span>
                  )}
                </div>

                <p className="text-[13px] leading-relaxed text-[#26201b]/80">
                  {item.description}
                </p>

                {(item.badCode || item.goodCode) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 font-mono text-[11.5px]">
                    {item.badCode && (
                      <div className="rounded-lg border border-[#ef4444]/40 bg-[#fee2e2]/40 p-2.5 text-[#991b1b]">
                        <p className="text-[10px] font-bold uppercase mb-1">❌ Vulnerable Pattern</p>
                        <code className="text-[11px] block overflow-x-auto">{item.badCode}</code>
                      </div>
                    )}
                    {item.goodCode && (
                      <div className="rounded-lg border border-[#10b981]/40 bg-[#dcfce7]/40 p-2.5 text-[#14532d]">
                        <p className="text-[10px] font-bold uppercase mb-1">✓ Hardened Pattern</p>
                        <code className="text-[11px] block overflow-x-auto">{item.goodCode}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
