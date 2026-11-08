"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function HashRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") return;
    const hash = window.location.hash;
    if (hash === "#projects") router.replace("/work");
    if (hash === "#experience") router.replace("/about#experience");
    if (hash === "#contact") router.replace("/contact");
  }, [pathname, router]);

  return null;
}
