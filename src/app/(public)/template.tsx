import type { ReactNode } from "react";

/* Remounts on navigation, so a fresh page always arrives with this entrance. */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
