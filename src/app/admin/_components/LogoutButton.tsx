"use client";

import clsx from "clsx";
import { type ReactNode } from "react";
import { logoutAction } from "../actions";

export function LogoutButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <form action={logoutAction}>
      <button type="submit" className={clsx(className)}>
        {children}
      </button>
    </form>
  );
}
