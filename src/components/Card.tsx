import React, { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { NoiseLayer } from "./NoiseLayer";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  glow?: boolean;
  interactive?: boolean;
};

export function Card({ className, glow = false, interactive = false, children, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-ink-100/70 backdrop-blur-sm",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl",
        "before:bg-[radial-gradient(ellipse_at_top_left,rgba(60,207,255,0.10),transparent_45%)]",
        interactive && "transition-colors duration-300 hover:border-cyber-300/30",
        glow && "shadow-glow-sm",
        className
      )}
      {...rest}
    >
      <NoiseLayer className="-z-0" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
