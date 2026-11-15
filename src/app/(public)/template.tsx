import type { ReactNode } from "react";

/* Remounts on navigation, so a fresh page always arrives with this entrance.
   The teal panel slides off to the right in under 500ms, then the new page
   is simply there. The panel is aria-hidden and pointer-events-none. */
export default function PublicTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="page-wipe" aria-hidden />
      <div className="page-enter">{children}</div>
    </>
  );
}
