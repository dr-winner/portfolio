import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import StarIcon from "@/assets/icons/star.svg";
import JavaScriptIcon from "@/assets/icons/square-js.svg";
import PythonIcon from "@/assets/icons/python-svgrepo-com.svg";
import HardHatIcon from "@/assets/icons/Hardhat.svg";
import SolidityIcon from "@/assets/icons/Solidity.svg";
import TypeScriptIcon from "@/assets/icons/Typescript-Icon--Streamline-Svg-Logos.svg";
import GitHubIcon from "@/assets/icons/github.svg";
import NextjsIcon from "@/assets/icons/nextjs-svgrepo-com.svg";
import bookImage from "@/assets/images/A-Good-General-Dag-Heward-Mills.jpg";
import React from "react";
import Image from "next/image";
import { TechIcon } from "@/components/TechIcon";
import mapImage from "@/assets/images/accra-map.jpg";
import smileMemoji from "@/assets/images/memoji-smile.png";
import { CardHeader } from "@/components/CardHeader";
import { ToolboxItems } from "@/components/ToolboxItems";

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
];

const hobbies = [
  {
    title: "Cycling",
    emoji: "🚴",
  },
  {
    title: "Hackathons",
    emoji: "🏆",
  },
  {
    title: "Gaming",
    emoji: "🎮",
  },
  {
    title: "Technical Analysis",
    emoji: "📈",
  },
  {
    title: "Traveling",
    emoji: "✈️",
  },
  {
    title: "Reading Blogs",
    emoji: "📖",
  },
  {
    title: "Camping",
    emoji: "🏕️",
  },
  {
    title: "Fitness & Gym",
    emoji: "🏋️",
  },
  {
    title: "Photography",
    emoji: "📸",
  },
  {
    title: "Chess",
    emoji: "♟️",
  },
  {
    title: "Meditation",
    emoji: "🧘",
  },
  {
    title: "Cooking",
    emoji: "🍳",
  },
  {
    title: "NFT minting",
    emoji: "🖼️",
  },
  {
    title: "Music",
    emoji: "🎵",
  },
  {
    title: "Exploration",
    emoji: "🌐",
  },
];

export const About = () => {
  return (
    <div className="py-20">
      <div className="container">
        <SectionHeader
          eyebrow="About Me"
          title="A Glimpse Into My World"
          description="Learn more about who I am, what I do, and inspires me."
        />
        <div className="mt-20 flex flex-col gap-8">
          <Card className="h-[320px]">
            <CardHeader
              title="My Reads"
              description="Explore the books shaping my perspective on leadership"
            />

            <div className="w-40 mx-auto mt-8">
              <Image
                src={bookImage}
                alt="A good general book by Dag Heward Mills"
              />
            </div>
          </Card>
          <Card className="h-[320px] p-0">
            <CardHeader
              title="Technologies And Tools"
              description="Explore the technologies and tools I use to innovate exceptional
                digital experiences"
              className="px-6 pt-6"
            />

            <ToolboxItems items={toolboxItems} className="mt-6" />
            <ToolboxItems
              items={toolboxItems}
              className="mt-6 "
              itemsWrapperClassName="-translate-x-1/2"
            />
          </Card>
          <Card>
            <CardHeader
              title="Beyond Coding"
              description="Explore my hobbies and interests beyond the digital realm"
            />

            <div>
              {hobbies.map((hobby) => (
                <div key={hobby.title} className="inline-flex gap-2 px-6 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full">
                  <span>{hobby.title}</span>
                  <span>{hobby.emoji}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Image src={mapImage} alt="map" />
            <Image src={smileMemoji} alt="smiling face" />
          </Card>
        </div>
      </div>
    </div>
  );
};
