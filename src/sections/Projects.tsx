"use client";

import repChainLandingPage from "@/assets/images/repchain-landing-page.png";
import peeRampLandingPage from "@/assets/images/peeRamp.png";
import AIXMarketAnalyzer from "@/assets/images/AIXMarketAnalyzer.png";
import motiFiAi from "@/assets/images/motiFiAi.png";
import landRegOnIcp from "@/assets/images/landOnIcp.png";
import Image from "next/image";
import CheckIcon from "@/assets/icons/check-circle.svg";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";

const portfolioProjects = [
  {
    company: "RepChain",
    year: "2025",
    title: "Front-End Developer",
    results: [
      { title: "Create a Transparent and Immutable Reputation System" },
      { title: "Enhance Trust in Digital Transactions" },
      { title: "Empower Users with Portable Reputation" },
      { title: "Ensure Privacy and Security" },
    ],
    link: "https://github.com/dr-winner/repChain",
    image: repChainLandingPage,
  },
  {
    company: "PeerRamp",
    year: "2025",
    title: "Smart Contract Engineer",
    results: [
      { title: "Facilitate Seamless Peer-to-Peer Lending" },
      { title: "Ensure Trust and Security in Transactions" },
      { title: "Encourage Responsible Borrowing and Lending" },
      { title: "Scale to Multiple Universities and Beyond" },
    ],
    link: "https://peer-ramp.vercel.app/",
    image: peeRampLandingPage,
  },
  {
    company: "AIX-Market-Analyzer",
    year: "2024",
    title: "Technical Writer",
    results: [
      { title: "Provide data-driven insights for better decision-making in AI token investments." },
      { title: "Analyze AI Tokens for Robustness, Accuracy and Decisiveness" },
      { title: "Leverage advanced algorithms for token comparison" },
    ],
    link: "https://aix-market-analyzer.vercel.app/",
    image: AIXMarketAnalyzer,
  },{
    company: "motiFiAi",
    year: "2025",
    title: "Back-End Development",
    results: [
      { title: "Keeping track of multiple investments across protocols" },
      { title: "Analyzes top coins and provides market insights using advanced AI" },
      { title: "Understanding  market sentiment and trends to help react quickly to market opportunities" },
    ],
    link: "https://motifi-ai.vercel.app/",
    image: motiFiAi,
  },{
    company: "Property Registry dApp on ICP",
    year: "2024",
    title: "Front-End Development",
    results: [
      { title: "Blockchain-powered security for your property records" },
      { title: "Identity verification using ICP's authentication" },
      { title: "Records stored across nodes for maximum reliability" },
    ],
    link: "https://github.com/dr-winner/Decentralized-Land-Registry-on-ICP",
    image: landRegOnIcp,
  },
];

export const Projects = () => {
  return (

    <section id="projects" className="pb-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Real World Results"
          title="Featured Projects"
          description="Explore how I trarnsform mere concepts into super engaging digital
          innovatons."
        />
        <div className="flex md:mt-20 flex-col mt-10 gap-20">
          {portfolioProjects.map((project, index) => (
            <Card
              key={project.title}
              className=" px-8 md:px-10 pt-8 pb-0 md:pt-12 lg:pt-16 lg:px-20 sticky top-16 " style={{
                top: `calc(64px + ${index * 30}px)`
              }}
            >              
              <div className="lg:grid lg:grid-cols-2 lg:gap-16">
                <div className="lg:pb-16">
                  <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex gap-2 font-bold uppercase tracking-widest text-sm text-transparent bg-clip-text p-8">
                    <span>{project.company}</span>
                    <span>&bull;</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-serif text-2xl mt-2 md:mt-5 md:text-4xl">
                    {project.title}
                  </h3>
                  <hr className="border-t-2 border-white/15 mt-4 md:mt-5" />
                  <ul className="flex flex-col gap-4 mt-4 md:mt-5">
                    {project.results.map((result, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-sm text-white/50 md:text-base"
                      >
                        <CheckIcon className="size-5 md:size-6" />
                        <span>{result.title}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={project.link}>
                    <button className="bg-white text-gray-950 h-12 w-full md:w-auto px-6 rounded-xl font-semibold inline-flex items-center justify-center gap-2 mt-8">
                      <span>View Project</span>
                      <ArrowUpRightIcon className="size-4" />
                    </button>
                  </a>
                </div>
                <div className="relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    className="mt-8 -mb-4 md:-mb-0 lg:mt-0 lg:absolute lg:h-full lg:w-auto lg:max-w-none"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
