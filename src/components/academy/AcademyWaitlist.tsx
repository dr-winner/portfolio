"use client";

import { useState, useEffect } from "react";
import { site } from "@/content/site";

type Status = "idle" | "loading" | "success" | "error";

export function AcademyWaitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [focus, setFocus] = useState<"appsec" | "ai_security" | "both">("both");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setCount(data.count);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role, focus }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Failed to submit. Please try again or email directly.");
        setStatus("error");
      } else {
        if (data.alreadyExists) {
          setAlreadyRegistered(true);
        }
        if (typeof data.count === "number") {
          setCount(data.count);
        } else {
          setCount((c) => (c ? c + 1 : 25));
        }
        setStatus("success");
      }
    } catch {
      setMessage("Network error. Please try again or reach out directly via email.");
      setStatus("error");
    }
  }

  return (
    <div id="apply" className="relative">
      <div className="panel relative overflow-hidden p-6 sm:p-8 md:p-10 border border-[var(--line-strong)]">
        {/* Subtle radial ambient spotlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[var(--glow-signal)] opacity-40 blur-3xl"
        />

        {status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center animate-[fadeIn_0.25s_ease-out]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--signal)] bg-[var(--signal-soft)] text-[var(--signal)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h3 className="mt-5 text-[length:var(--step-2)] font-medium tracking-tight text-[var(--fg)]">
              {alreadyRegistered ? "You're already on the priority list." : "Application Received."}
            </h3>

            <p className="mt-2.5 max-w-[44ch] text-[14px] leading-relaxed text-[var(--fg-muted)]">
              Thank you for applying. Richard personally reviews every submission to ensure strong cohort peer chemistry and syllabus alignment. Look out for an email from{" "}
              <span className="font-mono text-[var(--signal)]">{site.email}</span> with cohort onboarding details.
            </p>

            {count !== null && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)] px-3.5 py-1 font-mono text-[12px] text-[var(--signal)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)] animate-pulse" />
                <span>{count} engineers currently registered on waitlist</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setEmail("");
                setName("");
                setRole("");
                setAlreadyRegistered(false);
              }}
              className="btn btn-secondary mt-8 text-[13px]"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--line)] pb-5">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--signal)]">Cohort 1 Application</p>
                <h3 className="mt-1 text-[length:var(--step-2)] font-medium tracking-tight text-[var(--fg)]">
                  Apply for the Next Mentorship Cohort
                </h3>
              </div>

              {count !== null && (
                <div className="flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface-2)] px-3 py-1 font-mono text-[11.5px] text-[var(--fg-muted)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--signal)]" />
                  <span>{count} applications in pool</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="academy-email" className="block font-mono text-[11.5px] text-[var(--fg-muted)]">
                    Work or personal email <span className="text-[var(--signal)]">*</span>
                  </label>
                  <input
                    id="academy-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[var(--bg-deep)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:border-[var(--signal)] focus:outline-none focus:ring-1 focus:ring-[var(--signal)]"
                  />
                </div>

                <div>
                  <label htmlFor="academy-name" className="block font-mono text-[11.5px] text-[var(--fg-muted)]">
                    Your name
                  </label>
                  <input
                    id="academy-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[var(--bg-deep)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:border-[var(--signal)] focus:outline-none focus:ring-1 focus:ring-[var(--signal)]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="academy-role" className="block font-mono text-[11.5px] text-[var(--fg-muted)]">
                    Current role / Engineering background
                  </label>
                  <input
                    id="academy-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Full-Stack Dev, Security Analyst, etc."
                    className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[var(--bg-deep)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:border-[var(--signal)] focus:outline-none focus:ring-1 focus:ring-[var(--signal)]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11.5px] text-[var(--fg-muted)]">
                    Primary learning focus
                  </label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[
                      { id: "both", label: "Both (All 4)" },
                      { id: "appsec", label: "AppSec (Web)" },
                      { id: "ai_security", label: "AI / LLM" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFocus(opt.id as "appsec" | "ai_security" | "both")}
                        className={`rounded-lg border px-2 py-2 text-center font-mono text-[11.5px] transition-all duration-150 ${
                          focus === opt.id
                            ? "border-[var(--signal)] bg-[var(--signal-soft)] text-[var(--signal)] font-medium"
                            : "border-[var(--line)] bg-[var(--bg-deep)] text-[var(--fg-muted)] hover:border-[var(--line-strong)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {message && (
                <div className="rounded-lg border border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_12%,transparent)] p-3 text-[13px] text-[var(--warn)]">
                  {message}
                </div>
              )}

              <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-[13.5px] disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Submitting application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>

                <p className="text-[12px] text-[var(--fg-subtle)]">
                  Prefer direct communication?{" "}
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent("Cybersecurity Mentorship Cohort Inquiry")}`}
                    className="font-mono text-[var(--signal)] no-underline hover:underline"
                  >
                    Email Richard directly
                  </a>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
