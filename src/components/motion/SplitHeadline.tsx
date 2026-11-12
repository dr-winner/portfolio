import { Reveal } from "@/components/motion/Reveal";

type Tag = "h1" | "h2" | "h3" | "p";

/**
 * Section headline that arrives line by line behind a mask. Server output is
 * complete; only the entrance is animated, and only once it is in view.
 */
export function SplitHeadline({
  lines,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  lines: string[];
  as?: Tag;
  className?: string;
  delay?: number;
}) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <Reveal
          key={line}
          as="span"
          variant="mask"
          delay={delay + index * 80}
          className="line-reveal"
        >
          <span>{line}</span>
        </Reveal>
      ))}
    </Tag>
  );
}
