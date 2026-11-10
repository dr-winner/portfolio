/* Classic frame, brief 7.1: a simple, fast document layout. Static header
   with real links, the page content once, and the site footer. Works
   without JavaScript. */

import { SkipLink } from "./SkipLink";
import { ClassicHeader } from "./ClassicHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export function ClassicFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-[var(--fg)]">
      <SkipLink variant="to-content" href="#content" />
      <ClassicHeader />
      <main id="content" tabIndex={-1} className="grow">
        {children}
      </main>
      <SiteFooter param="view=classic" />
    </div>
  );
}
