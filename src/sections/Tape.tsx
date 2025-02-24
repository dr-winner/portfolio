import React, { Fragment } from "react";
import StarIcon from "@/assets/icons/star.svg";

const words = [
  "Secure",
  "User Friendly",
  "Ai Agent",
  "scaffoldEth",
  "Search Optimization",
  "Usable",
  "Reliable",
  "Gamification",
  "Scalable",
  "Decentralization",
  "UI/UX",
  "Smart Contracts",
  "Figma",
  "Blockchain",
  "NFT",
  "Web3",
  "On-chain",
];
export const Tape = () => {
  return (
    <div className="py-16 lg:py-24 overflow-x-clip">
      <div className="bg-gradient-to-r from-emerald-300 to-sky-400  -rotate-3 -mx-1">
        <div className="flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex flex-none gap-4 py-3 animate-move-left [animation-duration:40s]">
            {[...new Array(2)].fill(0).map((_, idx) => (
              <Fragment key={idx}>
                {words.map((word) => (
                  <div key={word} className="inline-flex gap-4 pr-4 items-center">
                    <span className="text-gray-900 font-extrabold text-sm">
                      {word}
                    </span>
                    <StarIcon className="size-6 -rotate-12" />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
