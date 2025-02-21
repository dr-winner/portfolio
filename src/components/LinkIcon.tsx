import React from "react";

export const LinkIcon = ({ component }: { component: React.ElementType }) => {
  const Component = component;
  return (
    <>
      <Component className="size-8 md:size-4 fill-[url(#link-icon-gradient)]" />
      <svg className="size-0 absolute">
        <defs>
          <linearGradient id="link-icon-gradient">
            <stop offset="0%" stopColor="rgb(110 231 183)" />
            <stop offset="100%" stopColor="rgb(56 189 248)" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};