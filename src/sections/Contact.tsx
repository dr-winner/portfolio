'use client';

import React from "react";
import ArrowUpRightIcon from "@/assets/icons/arrow-up-right.svg";
import grainImage from "@/assets/images/grain.jpg";

export const Contact = () => {
  return (
    <div id="contact" className="py-16 pt-12 lg:py-24 lg:pt-20">
      <div className="container">
        <div className="bg-gradient-to-r from-emerald-300 to-sky-400 text-gray-900 py-8 px-10 rounded-3xl text-center md:text-left relative overflow-hidden ">
          <div
            className="absolute inset-0 opacity-10 -z-10"
            style={{
              backgroundImage: `url(${grainImage.src})`,
            }}
          ></div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center z-10">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl">
                Let&apos;s Build Something the World Can&apos;t Ignore!
              </h2>
              <p className="text-sm mt-2">
                I bring ideas to life through cutting-edge technology and
                creative solutions. Whether it&apos;s web development, AI, or
                blockchain, I&apos;m ready to build something impactful.
                Let&apos;s collaborate and create something the world can&apos;t
                wait to explore!{" "}
              </p>
            </div>
            <div>
              <button
                className="text-white relative hover:scale-105 transition-transform duration-300 bg-gray-900 inline-flex items-center px-6 h-12 rounded-xl gap-2 w-max border border-gray-900 cursor-pointer z-510"
                onClick={() => (window.location.href = "mailto:drwinner03@gmail.com?subject=Inquiry&body=Hi Winner, I would like to get in touch with you.")}
              >
                <span className="font-semibold">Reach out now</span>
                <ArrowUpRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
