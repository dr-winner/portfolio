import React from "react";
import XIcon from "@/assets/icons/icons8-x.svg";
import InstagramIcon from "@/assets/icons/icons8-instagram.svg";
import DiscordIcon from "@/assets/icons/icons8-discord.svg";
import LinkedInIcon from "@/assets/icons/icons8-linkedin.svg";
import GitHubIcon from "@/assets/icons/github.svg";
import MediumIcon from "@/assets/icons/icons8-telegram.svg";
import { LinkSvgItems } from "@/components/LinkSvgItems";

const footerLinks = [
  {
    title: "Twitter/X",
    href: "",
    iconType: XIcon,
  },
  {
    title: "Instagram",
    href: "",
    iconType: InstagramIcon,
  },
  {
    title: "Medium",
    href: "",
    iconType: MediumIcon,
  },
  {
    title: "LinkedIn",
    href: "",
    iconType: LinkedInIcon,
  },
  {
    title: "Discord",
    href: "",
    iconType: DiscordIcon,
  },
  {
    title: "GitHub",
    href: "https://github.com/dr-winner/",
    iconType: GitHubIcon,
  },
];

export const Footer = () => {
  return (
    <footer className="relative -z-10 overflow-x-clip">
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10"></div>
      <div className="container">
        <div className="border-t border-white/15 py-6 text-sm flex flex-col md:flex-row md:justify-between items-center md:gap-2 gap-8">
          <div className="text-white/40">
            &copy;{new Date().getFullYear()} All rights reserved <span className="font-serif text-sm text-center mt-8 tracking-wide font-sm bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent bg-clip-text">drWinner</span>
          </div>
          <nav id="footer" className="p- text-white">
            <LinkSvgItems items={footerLinks} className="mt-4" />
          </nav>
        </div>
      </div>
    </footer>
  );
};
