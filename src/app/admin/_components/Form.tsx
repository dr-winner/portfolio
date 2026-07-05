"use client";

import clsx from "clsx";
import { useFormStatus } from "react-dom";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={clsx("block", className)}>
      {label && (
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/45">
          {label}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-[11px] text-white/40">{hint}</span>}
    </label>
  );
}

const inputBase =
  "mt-2 w-full rounded-lg border border-white/10 bg-ink-100 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyber-300/60";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(inputBase, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx(inputBase, "min-h-[90px]", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(inputBase, "appearance-none pr-8", props.className)}
    />
  );
}

export function SubmitButton({
  children = "Save",
  className,
  variant = "primary",
}: {
  children?: ReactNode;
  className?: string;
  variant?: "primary" | "danger";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-60",
        variant === "primary"
          ? "bg-white text-ink hover:bg-white/90"
          : "border border-threat-400/40 bg-threat-400/[0.08] text-threat-400 hover:bg-threat-400/[0.14]",
        className
      )}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
          {subtitle ?? "Admin"}
        </p>
        <h1 className="mt-2 font-display text-2xl tracking-tight text-white">{title}</h1>
      </div>
      {action}
    </div>
  );
}
