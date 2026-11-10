/* Skip link, brief 3.2: a 40px pill that is the first focusable element on
   the page, hidden above the fold and swinging in on keyboard focus. The
   desktop version jumps to the classic view, the classic version jumps to
   the document body. */

import Link from "next/link";

export function SkipLink({ variant, href }: { variant: "to-classic" | "to-content"; href: string }) {
  const label = variant === "to-classic" ? "Skip to classic view" : "Skip to content";
  return (
    <Link href={href} className="wos-skip">
      {label}
    </Link>
  );
}
