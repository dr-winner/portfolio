"use client";

import { useEffect, useRef, useState } from "react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&";

function glyph() {
  return POOL[Math.floor(Math.random() * POOL.length)] ?? "A";
}

export function DecryptTitle({
  text,
  className,
  as = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "p";
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const [chars, setChars] = useState<string[] | null>(null);
  const charsRef = useRef<string[] | null>(null);
  charsRef.current = chars;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    if (sessionStorage.getItem("rwd-decrypt") === text) return;

    const nodes = [...root.querySelectorAll<HTMLElement>("[data-ch]")];
    nodes.forEach((node) => {
      node.style.width = `${node.getBoundingClientRect().width}px`;
    });

    const letters = [...text];
    let frame = 0;
    const total = 16;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = frame / total;
      setChars(
        letters.map((letter, index) => {
          if (letter === " ") return " ";
          if (progress > index / letters.length + 0.35) return letter;
          return glyph();
        }),
      );
      if (frame >= total) {
        window.clearInterval(timer);
        setChars(null);
        nodes.forEach((node) => {
          node.style.width = "";
        });
        sessionStorage.setItem("rwd-decrypt", text);
      }
    }, 48);

    return () => window.clearInterval(timer);
  }, [text]);

  function replay(event: React.MouseEvent<HTMLElement>) {
    if (charsRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return;
    const last = Number(sessionStorage.getItem("rwd-decrypt-hover") ?? 0);
    if (Date.now() - last < 3000) return;
    sessionStorage.setItem("rwd-decrypt-hover", String(Date.now()));
    const target = event.currentTarget;
    const word = (event.target as HTMLElement).closest<HTMLElement>("[data-word]");
    if (!word) return;
    const start = Number(word.dataset.start ?? 0);
    const end = start + (word.dataset.word?.length ?? 0);
    const letters = [...text];
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      setChars(
        letters.map((letter, index) => {
          if (index < start || index >= end || letter === " ") return letter;
          if (frame > 6) return letter;
          return glyph();
        }),
      );
      if (frame > 6) {
        window.clearInterval(timer);
        setChars(null);
      }
    }, 40);
    target.addEventListener("mouseleave", () => window.clearInterval(timer), { once: true });
  }

  const Tag = as;
  const shown = chars ?? [...text];
  let cursor = 0;
  const words = text.split(" ").map((word) => {
    const start = cursor;
    const slice = shown.slice(cursor, cursor + word.length);
    cursor += word.length + 1;
    return { word, start, slice };
  });

  return (
    <Tag ref={ref} className={`relative ${className ?? ""}`} aria-label={text} onMouseEnter={replay}>
      {words.map((word) => (
        <span key={word.start} data-word={word.word} data-start={word.start} className="inline-block whitespace-nowrap">
          {word.slice.map((letter, index) => (
            <span key={`${word.start}-${index}`} data-ch="" aria-hidden className="inline-block overflow-hidden text-center">
              {letter}
            </span>
          ))}
          {word.start + word.word.length < text.length ? <span aria-hidden> </span> : null}
        </span>
      ))}
    </Tag>
  );
}
