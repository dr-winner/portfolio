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
  return (
    <div className="py-20">
      <div className="container">
        <SectionHeader
          eyebrow="About Me"
          title="A Glimpse Into My World"
          description="Learn more about who I am, what I do, and inspires me."
        />
        <div className="mt-20 flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <Card className="h-[320px] md:col-span-2">
            <CardHeader
              title="My Reads"
              description="Explore the books shaping my perspective on leadership"
            />

            <div className="w-40 mx-auto mt-2 md:mt-0">
              <Image
                src={bookImage}
                alt="A good general book by Dag Heward Mills"
              />
            </div>
          </Card>
          <Card className="h-[320px] md:col-span-3">
            <CardHeader
              title="Technology & Tools"
              description="Explore the technologies and tools I use to innovate exceptional
                digital experiences"
              className=""
            />

            <ToolboxItems items={toolboxItems} className="" />
            <ToolboxItems
              items={toolboxItems}
              className="mt-6"
              itemsWrapperClassName="-translate-x-1/2"
            />
          </Card>
          </div>
          <div className="grid">
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
          <Card className="h-[320px] p-0 relative">
            <Image
              src={mapImage}
              alt="map"
              className="h-full w-full object-cover"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-full after:outline-white-950/30">
              <Image src={smileMemoji} alt="smiling face" className="size-12" />
            </div>
          </Card>
</div>
        </div>
      </div>
    </div>
  );
};
