"use client";

import React from "react";
import { outfit900 } from "@/app/outfitFont";
import Image from "next/image";
import memojiImage from "@/assets/images/memoji-computer.png";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import grainImage from "@/assets/images/grain.jpg";
import StarIcon from "@/assets/icons/star.svg";
import { HeroOrbit } from "@/components/HeroOrbit";
import SparkleIcon from "@/assets/icons/sparkle.svg";

export const Hero = () => {

  const handlePrimaryCtaNavigate = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };
  const handleSecondaryCtaNavigate = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom, transparent,black_10%,black_70%,transparent)]">
        <div
          className="absolute inset-0 -z-30 opacity-5"
          style={{
            backgroundImage: `url(${grainImage.src})`,
          }}
        ></div>
        <div className="size-[420px] hero-ring"></div>
        <div className="size-[620px] hero-ring"></div>
        <div className="size-[820px] hero-ring"></div>
        <div className="size-[1020px] hero-ring"></div>
        <div className="size-[1220px] hero-ring"></div>

        <HeroOrbit
          size={430}
          rotation={-14}
          shouldOrbit
          orbitDuration="35s"
          shouldSpin
          spinDuration="5s"
        >
          <SparkleIcon className="size-8 text-emerald-300/20 " />
        </HeroOrbit>

        <HeroOrbit
          size={440}
          rotation={79}
          shouldOrbit
          orbitDuration="55s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcon className="size-5 text-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={520} rotation={41} shouldOrbit orbitDuration="20s">
          <div className="size-2 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit
          size={530}
          rotation={178}
          shouldOrbit
          orbitDuration="50s"
          shouldSpin
          spinDuration="3s"
        >
          <SparkleIcon className="size-10 text-emerald-300/20 " />
        </HeroOrbit>

        <HeroOrbit
          size={550}
          rotation={20}
          shouldOrbit
          orbitDuration="45s"
          shouldSpin
          spinDuration="3s"
        >
          <StarIcon className="size-12 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit
          size={590}
          rotation={98}
          shouldOrbit
          orbitDuration="30s"
          shouldSpin
          spinDuration="3s"
        >
          <StarIcon className="size-8 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit
          size={350}
          rotation={98}
          shouldOrbit
          orbitDuration="20s"
          shouldSpin
          spinDuration="3s"
        >
          <StarIcon className="size-8 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit size={200} rotation={-45} shouldOrbit orbitDuration="30s">
          <div className="size-2 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={300} rotation={-5} shouldOrbit orbitDuration="20s">
          <div className="size-2 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={650} rotation={-5} shouldOrbit orbitDuration="30s">
          <div className="size-2 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit size={720} rotation={85} shouldOrbit orbitDuration="20s">
          <div className="size-3 rounded-full bg-emerald-300/20 " />
        </HeroOrbit>
        <HeroOrbit
          size={900}
          rotation={-190}
          shouldOrbit
          orbitDuration="10s"
          shouldSpin
          spinDuration="6s"
        >
          <StarIcon className="size-28 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit
          size={450}
          rotation={-20}
          shouldOrbit
          orbitDuration="30s"
          shouldSpin
          spinDuration="9s"
        >
          <StarIcon className="size-28 text-emerald-300 " />
        </HeroOrbit>
        <HeroOrbit
          size={710}
          rotation={-2}
          shouldOrbit
          orbitDuration="20s"
          shouldSpin
          spinDuration="3s"
        >
          <StarIcon className="size-28 text-emerald-300 " />
        </HeroOrbit>
      </div>

      <div className="container">
        <div className="flex flex-col items-center">
          <Image
            src={memojiImage}
            className="size-[100px]"
            alt="A guy sitting behind the PC"
          />
          <div className="bg-gray-950 border border-gray-800 px-4 py-1.5 inline-flex gap-4 rounded-lg items-center">
            <div className="bg-green-500 size-2.5 rounded-full relative">
              <div className="bg-green-500 size-2.5 rounded-full animate-ping-large"></div>
            </div>
            <div className="text-sm font-medium relative ">
              I am always available to work on projects
            </div>
          </div>
        </div>
        <div className="mx-auto relative z-20">
          <h1
            className="text-4xl md:text-6xl text-center mt-8 tracking-wide font-black"
            style={{
              fontFamily: outfit900.fontFamily,
              fontWeight: outfit900.fontWeight,
              WebkitTextStroke: '2.5px #4adecb',
              color: 'transparent',
              background: 'none',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            RICHARD WINNER DUVOR
          </h1>
          <h2 className="text-2xl md:text-4xl text-center mt-8 tracking-wide font-bold max-w-lg mx-auto">
            {" "}
            Fullstack Web Developer, Smart Contract Engineer & AI/MLOps Enthusiast
          </h2>
          <p className="mt-4 text-center text-white/60 md:text-lg">
            Hi, I&apos;m an expert software developer with vast experience in
            blockchain development 🔗, artificial intelligence 🤖, and fullstack
            engineering 🎨. I build secure smart contracts 🔒, brilliant AI
            agents 🧠, and code magic 🪄 into user interfaces 💻. When I&apos;m
            not coding, I&apos;m debugging life with a cup of coffee ☕. Ready
            to create the future? Let&apos;s do this! 🚀👨‍💻
          </p>
        </div>
        <div className="flex relative z-20 flex-col md:flex-row justify-center items-center mt-8 gap-4">
          <button onClick={handlePrimaryCtaNavigate}
            className="inline-flex items-center gap-2 border border-whte/15 px-6 h-12 rounded-xl"            
          >
            <span className="font-semibold">Explore Projects</span>
            <ArrowDown className="size-5" />
          </button>
          <button onClick={handleSecondaryCtaNavigate} className=" relative inline-flex  z-20 items-center gap-2 border border-white bg-white text-gray-900 h-12 px-6 rounded-xl">
            <span className="">🚀</span>
            <span className="font-semibold">Let&apos;s connect! </span>
          </button>
        </div>
      </div>
    </div>
  );
};
