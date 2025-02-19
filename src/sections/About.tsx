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

const toolItems = [
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
    <div className="pb-96">
      <SectionHeader
        eyebrow="About Me"
        title="A Glimpse Into My World"
        description="Learn more about who I am, what I do, and inspires me."
      />
      <div>
        <Card>
          <div>
            <StarIcon />
            <h3>Explore My Reads</h3>
            <p>These are the books shaping my perspective</p>
          </div>
          <Image
            src={bookImage}
            alt="A good general book by Dag Heward Mills"
          />
        </Card>
        <Card>
          <div>
            <StarIcon />
            <h3>Technologies And Tools</h3>
            <p>
              Explore the technologies and tools I use to innovate exceptional
              digital experiences
            </p>
          </div>
          <div>
            {toolItems.map((item) => (
              <div key={item.title}>
                <span>{item.title}</span>
                <TechIcon component={item.iconType} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div>
            <StarIcon />
            <h3>Beyond Coding</h3>
            <p>Explore my hobbies and interests beyond the digital realm</p>
            <div>
              {hobbies.map((hobby) => (
                <div key={hobby.title}>
                  <span>{hobby.title}</span>
                  <span>{hobby.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <Image src={mapImage} alt="map" />
          <Image src={smileMemoji} alt="smiling face" />
        </Card>
      </div>
    </div>
  );
};
