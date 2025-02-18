import React from "react";
import grainImage from "@/assets/images/grain.jpg";
import { twMerge } from "tailwind-merge";

export const Card = ({className}: {
    className: string,
} ) => {
  return (
    <div className={twMerge("bg-gray-800 rounded-3xl z-0 after:z-10 overflow-hidden relative after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-3xl after:outline-white/20 after:pointer-events-none px-8 md:px-10 pt-8 md:pt-12 lg:pt-16 lg:px-20 ", className)}>
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `url(${grainImage.src})`,
        }}
      ></div>
    </div>
  );
};
