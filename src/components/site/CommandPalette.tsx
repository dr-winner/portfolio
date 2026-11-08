"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { publishedWork } from "@/content/work";
import { cvHref, mailto, site } from "@/content/site";

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function go(href: string) {
    onClose();
    if (href.startsWith("http") || href.startsWith("mailto:")) {
      window.location.href = href;
      return;
    }
    router.push(href);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setNotice("Email copied");
    } catch {
      setNotice("Could not copy the email");
    }
    onClose();
  }

  function toggleTheme() {
    const next = resolvedTheme === "light" ? "dark" : "light";
    setTheme(next);
    document.cookie = `theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    onClose();
  }

  const egg = query.trim().toLowerCase();

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      label="Command menu"
      overlayClassName="cmdk-overlay"
      contentClassName="cmdk-dialog"
      filter={(value, search) => {
        const needle = search.trim().toLowerCase();
        if (needle === "whoami") return value === "whoami" ? 1 : 0;
        if (needle === "sudo") return value === "sudo" ? 1 : 0;
        if (value === "whoami" || value === "sudo") return 0;
        return value.toLowerCase().includes(needle) ? 1 : 0;
      }}
    >
      <Command.Input value={query} onValueChange={setQuery} placeholder="Jump to a page or case study" />
      <Command.List>
        <Command.Empty>No matches.</Command.Empty>
        {egg === "whoami" ? (
          <Command.Item value="whoami" onSelect={onClose}>
            Richard Winner Duvor. Application security. Accra, Ghana.
          </Command.Item>
        ) : null}
        {egg === "sudo" ? (
          <Command.Item value="sudo" onSelect={onClose}>
            Nice try. This incident has been logged to /dev/null.
          </Command.Item>
        ) : null}
        <Command.Group heading="Go to">
          {[
            ["/", "Home"],
            ["/work", "Work"],
            ["/about", "About"],
            ["/contact", "Contact"],
            ["/security", "Security"],
          ].map(([href, label]) => (
            <Command.Item key={href} value={`go ${label}`} onSelect={() => go(href)}>
              {label}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Case studies">
          {publishedWork.map((item) => (
            <Command.Item key={item.slug} value={`${item.title} ${item.badges.join(" ")}`} onSelect={() => go(`/work/${item.slug}`)}>
              {item.title}
            </Command.Item>
          ))}
        </Command.Group>
        <Command.Group heading="Actions">
          <Command.Item value="download cv" onSelect={() => go(cvHref)}>
            Download CV
          </Command.Item>
          <Command.Item value="copy email" onSelect={copyEmail}>
            Copy email
          </Command.Item>
          <Command.Item value="email richard" onSelect={() => go(mailto)}>
            Email Richard
          </Command.Item>
          <Command.Item value="toggle theme" onSelect={toggleTheme}>
            Toggle theme
          </Command.Item>
          <Command.Item value="open security.txt" onSelect={() => go("/.well-known/security.txt")}>
            Open security.txt
          </Command.Item>
        </Command.Group>
        <Command.Group heading="Links">
          <Command.Item value="github" onSelect={() => go(site.links.github)}>
            GitHub
          </Command.Item>
          <Command.Item value="linkedin" onSelect={() => go(site.links.linkedin)}>
            LinkedIn
          </Command.Item>
          <Command.Item value="x" onSelect={() => go(site.links.x)}>
            X
          </Command.Item>
        </Command.Group>
      </Command.List>
      <div className="cmdk-foot">
        <span>↑↓ to move · ↵ to open · esc to close</span>
        <span className="sr-only" aria-live="polite">
          {notice}
        </span>
      </div>
    </Command.Dialog>
  );
}
