"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <h1>This page failed to load.</h1>
        <p>Reference {error.digest ?? "unknown"}.</p>
      </body>
    </html>
  );
}
