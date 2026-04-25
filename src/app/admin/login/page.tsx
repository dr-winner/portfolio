"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, TerminalSquare } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

export default function LoginPage() {
  const sp = useSearchParams();
  const from = sp.get("from") ?? "/admin";
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <main className="min-h-screen bg-ink px-4 flex items-center justify-center">
      <form
        action={action}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-glow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex size-10 items-center justify-center rounded-lg border border-cyber-300/30 bg-cyber-300/[0.06] text-cyber-300">
            <TerminalSquare className="size-5" />
          </div>
          <div>
            <h1 className="font-display text-xl tracking-tight text-white">Admin console</h1>
            <p className="text-xs text-white/50">Sign in to manage your portfolio.</p>
          </div>
        </div>

        <input type="hidden" name="from" value={from} />

        <label className="mt-8 block">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
            Username
          </span>
          <input
            name="username"
            autoComplete="username"
            className="mt-2 w-full rounded-lg border border-white/10 bg-ink-100 px-3 py-2.5 text-sm text-white outline-none focus:border-cyber-300/60"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-ink-100 px-3 py-2.5 text-sm text-white outline-none focus:border-cyber-300/60"
          />
        </label>

        {state?.error && (
          <p className="mt-4 rounded-lg border border-threat-400/30 bg-threat-400/[0.07] px-3 py-2 text-xs text-threat-400">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-white/90 disabled:opacity-60"
        >
          <Lock className="size-4" />
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
