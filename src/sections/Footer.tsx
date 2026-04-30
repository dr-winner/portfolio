"use client";

import { useEffect, useState } from "react";
import {
  DiscordIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  MediumIcon,
  TikTokIcon,
  XIcon,
} from "@/components/BrandIcons";
import { profile } from "@/content/profile";

const socials = [
  { label: "GitHub", href: profile.socials.github, icon: GithubIcon },
  { label: "LinkedIn", href: profile.socials.linkedin, icon: LinkedInIcon },
  { label: "X", href: profile.socials.x, icon: XIcon },
  { label: "Medium", href: profile.socials.medium, icon: MediumIcon },
  { label: "Instagram", href: profile.socials.instagram, icon: InstagramIcon },
  {
    label: "Discord",
    href: profile.socials.discord,
    icon: DiscordIcon,
    title: `@${profile.socials.discordHandle}`,
  },
  { label: "TikTok", href: profile.socials.tiktok, icon: TikTokIcon },
];

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="font-sans relative mt-6 overflow-hidden border-t border-slate-200/80 py-10 dark:border-white/[0.06]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 left-1/2 h-[120px] w-[900px] -translate-x-1/2 bg-gradient-to-b from-slate-300/[0.12] via-transparent to-transparent blur-2xl dark:from-white/[0.03]"
      />
      <div className="container flex flex-col">
        <div className="flex flex-col items-stretch justify-between gap-6 border-t border-slate-200/80 pt-6 dark:border-white/5 md:flex-row md:items-center">
          <p className="text-center text-sm text-slate-600 dark:text-white/60 md:text-left">
            &copy; {year ?? ""}{" "}
            <span className="text-gradient-cyber font-semibold">{profile.name}</span>
            {". "}
            All rights reserved.
          </p>

          <nav
            aria-label="Social"
            className="flex flex-wrap items-center justify-center gap-1.5 md:justify-end"
          >
            {socials.map((entry) => {
              const Icon = entry.icon;
              const title =
                "title" in entry && typeof entry.title === "string"
                  ? `${entry.label} (${entry.title})`
                  : entry.label;
              return (
                <a
                  key={entry.label}
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={entry.label}
                  title={title}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-slate-300/85 bg-white/80 text-slate-500 transition-colors hover:border-slate-400 hover:bg-white hover:text-slate-800 dark:border-white/[0.08] dark:bg-white/[0.02] dark:text-white/50 dark:hover:border-white/15 dark:hover:bg-white/[0.04] dark:hover:text-white/80"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}
