import Link from "next/link";
import type { ReactNode } from "react";

const styles = {
  primary:
    "bg-[var(--signal)] text-[var(--on-signal)] border border-transparent hover:brightness-110",
  secondary:
    "bg-transparent text-[var(--fg)] border border-[var(--line-strong)] hover:border-[var(--signal)]",
  ghost: "bg-transparent text-[var(--fg)] border border-transparent hover:text-[var(--signal)]",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
  download?: boolean;
}) {
  const className = `inline-flex h-11 items-center justify-center rounded-[6px] px-5 text-[length:var(--step-0)] font-medium no-underline transition-[transform,filter,border-color] duration-200 ${styles[variant]}`;
  if (href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a className={className} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
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
