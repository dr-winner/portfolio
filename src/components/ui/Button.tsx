import Link from "next/link";
import type { ReactNode } from "react";
import { cvDownloadName, cvHref } from "@/content/site";

const styles = {
  primary:
    "btn-sweep border border-transparent bg-[var(--signal)] font-medium text-[var(--on-signal)] hover:brightness-110",
  secondary:
    "border border-[var(--line-strong)] font-medium text-[var(--fg)] hover:border-[var(--signal)] hover:text-[var(--signal)] active:translate-y-px",
  ghost:
    "text-[var(--fg-muted)] hover:text-[var(--signal)] active:translate-y-px",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  download = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  download?: boolean;
}) {
  const className = `inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 text-[length:var(--step-0)] no-underline ${styles[variant]}`;
  const isCv = download || href === cvHref;
  if (href.startsWith("mailto:") || href.startsWith("http") || isCv) {
    // The CV is a plain anchor: no router prefetch, so no /cv.pdf?_rsc 404s.
    return (
      <a className={className} href={href} {...(isCv ? { download: cvDownloadName } : {})} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
