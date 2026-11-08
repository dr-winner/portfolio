import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CommandHotkey } from "@/components/site/CommandHotkey";
import { HashRedirect } from "@/components/site/HashRedirect";
import { RouteFocus } from "@/components/site/RouteFocus";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />
      <CommandHotkey />
      <HashRedirect />
      <RouteFocus />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
