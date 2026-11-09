import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CommandHotkey } from "@/components/site/CommandHotkey";
import { HashRedirect } from "@/components/site/HashRedirect";
import { BackgroundFx } from "@/components/site/BackgroundFx";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen text-[var(--fg)]">
      <BackgroundFx />
      <SiteHeader />
      <CommandHotkey />
      <HashRedirect />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
