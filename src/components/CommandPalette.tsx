"use client";

import { Command } from "cmdk";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  FolderGit2,
  Mail,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { GithubIcon, LinkedInIcon, XIcon } from "@/components/BrandIcons";
import { profile } from "@/content/profile";

type Action =
  | { kind: "scroll"; id: string }
  | { kind: "link"; href: string }
  | { kind: "email"; to: string };

type CommandItem = {
  id: string;
  label: string;
  keywords?: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  action: Action;
};

const items: CommandItem[] = [
  { id: "hero", label: "Go to Home", group: "Navigate", icon: Sparkles, action: { kind: "scroll", id: "top" } },
  { id: "capabilities", label: "Capabilities", group: "Navigate", icon: Shield, action: { kind: "scroll", id: "capabilities" } },
  { id: "stack", label: "Stack", group: "Navigate", icon: Sparkles, action: { kind: "scroll", id: "stack" } },
  { id: "projects", label: "Projects", group: "Navigate", icon: FolderGit2, action: { kind: "scroll", id: "projects" } },
  { id: "experience", label: "Experience", group: "Navigate", icon: Briefcase, action: { kind: "scroll", id: "experience" } },
  { id: "certs", label: "Certifications", group: "Navigate", icon: Shield, action: { kind: "scroll", id: "certifications" } },
  { id: "about", label: "About", group: "Navigate", icon: User, action: { kind: "scroll", id: "about" } },
  {
    id: "github-activity",
    label: "GitHub",
    group: "Navigate",
    icon: GithubIcon,
    action: { kind: "scroll", id: "github-activity" },
  },
  { id: "contact", label: "Contact", group: "Navigate", icon: Mail, action: { kind: "scroll", id: "contact" } },

  { id: "email", label: "Email me", group: "Contact", icon: Mail, action: { kind: "email", to: profile.email } },
  { id: "github", label: "GitHub", group: "Contact", icon: GithubIcon, action: { kind: "link", href: profile.socials.github } },
  { id: "linkedin", label: "LinkedIn", group: "Contact", icon: LinkedInIcon, action: { kind: "link", href: profile.socials.linkedin } },
  { id: "x", label: "Twitter / X", group: "Contact", icon: XIcon, action: { kind: "link", href: profile.socials.x } },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  function run(item: CommandItem) {
    onOpenChange(false);
    const a = item.action;
    if (a.kind === "scroll") {
      if (a.id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.getElementById(a.id)?.scrollIntoView({ behavior: "smooth" });
    } else if (a.kind === "link") {
      window.open(a.href, "_blank", "noopener,noreferrer");
    } else if (a.kind === "email") {
      window.location.href = `mailto:${a.to}?subject=Hello%20Richard`;
    }
  }

  if (!open) return null;

  const grouped = items.reduce<Record<string, CommandItem[]>>((acc, it) => {
    (acc[it.group] = acc[it.group] || []).push(it);
    return acc;
  }, {});

  return (
    <div
      className="font-sans fixed inset-0 z-[100] flex items-start justify-center p-3 pt-[max(3rem,env(safe-area-inset-top,0px))] sm:p-4 sm:pt-[15vh]"
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" aria-hidden />
      <div
        className="relative w-full min-w-0 max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-ink-100/95 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command menu" className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Sparkles className="size-4 text-cyber-300" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Jump to a section or a link…"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              autoFocus
            />
            <span className="kbd">ESC</span>
          </div>
          <Command.List className="max-h-[min(60vh,520px)] overflow-y-auto p-2 sm:max-h-[60vh]">
            <Command.Empty className="py-6 text-center text-sm text-white/50">
              No matches.
            </Command.Empty>
            {Object.entries(grouped).map(([group, list]) => (
              <Command.Group
                key={group}
                heading={group}
                className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-white/40"
              >
                {list.map((it) => {
                  const Icon = it.icon;
                  return (
                    <Command.Item
                      key={it.id}
                      value={`${it.group} ${it.label}`}
                      onSelect={() => run(it)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 data-[selected=true]:bg-cyber-300/10 data-[selected=true]:text-white"
                    >
                      <Icon className="size-4 text-cyber-300" />
                      <span className="flex-1">{it.label}</span>
                      {it.action.kind === "link" && <ArrowUpRight className="size-3.5 text-white/40" />}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px] text-white/40">
            <span className="font-mono">[menu]</span>
            <div className="flex items-center gap-2">
              <span className="kbd">↑</span>
              <span className="kbd">↓</span>
              <span>navigate</span>
              <span className="kbd">↵</span>
              <span>select</span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
