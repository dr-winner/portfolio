import React from "react";
import Image from "next/image";
import memojiImage from "@/assets/images/memoji-computer.png";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import grainImage from "@/assets/images/grain.jpg";
import StarIcon from "@/assets/icons/star.svg";
import { HeroOrbit } from "@/components/HeroOrbit";
import SparkleIcon from "@/assets/icons/sparkle.svg";

export const Hero = () => {
  return (
    <div className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom, transparent,black_10%,black_70%,transparent)]">
        <div
          className="absolute inset-0 -z-30 opacity-5"
          style={{
            backgroundImage: `url(${grainImage.src})`,
          }}
        ></div>
        {/* <div className="size-[420px] hero-ring"></div> */}
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div>
        {/* <div className="size-[1420px] hero-ring"></div>
      <div className="size-[1620px] hero-ring"></div> */}
        <HeroOrbit size={800} rotation={-72}>
          <StarIcon className="size-28 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit size={550} rotation={20}>
          <StarIcon className="size-12 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit size={590} rotation={98}>
          <StarIcon className="size-8 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit size={430} rotation={-14}>
          <SparkleIcon className="size-8 text-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={440} rotation={79}>
          <SparkleIcon className="size-5 text-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={530} rotation={178}>
          <SparkleIcon className="size-10 text-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={720} rotation={85}>
          <div className="size-3 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>{" "}
        <HeroOrbit size={520} rotation={41}>
          <div className="size-2 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={650} rotation={-5}>
          <div className="size-2 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
      </div>

      <div className="container">
        <div className="flex flex-col items-center">
          <Image
            src={memojiImage}
            className="size-[100px]"
            alt="A guy sitting behind the pc"
          />
          <div className="bg-gray-950 border border-gray-800 px-4 py-1.5 inline-flex gap-4 rounded-lg items-center">
            <div className="bg-green-500 size-2.5 rounded-full"></div>
            <div className="text-sm font-medium">
              I am always available to work on projects
            </div>
          </div>
        </div>
        <div className="mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl text-center mt-8 tracking-wide font-bold">
            AI Agent, Smart Contract and Front-end Engineer
          </h1>
          <p className="mt-4 text-center text-white/60 md:text-lg">
            Hi, I&apos;m an expert software developer with vast experience in
            blockchain development 🔗, artificial intelligence 🤖, and frontend
            engineering 🎨. I build secure smart contracts 🔒, brilliant AI
            agents 🧠, and code magic 🪄 into user interfaces 💻. When I&apos;m
            not coding, I&apos;m debugging life with a cup of coffee ☕. Ready
            to create the future? Let&apos;s do this! 🚀✨🔥🌟📈🤓👨‍💻
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mt-8 gap-4">
          <button className="inline-flex items-center gap-2 border border-whte/15 px-6 h-12 rounded-xl">
            <span className="font-semibold">Explore Projects</span>
            <ArrowDown className="size-5" />
          </button>
          <button className="inline-flex items-center gap-2 border border-white bg-white text-gray-900 h-12 px-6 rounded-xl">
            <span className="">🚀</span>
            <span className="font-semibold">Let&apos;s connect! </span>
          </button>
        </div>
      </div>
    </div>
  );
};
