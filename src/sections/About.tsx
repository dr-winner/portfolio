"use client";

import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import JavaScriptIcon from "@/assets/icons/square-js.svg";
import ChrometIcon from "@/assets/icons/chrome.svg";
import Web3jstIcon from "@/assets/icons/Web3js--Streamline-Svg-Logos.svg";
import ReactjsIcon from "@/assets/icons/react.svg";
import Css3Icon from "@/assets/icons/css3.svg";
import Html5Icon from "@/assets/icons/html5.svg";
import DiscordIcon from "@/assets/icons/icons8-discord.svg";
import HardHatIcon from "@/assets/icons/Hardhat.svg";
import SolidityIcon from "@/assets/icons/Solidity.svg";
import PythonIcon from "@/assets/icons/python-svgrepo-com.svg";
import EthersjsIcon from "@/assets/icons/ethers.svg";
import TypeScriptIcon from "@/assets/icons/Typescript-Icon--Streamline-Svg-Logos.svg";
import GitHubIcon from "@/assets/icons/github.svg";
import VscodeIcon from "@/assets/icons/visual-studio-code-svgrepo-com.svg";
import NextjsIcon from "@/assets/icons/nextjs-svgrepo-com.svg";
import bookImage from "@/assets/images/A-Good-General-Dag-Heward-Mills.jpg";
import React from "react";
import Image from "next/image";
import mapImage from "@/assets/images/accra-map.jpg";
import smileMemoji from "@/assets/images/memoji-smile.png";
import { CardHeader } from "@/components/CardHeader";
import { ToolboxItems } from "@/components/ToolboxItems";
import { motion } from "framer-motion";
import { useRef } from "react";

const toolboxItems = [
  {
    title: "JavaScript",
    iconType: JavaScriptIcon,
  },
  {
    title: "Python",
    iconType: PythonIcon,
  },
  {
    title: "HardHat",
    iconType: HardHatIcon,
  },
  {
    title: "Solidity",
    iconType: SolidityIcon,
  },
  {
    title: "TypeScript",
    iconType: TypeScriptIcon,
  },
  {
    title: "GitHub",
    iconType: GitHubIcon,
  },
  {
    title: "Nextjs",
    iconType: NextjsIcon,
  },
  {
    title: "Chrome",
    iconType: ChrometIcon,
  },
  {
    title: "Web3js",
    iconType: Web3jstIcon,
  },
  {
    title: "Reactjs",
    iconType: ReactjsIcon,
  },
  {
    title: "CSS3",
    iconType: Css3Icon,
  },
  {
    title: "HTML5",
    iconType: Html5Icon,
  },
  {
    title: "Discord",
    iconType: DiscordIcon,
  },
  {
    title: "Ethersjs",
    iconType: EthersjsIcon,
  }, {
    title: "VS Code",
    iconType: VscodeIcon,
  },
];

const hobbies = [
  {
    title: "Cycling",
    emoji: "🚴",
    left: "2%",
    top: "2%",
  },
  {
    title: "Hackathons",
    emoji: "🏆",
    left: "40%",
    top: "5%",
  },
  {
    title: "Gaming",
    emoji: "🎮",
    left: "10%",
    top: "25%",
  },
  {
    title: "Reading Blogs",
    emoji: "📖",
    left: "15%",
    top: "65%",
  },
  {
    title: "Camping",
    emoji: "🏕️",
    left: "40%",
    top: "48%",
  },
  {
    title: "Fitness",
    emoji: "🏋️",
    left: "2%",
    top: "45%",
  },
  {
    title: "Photography",
    emoji: "📸",
    left: "50%",
    top: "27%",
  },
  {
    title: "Cooking",
    emoji: "🍳",
    left: "45%",
    top: "75%",
  },
  {
    title: "Music",
    emoji: "🎵",
    left: "5%",
    top: "75%",
  },
];

export const About = () => {
  const constraintRef = useRef(null);

  return (
    <div id="about" className="py-20 lg:py-28">
      <div className="container">
        <SectionHeader
          eyebrow="About Me"
          title="A Glimpse Into My World"
          description="Learn more about who I am, what I do, and what inspires me."
        />
        <div className="mt-20 flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:grid-cols-3">
            <Card className="h-[320px] md:col-span-2 lg:col-span-1">
              <CardHeader
                title="My Reads"
                description="Explore the books shaping my perspective"
              />

              <div className="w-40 mx-auto mt-2 md:mt-0">
                <Image
                  src={bookImage}
                  alt="A good general book by Dag Heward Mills"
                />
              </div>
            </Card>
            <Card className="h-[320px] md:col-span-3 lg:col-span-2">
              <CardHeader
                title="Technology & Tools"
                description="Explore the technologies and tools I use to innovate exceptional
                digital experiences"
                className=""
              />

              <ToolboxItems
                items={toolboxItems}
                className=" "
                itemsWrapperClassName="animate-move-left [animation-duration:30s]"
              />
              <ToolboxItems
                items={toolboxItems}
                className="mt-6"
                itemsWrapperClassName="animate-move-right  [animation-duration:15s]"
              />
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8">
            <Card className="h-[320px] p-0 flex flex-col md:col-span-3 lg:col-span-2">
              <CardHeader
                title="Beyond Coding"
                description="Explore my hobbies and interests beyond the digital realm"
                className="px-6 py-6"
              />

              <div className="relative flex-1 " ref={constraintRef}>
                {hobbies.map((hobby) => (
                  <motion.div
                    key={hobby.title}
                    className="inline-flex items-center gap-2 px-6 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full py-1.5 absolute"
                    style={{
                      left: hobby.left,
                      top: hobby.top,
                    }}
                    drag
                    dragConstraints={constraintRef}
                  >
                    <span className="font-medium text-gray-950">
                      {hobby.title}
                    </span>
                    <span>{hobby.emoji}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
            <Card className="h-[320px] p-0 relative md:col-span-2 lg:col-span-1">
              <Image
                src={mapImage}
                alt="map"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full  after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-full after:outline-white-950/3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-20 animate-ping-large [animation-duration:1.2s] "></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-10"></div>
                <Image
                  src={smileMemoji}
                  alt="smiling face"
                  className="size-12"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
