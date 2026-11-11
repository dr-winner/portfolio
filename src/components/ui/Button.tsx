import Link from "next/link";
import type { ReactNode } from "react";
import { cvDownloadName, cvHref } from "@/content/site";

const styles = {
  primary:
    "btn-primary btn-sweep pressable border border-transparent bg-[var(--signal)] font-medium text-[var(--on-signal)] hover:brightness-110",
  secondary:
    "pressable border border-[var(--line-strong)] font-medium text-[var(--fg)] hover:border-[var(--signal)] hover:text-[var(--signal)]",
  ghost:
    "pressable text-[var(--fg-muted)] hover:text-[var(--signal)]",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  download = false,
  magnet = false,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  download?: boolean;
  magnet?: boolean;
}) {
  const className = `inline-flex h-11 min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 text-[16px] no-underline ${styles[variant]}`;
  const isCv = download || href === cvHref;
  const inner = magnet ? (
    <span className="magnet-visual">
      <span className="magnet-label">{children}</span>
    </span>
  ) : (
    children
  );
  const magnetProps = magnet ? ({ "data-magnet": "" } as const) : {};
  if (href.startsWith("mailto:") || href.startsWith("http") || isCv) {
    return (
      <a className={className} href={href} {...magnetProps} {...(isCv ? { download: cvDownloadName } : {})} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={className} href={href} {...magnetProps}>
      {inner}
    </Link>
  );
}
