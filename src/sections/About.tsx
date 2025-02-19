import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
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
    left: '5%',
    top: '5%',
  },
  {
    title: "Hackathons",
    emoji: "🏆",
    left: '50%',
    top: '5%',
  },
  {
    title: "Gaming",
    emoji: "🎮",
    left: '10%',
    top: '35%',
  },
  {
    title: "Technical Analysis",
    emoji: "📈",
    left: '35%',
    top: '40%',
  },
  {
    title: "Traveling",
    emoji: "✈️",
    left: '70%',
    top: '45%',
  },
  {
    title: "Reading Blogs",
    emoji: "📖",
    left: '5%',
    top: '655',
  },
  {
    title: "Camping",
    emoji: "🏕️",
    left: '',
    top: '',
  },
  {
    title: "Fitness & Gym",
    emoji: "🏋️",
    left: '',
    top: '',
  },
  {
    title: "Photography",
    emoji: "📸",
    left: '',
    top: '',
  },
  {
    title: "Chess",
    emoji: "♟️",
    left: '',
    top: '',
  },
  {
    title: "Meditation",
    emoji: "🧘",
    left: '',
    top: '',
  },
  {
    title: "Cooking",
    emoji: "🍳",
    left: '',
    top: '',
  },
  {
    title: "NFT minting",
    emoji: "🖼️",
    left: '',
    top: '',
  },
  {
    title: "Music",
    emoji: "🎵",
    left: '',
    top: '',
  },
  {
    title: "Exploration",
    emoji: "🌐",
    left: '',
    top: '',
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
          <Card className="h-[320px] p-0 flex flex-col">
            <CardHeader
              title="Beyond Coding"
              description="Explore my hobbies and interests beyond the digital realm"
              className="px-6 py-6"
            />

            <div className="relative flex-1">
              {hobbies.map((hobby) => (
                <div
                  key={hobby.title}
                  className="inline-flex items-center gap-2 px-6 bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full py-1.5 absolute"
                  style={{
                    left: hobby.left,
                    top: hobby.top,
                  }}
                >
                  <span className="font-medium text-gray-950">
                    {hobby.title}
                  </span>
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
