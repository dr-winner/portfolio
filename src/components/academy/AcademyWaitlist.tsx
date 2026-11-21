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
      <div className="rounded-2xl border-2 border-[#26201b] bg-[#fbf8f3] p-6 sm:p-8 md:p-10 shadow-[2px_2px_0px_#26201b]">
        {status === "success" ? (
          <div className="flex flex-col items-center py-6 text-center animate-[fadeIn_0.25s_ease-out]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#26201b] bg-[#c5e8b7] text-[#1b4332] shadow-[1px_1px_0px_#26201b]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h3 className="mt-5 text-[22px] font-mono font-bold tracking-tight text-[#26201b]">
              {alreadyRegistered ? "You're already on the priority list." : "Application Received."}
            </h3>

            <p className="mt-2.5 max-w-[44ch] text-[13.5px] leading-relaxed text-[#26201b]/80">
              Thank you for applying. Richard personally reviews every submission to ensure strong cohort peer chemistry and syllabus alignment. Look out for an email from{" "}
              <span className="font-mono font-bold text-[#1b4332]">{site.email}</span> with cohort onboarding details.
            </p>

            {count !== null && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#26201b]/30 bg-[#c5e8b7]/40 px-3.5 py-1 font-mono text-[12px] font-bold text-[#1b4332]">
                <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
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
              className="scale-btn-back mt-8 text-[13px]"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-[#26201b]/15 pb-5">
              <div>
                <p className="font-mono text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#10b981]">
                  Cohort 1 Application
                </p>
                <h3 className="mt-1 text-[22px] sm:text-[26px] font-mono font-extrabold tracking-tight text-[#26201b]">
                  Apply for the Next Mentorship Cohort
                </h3>
              </div>

              {count !== null && (
                <div className="flex items-center gap-2 rounded-full border border-[#26201b]/30 bg-[#ffffff] px-3 py-1 font-mono text-[11.5px] font-bold text-[#26201b]/80 shadow-[1px_1px_0px_rgba(38,32,27,0.06)]">
                  <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                  <span>{count} applications in pool</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="academy-email" className="block font-mono text-[11.5px] font-bold text-[#26201b]/80">
                    Work or personal email <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    id="academy-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-1.5 w-full rounded-xl border-2 border-[#26201b]/25 bg-[#ffffff] px-3.5 py-2.5 font-mono text-[13px] text-[#26201b] placeholder-[#26201b]/40 focus:border-[#26201b] focus:outline-none transition-colors shadow-[1px_1px_0px_rgba(38,32,27,0.06)]"
                  />
                </div>

                <div>
                  <label htmlFor="academy-name" className="block font-mono text-[11.5px] font-bold text-[#26201b]/80">
                    Your name
                  </label>
                  <input
                    id="academy-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="mt-1.5 w-full rounded-xl border-2 border-[#26201b]/25 bg-[#ffffff] px-3.5 py-2.5 font-mono text-[13px] text-[#26201b] placeholder-[#26201b]/40 focus:border-[#26201b] focus:outline-none transition-colors shadow-[1px_1px_0px_rgba(38,32,27,0.06)]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="academy-role" className="block font-mono text-[11.5px] font-bold text-[#26201b]/80">
                    Current role / Engineering background
                  </label>
                  <input
                    id="academy-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Full-Stack Dev, Security Analyst, etc."
                    className="mt-1.5 w-full rounded-xl border-2 border-[#26201b]/25 bg-[#ffffff] px-3.5 py-2.5 font-mono text-[13px] text-[#26201b] placeholder-[#26201b]/40 focus:border-[#26201b] focus:outline-none transition-colors shadow-[1px_1px_0px_rgba(38,32,27,0.06)]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11.5px] font-bold text-[#26201b]/80">
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
                        className={`rounded-xl border-2 px-2 py-2 text-center font-mono text-[11.5px] font-bold transition-all duration-150 ${
                          focus === opt.id
                            ? "border-[#26201b] bg-[#c5e8b7] text-[#1b4332] shadow-[1px_1px_0px_#26201b]"
                            : "border-[#26201b]/20 bg-[#ffffff] text-[#26201b]/70 hover:border-[#26201b]/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {message && (
                <div className="rounded-xl border-2 border-[#ef4444] bg-[#fee2e2] p-3 font-mono text-[12.5px] font-bold text-[#991b1b]">
                  {message}
                </div>
              )}

              <div className="mt-2 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="scale-btn-next !py-2.5 !px-6 !text-[14px]"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Submitting application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>

                <p className="text-[12px] font-mono text-[#26201b]/70">
                  Prefer direct communication?{" "}
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent("Cybersecurity Mentorship Cohort Inquiry")}`}
                    className="font-bold text-[#1b4332] underline hover:text-[#10b981]"
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
