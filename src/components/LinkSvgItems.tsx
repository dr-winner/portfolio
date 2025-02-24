import React from "react";
import { LinkIcon } from "./LinkIcon";
import { twMerge } from "tailwind-merge";

export const LinkSvgItems = ({
  items,
  className,
  itemsWrapperClassName,
}: {
  items: {
    title: string;
    link: string;
    iconType: React.ElementType;
  }[];
  className?: string;
  itemsWrapperClassName?: string;
}) => {
  return (
    <div className={twMerge(className)}>
      <div
        className={twMerge(
          "flex flex-col items-center md:flex-row gap-4",
          itemsWrapperClassName
        )}
      >
        {items.map((item) => (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            key={item.title}
            className="inline-flex items-center md:gap-1 gap-1.5 cursor-pointer hover:text-blue-400 z-50 hover:scale-105 transition-transform duration-300"
          >
            <span className="font-semibold lg:text-base md:text-xs">{item.title}</span>

            <LinkIcon component={item.iconType} />
          </a>
        ))}
      </div>
    </div>
  );
};
