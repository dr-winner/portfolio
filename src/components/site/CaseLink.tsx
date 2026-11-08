"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type StartView = (callback: () => void) => void;

export function CaseLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = (document as Document & { startViewTransition?: StartView }).startViewTransition;
    if (!start) return;
    event.preventDefault();
    start(() => {
      router.push(href);
    });
  }

  function onMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--sx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--sy", `${event.clientY - rect.top}px`);
  }

  return (
    <Link href={href} className={className} onClick={onClick} onMouseMove={onMove}>
      {children}
    </Link>
  );
}
