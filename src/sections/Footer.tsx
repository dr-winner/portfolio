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
    link: "https://x.com/dr_winner6",
    iconType: XIcon,
  },
  {
    title: "Instagram",
    link: "https://www.instagram.com/winner.richard",
    iconType: InstagramIcon,
  },
  {
    title: "Medium",
    link: "https://medium.com/@duvorr60",
    iconType: MediumIcon,
  },
  {
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/richard-winner-duvor/",
    iconType: LinkedInIcon,
  },
  {
    title: "Discord",
    link: "https://discordapp.com/users/dr_winner",
    iconType: DiscordIcon,
  },
  {
    title: "GitHub",
    link: "https://github.com/dr-winner/",
    iconType: GitHubIcon,
  },
];

export const Footer = () => {
  return (
    <footer className="relative overflow-x-clip">
      <div className="absolute h-[400px] w-[1600px] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10"></div>
      <div className="container">
        <div className="border-t border-white/15 py-6 text-sm flex flex-col md:flex-row md:justify-between items-center md:gap-2 gap-8 justify-center">
          <div className="text-white/40">
            &copy;{new Date().getFullYear()} All rights reserved <span className="font-serif text-sm text-center mt-8 tracking-wide font-sm bg-gradient-to-r from-emerald-300 to-sky-400 text-transparent ml-0.5 bg-clip-text">Richard Winner</span>
          </div>
          <nav id="footer" className="p-4 text-white">
            <LinkSvgItems items={footerLinks} className="" />
          </nav>
        </div>
      </div>
    </footer>
  );
};
