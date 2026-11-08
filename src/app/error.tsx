"use client";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-[68ch] flex-col justify-center px-6">
      <h1 className="text-[length:var(--step-3)]">This page failed to load.</h1>
      <p className="mt-3 text-[var(--fg-muted)]">Reference {error.digest ?? "unknown"}.</p>
    </main>
  );
}
