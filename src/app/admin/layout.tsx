import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  FolderGit2,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { getCurrentSession } from "@/lib/auth";
import { LogoutButton } from "./_components/LogoutButton";
import "../globals.css";

export const metadata = {
  title: "Admin · Richard Winner Duvor",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Usage", icon: BarChart3 },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/stack", label: "Stack", icon: Wrench },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/certifications", label: "Certifications", icon: ShieldCheck },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  return (
    <div className="min-h-screen bg-ink font-sans text-white antialiased">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.06] bg-white/[0.01] p-5 md:block">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-ok-400 shadow-glow-sm" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
              admin console
            </span>
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.04] hover:text-white"
                >
                  <Icon className="size-4 text-white/50 group-hover:text-cyber-300" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-10 rounded-lg border border-white/10 p-4 text-xs text-white/60">
            <p className="font-mono uppercase tracking-[0.2em] text-white/40">Signed in as</p>
            <p className="mt-1 font-semibold text-white">{session?.sub ?? "admin"}</p>
            <LogoutButton className="mt-3 inline-flex items-center gap-2 text-white/60 hover:text-white">
              <LogOut className="size-3.5" /> Log out
            </LogoutButton>
          </div>
          <Link
            href="/"
            className="mt-5 block text-center text-xs text-white/50 hover:text-white"
          >
            ← Back to site
          </Link>
        </aside>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
