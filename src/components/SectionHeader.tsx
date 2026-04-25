import React from "react";
import Balancer from "react-wrap-balancer";
import clsx from "clsx";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  id?: string;
}) {
  const isCenter = align === "center";

  return (
    <header
      id={id}
      className={clsx(
        "flex flex-col gap-3",
        isCenter
          ? "items-start text-left md:items-center md:text-center"
          : "items-start text-left"
      )}
    >
      <span
        className={clsx(
          "chip-cyber w-fit",
          isCenter && "md:mx-auto"
        )}
      >
        <span className="size-1.5 rounded-full bg-cyber-300 shadow-glow-sm" />
        {eyebrow}
      </span>
      <h2
        className={clsx(
          "text-display-etched font-display text-3xl md:text-4xl lg:text-5xl tracking-tight",
          isCenter && "max-w-2xl md:mx-auto"
        )}
      >
        <Balancer>{title}</Balancer>
      </h2>
      {description && (
        <p
          className={clsx(
            "text-white/60 md:text-lg",
            isCenter ? "max-w-xl md:mx-auto" : "max-w-2xl"
          )}
        >
          <Balancer>{description}</Balancer>
        </p>
      )}
    </header>
  );
}
