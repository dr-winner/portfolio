import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CommandHotkey } from "@/components/site/CommandHotkey";
import { HashRedirect } from "@/components/site/HashRedirect";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <SiteHeader />
      <CommandHotkey />
      <HashRedirect />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
