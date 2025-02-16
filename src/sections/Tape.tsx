import React from "react";
import StarIcon from "@/assets/icons/star.svg";

const words = [
  "Security",
  "User Friendly",
  "Motoko",
  "scaffoldEth",
  "Search Optimization",
  "Usable",
  "Reliable",
  "JavaScript",
  "Scalable",
  "Solidity",
  "TypeScript",
  "Decentralization",
  "UI/UX",
  "Front-End",
  "Smart Contracts",
  "Figma",
  "Blockchain",
  "Web3",
  "On-chain",
];
export const Tape = () => {
  return (
    <div className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400  -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex flex-none gap-4 items-center">
            {words.map((word) => (
              <div key={word} className="inline-flex gap-4 py-3">
                <span className="text-gray-900 font-extrabold txt-sm">
                  {word}
                </span>
                <StarIcon className="size-6  -rotate-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
