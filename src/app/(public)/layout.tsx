import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CommandHotkey } from "@/components/site/CommandHotkey";
import { HashRedirect } from "@/components/site/HashRedirect";
import { BackgroundFx } from "@/components/site/BackgroundFx";
import { ClientRuntime } from "@/components/site/ClientRuntime";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col text-[var(--fg)]">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <BackgroundFx />
      <ClientRuntime />
      <SiteHeader />
      <CommandHotkey />
      <HashRedirect />
      <main id="main" tabIndex={-1} className="grow focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
