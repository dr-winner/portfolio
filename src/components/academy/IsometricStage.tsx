"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { AcademyLesson, LessonStep } from "@/content/academy-lessons";

interface IsometricStageProps {
  step: LessonStep;
  lesson?: AcademyLesson;
  isPaused: boolean;
  onTogglePause: () => void;
  onReplay: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const INK = "#211e1b";
const SHADOW_COLOR = "#1c1a17";

const COLOR_THEMES: Record<string, { top: [string, string]; side: [string, string] }> = {
  orange: { top: ["#fee6cc", "#fcd4ad"], side: ["#f9c697", "#f3b47f"] },
  green: { top: ["#e2f2d7", "#d1e9c2"], side: ["#c3e1b2", "#b3d79f"] },
  blue: { top: ["#dfebf9", "#cde0f5"], side: ["#bcd3ef", "#a9c5e8"] },
  yellow: { top: ["#fff3d6", "#fee7b8"], side: ["#fcdb9c", "#f6cd82"] },
  purple: { top: ["#f2eaf9", "#e6dbf4"], side: ["#d9cbef", "#cbbae6"] },
  slab: { top: ["#f7f0e7", "#f0e7dc"], side: ["#ece2d5", "#e3d7c8"] },
  attacker: { top: ["#3a3330", "#2d2724"], side: ["#221e1c", "#181514"] },
};

const round2 = (e: number) => Math.round(e * 100) / 100;

// Exact isometric projection from designed-to-scale.vercel.app
const projectIso = (x: number, y: number, z = 0): [number, number] => [
  round2(14 * (x + y)),
  round2(7 * (x - y) - z),
];

// Rounded polygon silhouette path generator
function roundPolygon(pts: [number, number][], rad: number | number[]) {
  const n = pts.length;
  const getRad = (idx: number) => (Array.isArray(rad) ? rad[idx] : rad);
  const lerp = (p1: [number, number], p2: [number, number], r: number): [number, number] => {
    const rx = p2[0] - p1[0],
      ry = p2[1] - p1[1],
      h = Math.hypot(rx, ry) || 1,
      factor = Math.min(r, h / 2) / h;
    return [p1[0] + rx * factor, p1[1] + ry * factor];
  };
  let d = "";
  for (let idx = 0; idx < n; idx++) {
    const prev = pts[(idx - 1 + n) % n],
      curr = pts[idx],
      next = pts[(idx + 1) % n],
      p1 = lerp(curr, prev, getRad(idx)),
      p2 = lerp(curr, next, getRad(idx));
    d += `${idx === 0 ? "M" : "L"}${round2(p1[0])},${round2(p1[1])} Q${round2(curr[0])},${round2(curr[1])} ${round2(p2[0])},${round2(p2[1])} `;
  }
  return d + "Z";
}

// Rounded corner path generator
function roundPath(pts: [number, number][], rad = 10) {
  if (pts.length < 2) return "";
  let d = `M${round2(pts[0][0])},${round2(pts[0][1])}`;
  for (let idx = 1; idx < pts.length - 1; idx++) {
    const [p0x, p0y] = pts[idx - 1],
      [cx, cy] = pts[idx],
      [p1x, p1y] = pts[idx + 1],
      d0 = Math.hypot(cx - p0x, cy - p0y),
      d1 = Math.hypot(p1x - cx, p1y - cy);
    if (d0 < 0.01 || d1 < 0.01) continue;
    const f = Math.min(rad, d0 / 2, d1 / 2),
      ax = cx + ((p0x - cx) / d0) * f,
      ay = cy + ((p0y - cy) / d0) * f,
      bx = cx + ((p1x - cx) / d1) * f,
      by = cy + ((p1y - cy) / d1) * f;
    d += ` L${round2(ax)},${round2(ay)} Q${round2(cx)},${round2(cy)} ${round2(bx)},${round2(by)}`;
  }
  const last = pts[pts.length - 1];
  return d + ` L${round2(last[0])},${round2(last[1])}`;
}

// 3D Isometric Prism Geometry
function buildPrism({
  x0,
  x1,
  y0,
  y1,
  h,
  radius = 9,
}: {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  h: number;
  radius?: number;
}) {
  const topN = projectIso(x0, y1, h),
    topE = projectIso(x1, y1, h),
    topS = projectIso(x1, y0, h),
    topW = projectIso(x0, y0, h),
    botE = projectIso(x1, y1, 0),
    botS = projectIso(x1, y0, 0),
    botW = projectIso(x0, y0, 0),
    cornerR = Math.max(1, Math.min(radius, h / 2 - 0.5)),
    midY = projectIso((x0 + x1) / 2, (y0 + y1) / 2, h)[1],
    outlinePts: [number, number][] = [topN, topE, botE, botS, botW, topW];

  return {
    T: topN,
    R: topE,
    B: topS,
    L: topW,
    Rd: botE,
    Bd: botS,
    Ld: botW,
    ty: midY,
    outline: outlinePts,
    sil: roundPolygon(outlinePts, [radius + 1, cornerR, cornerR, radius + 3, cornerR, cornerR]),
    top: roundPolygon([topN, topE, topS, topW], [radius + 1, cornerR, 6, cornerR]),
    sheen: roundPolygon(
      [topN, topE, topS, topW].map(([vx, vy]) => [vx, vy - 3 + (vy - midY) * -0.25]),
      [radius + 1, cornerR, 6, cornerR]
    ),
    right: roundPolygon([topS, topE, botE, botS], [6, cornerR, cornerR, radius + 3]),
    bevel: roundPath([topW, topS, topE], 8),
  };
}

// Render shaded 3D Prism SVG
function renderShadedPrism(
  prism: ReturnType<typeof buildPrism>,
  colorKey: string,
  { stroke = INK, sw = 1.9 } = {}
) {
  return `
    <path d="${prism.sil}" fill="url(#g-${colorKey}-side)"/>
    <path d="${prism.right}" fill="#3a2a14" opacity=".05"/>
    <path d="${prism.top}" fill="url(#g-${colorKey}-top)"/>
    <path d="${prism.sheen}" fill="#fff" opacity=".22" filter="url(#blur-sm)"/>
    <path d="${prism.bevel}" transform="translate(0 1.4)" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/>
    <path d="${prism.bevel}" transform="translate(0 3.4)" fill="none" stroke="#5a4123" stroke-opacity=".07" stroke-width="2.4" stroke-linecap="round"/>
    <path d="${prism.sil}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
  `;
}

// Prism Drop Shadow
function renderPrismShadow(prism: ReturnType<typeof buildPrism>, h: number, lift: number, opacity: number) {
  const offsetY = Math.min(9, 3 + h * 0.15);
  return `<path d="${prism.sil}" transform="translate(0 ${round2(offsetY + lift)})" fill="#6b5236" opacity="${round2(opacity)}" filter="url(#blur-sm)"/>`;
}

// Isometric Extruded Box
function renderIsoBox(
  {
    x0,
    x1,
    y0,
    y1,
    z0,
    z1,
  }: {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    z0: number;
    z1: number;
  },
  {
    top,
    front,
    left,
    sw = 1.5,
    r = 2,
  }: {
    top: string;
    front: string;
    left: string;
    sw?: number;
    r?: number;
  }
) {
  const topFace: [number, number][] = [projectIso(x0, y0, z1), projectIso(x0, y1, z1), projectIso(x1, y1, z1), projectIso(x1, y0, z1)],
    frontFace: [number, number][] = [projectIso(x1, y0, z1), projectIso(x1, y1, z1), projectIso(x1, y1, z0), projectIso(x1, y0, z0)],
    leftFace: [number, number][] = [projectIso(x0, y0, z1), projectIso(x1, y0, z1), projectIso(x1, y0, z0), projectIso(x0, y0, z0)],
    silhouette: [number, number][] = [
      projectIso(x0, y0, z1),
      projectIso(x0, y1, z1),
      projectIso(x1, y1, z1),
      projectIso(x1, y1, z0),
      projectIso(x1, y0, z0),
      projectIso(x0, y0, z0),
    ];
  return `
    <path d="${roundPolygon(leftFace, r)}" fill="${left}"/>
    <path d="${roundPolygon(frontFace, r)}" fill="${front}"/>
    <path d="${roundPolygon(topFace, r)}" fill="${top}"/>
    <path d="${roundPolygon(silhouette, r)}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>
  `;
}

// Matrix helper for screen rendering
const isoSideMatrix = (x: number, y: number, z: number) => {
  const [rx, ry] = projectIso(x, y, z);
  return `matrix(1 -0.5 0 1 ${rx} ${ry})`;
};
const isoTopMatrix = (x: number, y: number, z: number) => {
  const [rx, ry] = projectIso(x, y, z);
  return `matrix(1 -0.5 1 0.5 ${rx} ${ry})`;
};

// SVG Definitions
function renderDefs(cx: number, cy: number, radius: number) {
  let s = "";
  for (const [name, colors] of Object.entries(COLOR_THEMES)) {
    s += `
      <linearGradient id="g-${name}-top" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stop-color="${colors.top[0]}"/>
        <stop offset="1" stop-color="${colors.top[1]}"/>
      </linearGradient>
      <linearGradient id="g-${name}-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${colors.side[0]}"/>
        <stop offset="1" stop-color="${colors.side[1]}"/>
      </linearGradient>`;
  }
  return `
    ${s}
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E3D6F3"/>
      <stop offset="1" stop-color="#C9B5E6"/>
    </linearGradient>
    <linearGradient id="screen-glare" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
      <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="screen-red" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fca5a5"/>
      <stop offset="1" stop-color="#ef4444"/>
    </linearGradient>
    <filter id="blur-sm" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="blur-md" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse" markerUnits="strokeWidth">
      <path d="M1,1.2 L9,5 L1,8.8 Z" fill="${INK}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>
    </marker>
    <marker id="arrow-muted" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse" markerUnits="strokeWidth">
      <path d="M1,1.2 L9,5 L1,8.8 Z" fill="#a59c90" stroke="#a59c90" stroke-width="1" stroke-linejoin="round"/>
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse" markerUnits="strokeWidth">
      <path d="M1,1.2 L9,5 L1,8.8 Z" fill="#dc2626" stroke="#dc2626" stroke-width="1" stroke-linejoin="round"/>
    </marker>
    <pattern id="iso-grid" patternUnits="userSpaceOnUse" x="0" y="-7" width="28" height="14">
      <path d="M0 7 L14 0 L28 7 L14 14 Z" fill="none" stroke="#a8916f" stroke-opacity=".3" stroke-width=".8"/>
    </pattern>
    <radialGradient id="grid-fade" gradientUnits="userSpaceOnUse" cx="${round2(cx)}" cy="${round2(cy)}" r="${round2(radius)}" gradientTransform="translate(${round2(cx)} ${round2(cy)}) scale(1 0.6) translate(${round2(-cx)} ${round2(-cy)})">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".45" stop-color="#fff" stop-opacity=".95"/>
      <stop offset=".80" stop-color="#fff" stop-opacity=".35"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="grid-mask" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
      <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid-fade)"/>
    </mask>
    <style>
      @keyframes dropIn {
        0% { transform: translateY(-24px); opacity: 0; }
        65% { transform: translateY(2px); opacity: 1; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes popPill {
        0% { transform: scale(0.85); opacity: 0; }
        70% { transform: scale(1.04); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .anim-drop { animation: dropIn 0.38s cubic-bezier(0.34, 1.4, 0.64, 1) both; }
      .anim-pop { animation: popPill 0.32s cubic-bezier(0.34, 1.4, 0.64, 1) both; }
    </style>
  `;
}

// High-fidelity Floating Pill Badge
function renderPill(
  cx: number,
  cy: number,
  text: string,
  {
    icon = null,
    tone = "paper",
  }: {
    icon?: "globe" | "user" | "skull" | "arrow" | "shield" | null;
    tone?: "paper" | "amber" | "red" | "green";
  } = {}
) {
  const fg =
    tone === "amber"
      ? "#6d4a0c"
      : tone === "red"
        ? "#8f2a22"
        : tone === "green"
          ? "#14532d"
          : INK;
  const bg =
    tone === "amber"
      ? "#fbe5bd"
      : tone === "red"
        ? "#f8d5cf"
        : tone === "green"
          ? "#dcfce7"
          : "#fbf6ef";
  const charWidth = 7.1;
  const iconPad = icon ? 16 : 0;
  const width = Math.max(52, text.length * charWidth + 24 + iconPad);
  const height = 23;
  const x = cx - width / 2;
  const y = cy - height / 2;

  let iconSvg = "";
  if (icon === "globe") {
    iconSvg = `
      <g transform="translate(${x + 12}, ${cy}) scale(0.65)" fill="none" stroke="${fg}" stroke-width="2.2">
        <circle cx="0" cy="0" r="9"/>
        <path d="M-9 0h18 M0 -9a12 12 0 0 0 0 18 M0 -9a12 12 0 0 1 0 18"/>
      </g>
    `;
  } else if (icon === "user") {
    iconSvg = `
      <g transform="translate(${x + 12}, ${cy}) scale(0.65)" fill="none" stroke="${fg}" stroke-width="2.2">
        <circle cx="0" cy="-3.5" r="3.5"/>
        <path d="M-6 7c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
      </g>
    `;
  } else if (icon === "skull") {
    iconSvg = `
      <g transform="translate(${x + 12}, ${cy}) scale(0.6)" fill="${fg}">
        <circle cx="0" cy="-3" r="6"/>
        <rect x="-3" y="1" width="6" height="5" rx="1"/>
        <circle cx="-2" cy="-3" r="1.5" fill="${bg}"/>
        <circle cx="2" cy="-3" r="1.5" fill="${bg}"/>
      </g>
    `;
  } else if (icon === "arrow") {
    iconSvg = `
      <g transform="translate(${x + 11}, ${cy}) scale(0.7)" fill="none" stroke="${fg}" stroke-width="2.5" stroke-linecap="round">
        <path d="M-4 0h8 M0 -3.5l3.5 3.5-3.5 3.5"/>
      </g>
    `;
  } else if (icon === "shield") {
    iconSvg = `
      <g transform="translate(${x + 12}, ${cy}) scale(0.6)" fill="none" stroke="${fg}" stroke-width="2.2">
        <path d="M-6 -7h12v7c0 5 -6 8 -6 8s-6 -3 -6 -8z"/>
      </g>
    `;
  }

  const textX = icon ? x + 24 + (width - 24) / 2 : cx;

  return `
    <g class="anim-pop">
      <rect x="${x}" y="${y + 2}" width="${width}" height="${height}" rx="11.5" fill="${SHADOW_COLOR}" />
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="11.5" fill="${bg}" stroke="${INK}" stroke-width="1.4" />
      ${iconSvg}
      <text x="${textX}" y="${cy + 4}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="11" font-weight="700" fill="${fg}">${text}</text>
    </g>
  `;
}

// 3D Isometric Laptop on Rounded Slab
function renderLaptop(
  x: number,
  y: number,
  {
    label = "you",
    urlTag = "https://shop.example",
    isAttacker = false,
    isNew = false,
  }: {
    label?: string;
    urlTag?: string | null;
    isAttacker?: boolean;
    isNew?: boolean;
  } = {}
) {
  const d = 6,
    w = 6;
  const x0 = x - d / 2,
    x1 = x + d / 2,
    y0 = y - w / 2,
    y1 = y + w / 2;
  const prism = buildPrism({ x0, x1, y0, y1, h: 16, radius: 9 });
  const screenBox = {
    x0: x0 + 0.7,
    x1: x0 + 1.05,
    y0: y0 + 0.9,
    y1: y1 - 0.9,
    z0: 19,
    z1: 66,
  };
  const keyboardBox = { x0: screenBox.x1, x1: screenBox.x1 + 2.7, y0: screenBox.y0, y1: screenBox.y1, z0: 16, z1: 19 };
  const screenWidth = (screenBox.y1 - screenBox.y0) * 14,
    screenHeight = screenBox.z1 - screenBox.z0;

  let keys = "";
  const cols = Math.floor((screenWidth - 6) / 4.7);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < cols; col++) {
      keys += `<rect x="${round2(3 + col * 4.7)}" y="${round2(2.5 + row * 4.3)}" width="3.8" height="3.3" rx=".7"/>`;
    }
  }
  const f = screenWidth - 6.8,
    p = screenHeight - 8;
  const screenFace = isAttacker
    ? `
    <rect x="3.4" y="3.4" width="${round2(f)}" height="${round2(p)}" rx="1.5" fill="#2d1515"/>
    <rect x="3.4" y="3.4" width="${round2(f)}" height="7" rx="1.5" fill="#451a1a"/>
    <circle cx="6.6" cy="6.9" r="1" fill="#ef4444"/><circle cx="9.6" cy="6.9" r="1" fill="#f59e0b"/><circle cx="12.6" cy="6.9" r="1" fill="#10b981"/>
    <rect x="7" y="14.5" width="${round2(f - 7.2)}" height="12" rx="1.5" fill="url(#screen-red)"/>
    <rect x="7" y="29.5" width="${round2((f - 7.2) * 0.7)}" height="2.6" rx="1.3" fill="#f87171"/>
    <rect x="7" y="34" width="${round2((f - 7.2) * 0.5)}" height="2.6" rx="1.3" fill="#f87171"/>
    <rect x="3.4" y="3.4" width="${round2(f)}" height="${round2(p)}" rx="1.5" fill="url(#screen-glare)"/>
  `
    : `
    <rect x="3.4" y="3.4" width="${round2(f)}" height="${round2(p)}" rx="1.5" fill="#FBF8F4"/>
    <rect x="3.4" y="3.4" width="${round2(f)}" height="7" rx="1.5" fill="#E4D9CB"/>
    <circle cx="6.6" cy="6.9" r="1" fill="#E5534B"/><circle cx="9.6" cy="6.9" r="1" fill="#EFB041"/><circle cx="12.6" cy="6.9" r="1" fill="#7FC278"/>
    <rect x="16" y="5" width="${round2(f - 16)}" height="3.8" rx="1.9" fill="#FBF8F4"/>
    <rect x="7" y="14.5" width="${round2(f - 7.2)}" height="12" rx="1.5" fill="url(#screen)"/>
    <rect x="7" y="29.5" width="${round2((f - 7.2) * 0.62)}" height="2.6" rx="1.3" fill="#D6CCBF"/>
    <rect x="7" y="34" width="${round2((f - 7.2) * 0.8)}" height="2.6" rx="1.3" fill="#D6CCBF"/>
    <rect x="3.4" y="3.4" width="${round2(f)}" height="${round2(p)}" rx="1.5" fill="url(#screen-glare)"/>
  `;

  const [labelX, labelY] = projectIso(x1, y0, 0);
  const [tagX, tagY] = projectIso(screenBox.x0, (screenBox.y0 + screenBox.y1) / 2, screenBox.z1);
  const slabColor = isAttacker ? "attacker" : "slab";

  return {
    ent: `
      <g class="${isNew ? "anim-drop" : ""}">
        ${renderPrismShadow(prism, 16, 0, 0.2)}
        <g>
          ${renderShadedPrism(prism, slabColor, { stroke: "#3b3631", sw: 1.5 })}
          <path d="${roundPolygon([projectIso(screenBox.x0 - 0.3, screenBox.y0 - 0.3, 16), projectIso(screenBox.x0 - 0.3, screenBox.y1 + 0.3, 16), projectIso(keyboardBox.x1 + 0.3, keyboardBox.y1 + 0.3, 16), projectIso(keyboardBox.x1 + 0.3, keyboardBox.y0 - 0.3, 16)], 6)}" fill="#6b5236" opacity=".14" filter="url(#blur-sm)"/>
          ${renderIsoBox(
            keyboardBox,
            isAttacker
              ? { top: "#38322e", front: "#262220", left: "#2d2825", r: 2.5, sw: 1.4 }
              : { top: "#efeae4", front: "#cfc8c0", left: "#ddd6ce", r: 2.5, sw: 1.4 }
          )}
          <g transform="${isoTopMatrix(keyboardBox.x0 + 0.15, keyboardBox.y0, keyboardBox.z1)}" fill="${isAttacker ? "#4a423d" : "#fbf8f4"}" stroke="${isAttacker ? "#221e1c" : "#b9b1a7"}" stroke-width=".55">
            ${keys}
            <rect x="${round2(screenWidth / 2 - 10)}" y="21.5" width="20" height="9" rx="1.6"/>
          </g>
          ${renderIsoBox(
            screenBox,
            isAttacker
              ? { top: "#2e2825", front: "#1a1715", left: "#221e1b", r: 3, sw: 1.5 }
              : { top: "#8B8580", front: "#3D3935", left: "#6E6862", r: 3, sw: 1.5 }
          )}
          <g transform="${isoSideMatrix(screenBox.x1, screenBox.y0, screenBox.z1)}">${screenFace}</g>
        </g>
      </g>
    `,
    over: `
      ${
        urlTag
          ? `<g transform="translate(${tagX}, ${tagY - 24})">
              ${renderPill(0, 0, urlTag, { icon: isAttacker ? "skull" : "globe", tone: isAttacker ? "red" : "paper" })}
            </g>`
          : isAttacker && label
            ? `<g transform="translate(${tagX}, ${tagY - 24})">
                ${renderPill(0, 0, label, { icon: "skull", tone: "red" })}
              </g>`
            : ""
      }
      ${
        (!isAttacker || urlTag) && label
          ? `<g transform="translate(${labelX}, ${labelY + 24})">
              ${renderPill(0, 0, label, { icon: isAttacker ? "skull" : "user", tone: isAttacker ? "red" : "paper" })}
            </g>`
          : ""
      }
    `,
  };
}

// 3D Isometric Server / Service Cube
function renderCube(
  x: number,
  y: number,
  labelTop: string,
  labelBottom: string,
  {
    color = "yellow",
    glyph = "globe",
    tag = null,
    cpu = null,
    isNew = false,
  }: {
    color?: string;
    glyph?: "globe" | "server" | "balancer" | "brain" | "shield";
    tag?: { text: string; tone?: "paper" | "amber" | "red" | "green"; icon?: "globe" | "user" | "skull" | "arrow" | "shield" } | null;
    cpu?: number | null;
    isNew?: boolean;
  } = {}
) {
  const s = 4,
    h = 46;
  const t = s / 2;
  const prism = buildPrism({ x0: x - t, x1: x + t, y0: y - t, y1: y + t, h, radius: 9 });
  const [topX] = prism.T;
  const ty = prism.ty;

  let glyphSvg = "";
  if (glyph === "globe") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${INK}" stroke-width="1.9">
        <circle cx="0" cy="0" r="10"/>
        <path d="M-10 0h20 M0 -10a14 14 0 0 0 0 20 M0 -10a14 14 0 0 1 0 20"/>
      </g>
    `;
  } else if (glyph === "server") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round">
        <rect x="-11" y="-10" width="22" height="8.5" rx="2.2" fill="#fff" fill-opacity="0.2"/>
        <rect x="-11" y="1.5" width="22" height="8.5" rx="2.2" fill="#fff" fill-opacity="0.2"/>
        <circle cx="-6.5" cy="-5.75" r="1" fill="${INK}"/>
        <circle cx="-6.5" cy="5.75" r="1" fill="${INK}"/>
        <path d="M1 -5.75h5.5 M1 5.75h5.5"/>
      </g>
    `;
  } else if (glyph === "balancer") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round">
        <circle cx="0" cy="-6" r="3.5" fill="#fff" fill-opacity="0.2"/>
        <path d="M-8 6h16 M0 -2.5v8.5 M-8 6l-3 -3 M8 6l3 -3"/>
      </g>
    `;
  } else if (glyph === "brain") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round">
        <circle cx="0" cy="0" r="9"/>
        <path d="M-5 -2h10 M-7 3h14 M0 -9v18"/>
      </g>
    `;
  } else if (glyph === "shield") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${INK}" stroke-width="1.9" stroke-linecap="round">
        <path d="M-8 -9h16v8c0 6 -8 10 -8 10s-8 -4 -8 -10z" fill="#fff" fill-opacity="0.2"/>
        <path d="M-3 0l2 2l4 -4"/>
      </g>
    `;
  }

  const l = ty + (s * 14 * 0.5 + h) * 0.4;
  const labels = `
    <text x="${topX}" y="${l + 2}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13.5" font-weight="800" fill="${INK}">${labelTop}</text>
    <text x="${topX}" y="${l + 16}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600" fill="${INK}">${labelBottom}</text>
  `;

  let tagPill = "";
  if (tag) {
    tagPill = `
      <g transform="translate(${topX}, ${ty - 34})">
        ${renderPill(0, 0, tag.text, { icon: tag.icon || "arrow", tone: tag.tone || "amber" })}
      </g>
    `;
  }

  let cpuPill = "";
  if (cpu !== null && cpu !== undefined) {
    cpuPill = `
      <g transform="translate(${topX + 58}, ${ty - 22})">
        <g class="anim-pop">
          <rect x="-38" y="-9" width="76" height="21" rx="10.5" fill="${SHADOW_COLOR}" />
          <rect x="-38" y="-11" width="76" height="21" rx="10.5" fill="#fbf6ef" stroke="${INK}" stroke-width="1.3" />
          <circle cx="-25" cy="-0.5" r="4" fill="none" stroke="${INK}" stroke-width="1.4"/>
          <rect x="-16" y="-4" width="26" height="6.5" rx="3.2" fill="#ede5d8" />
          <rect x="-16" y="-4" width="${26 * cpu}" height="6.5" rx="3.2" fill="#10b981" />
          <text x="21" y="2.5" font-family="monospace" font-size="9.5" font-weight="700" fill="${INK}">${Math.round(cpu * 100)}%</text>
        </g>
      </g>
    `;
  }

  return {
    ent: `
      <g class="${isNew ? "anim-drop" : ""}">
        ${renderPrismShadow(prism, h, 0, 0.26)}
        <g>
          ${renderShadedPrism(prism, color)}
          ${glyphSvg}
          ${labels}
        </g>
      </g>
    `,
    over: `
      ${tagPill}
      ${cpuPill}
    `,
  };
}

// 3D Isometric Database Cylinder
function renderDatabase(x: number, y: number, label = "database", isNew = false) {
  const [cx, cy] = projectIso(x, y, 0);
  const r = 26,
    h = 38;
  return {
    ent: `
      <g class="${isNew ? "anim-drop" : ""}">
        <ellipse cx="${cx}" cy="${cy + 6}" rx="${r}" ry="${r * 0.5}" fill="#6b5236" opacity="0.22" filter="url(#blur-sm)"/>
        <path d="M ${cx - r} ${cy} v ${-h} a ${r} ${r * 0.5} 0 0 0 ${r * 2} 0 v ${h} a ${r} ${r * 0.5} 0 0 1 ${-r * 2} 0 Z" fill="url(#g-purple-side)" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
        <ellipse cx="${cx}" cy="${cy - h}" rx="${r}" ry="${r * 0.5}" fill="url(#g-purple-top)" stroke="${INK}" stroke-width="1.8"/>
        <ellipse cx="${cx}" cy="${cy - h - 1.5}" rx="${r - 3}" ry="${(r - 3) * 0.48}" fill="#fff" opacity="0.25" filter="url(#blur-sm)"/>
        <path d="M ${cx - r} ${cy - h * 0.5} a ${r} ${r * 0.5} 0 0 0 ${r * 2} 0" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 3"/>
      </g>
    `,
    over: `
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="700" fill="${INK}">${label}</text>
    `,
  };
}

// 3D Isometric Security Shield Wall
function renderShieldWall(x: number, y: number, label = "Zero-Trust Gate", isNew = false) {
  const [cx, cy] = projectIso(x, y, 10);
  return {
    ent: `
      <g class="${isNew ? "anim-drop" : ""}">
        <ellipse cx="${cx}" cy="${cy + 18}" rx="24" ry="12" fill="#10b981" opacity="0.28" filter="url(#blur-sm)"/>
        <path d="M ${cx - 18} ${cy - 22} L ${cx + 18} ${cy - 22} L ${cx + 18} ${cy + 8} C ${cx + 18} ${cy + 20} ${cx} ${cy + 28} ${cx} ${cy + 28} C ${cx} ${cy + 28} ${cx - 18} ${cy + 20} ${cx - 18} ${cy + 8} Z"
          fill="#e2f2d7" fill-opacity="0.95" stroke="#1b4332" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="${cx}" cy="${cy - 2}" r="4" fill="none" stroke="#1b4332" stroke-width="1.8"/>
        <rect x="${cx - 5}" y="${cy - 2}" width="10" height="9" rx="1.8" fill="#1b4332"/>
      </g>
    `,
    over: `
      <g transform="translate(${cx}, ${cy - 34})">
        ${renderPill(0, 0, label, { icon: "shield", tone: "green" })}
      </g>
    `,
  };
}

export function IsometricStage({
  step,
  lesson,
  isPaused,
}: IsometricStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [replayCount, setReplayCount] = useState(0);

  useEffect(() => {
    function onCustomReplay() {
      setReplayCount((c) => c + 1);
    }
    window.addEventListener("scale-replay-step", onCustomReplay);
    return () => window.removeEventListener("scale-replay-step", onCustomReplay);
  }, []);

  const scene = useMemo(() => {
    const lessonId = lesson?.id ?? "lesson-1-1";
    const stepNum = step.stepNumber;

    // Standard Grid Anchor Points:
    // Client (laptop) on lower-left
    const pClient: [number, number] = [-168, 84];
    // First hop (DNS / Gateway / WAF / Auth) on top-center
    const pFirstHop: [number, number] = [14, -7];
    // Backend (Web Server / API / Agent) on center-right
    const pWeb: [number, number] = [126, 77];
    // Database on far upper-right
    const pDb: [number, number] = [308, -14];
    // Attacker laptop on upper-left (properly offset to prevent any overlap with client)
    const pAttacker: [number, number] = [-112, -126];
    // Security Gate Shield between Web and DB
    const pShield: [number, number] = [140, 4];

    // Standard Link Paths:
    // 1. Client to FirstHop (straight isometric line)
    const linkClientFirstHop = `M ${pClient[0]} ${pClient[1]} L ${pFirstHop[0]} ${pFirstHop[1]}`;
    // 2. Client to Web (smooth elbow bend: client -> [web.x, client.y] -> web)
    const linkClientWeb = roundPath([pClient, [-28, 154], pWeb], 14);
    // 3. FirstHop to Web (straight link)
    const linkFirstHopWeb = `M ${pFirstHop[0]} ${pFirstHop[1]} L ${pWeb[0]} ${pWeb[1]}`;
    // 4. Web to DB (straight link)
    const linkWebDb = `M ${pWeb[0]} ${pWeb[1]} L ${pDb[0]} ${pDb[1]}`;
    // 5. Attacker to Web (smooth elbow link)
    const linkAttackerWeb = roundPath([pAttacker, [15, -35], pWeb], 14);
    // 6. Web through Shield to DB
    const linkWebShield = `M ${pWeb[0]} ${pWeb[1]} L ${pShield[0]} ${pShield[1]}`;
    const linkShieldDb = `M ${pShield[0]} ${pShield[1]} L ${pDb[0]} ${pDb[1]}`;

    // ── CHAPTER 1: LESSON 1-1 (How a Request Travels & Trust Boundaries) ───
    if (lessonId === "lesson-1-1") {
      const client = renderLaptop(0, -12, { label: "you", urlTag: "https://shop.example", isNew: stepNum === 1 });
      const dns = renderCube(0, 1, "DNS", "resolver", { color: "yellow", glyph: "globe", tag: { text: "→ 203.0.113.7", tone: "amber" }, isNew: stepNum === 2 });
      const web = renderCube(10, -1, "Web", "Server", { color: "blue", glyph: "server", cpu: 0.3, isNew: stepNum === 3 });
      const db = renderDatabase(10, 12, "database", stepNum === 4);
      const attacker = renderLaptop(-13, 5, { label: "attacker", urlTag: null, isAttacker: true, isNew: stepNum === 5 });

      if (stepNum === 1) {
        return {
          viewBox: "-320 -150 640 320",
          camCenterX: 0,
          camCenterY: 0,
          camRadius: 300,
          linksSvg: "",
          packetsSvg: "",
          entsSvg: client.ent,
          overSvg: client.over,
        };
      }
      if (stepNum === 2) {
        return {
          viewBox: "-360 -150 660 360",
          camCenterX: -70,
          camCenterY: 30,
          camRadius: 360,
          linksSvg: `<path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>`,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop} L ${pClient[0]} ${pClient[1]}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${dns.ent}`,
          overSvg: `
            <g transform="translate(${(pClient[0] + pFirstHop[0]) / 2 + 50}, ${(pClient[1] + pFirstHop[1]) / 2 + 16})">
              ${renderPill(0, 0, "where is shop.example?", { tone: "paper" })}
            </g>
            ${client.over} ${dns.over}
          `,
        };
      }
      if (stepNum === 3) {
        return {
          viewBox: "-360 -150 720 390",
          camCenterX: 0,
          camCenterY: 50,
          camRadius: 400,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="#a59c90" stroke-width="1.8" stroke-dasharray="4 4" marker-end="url(#arrow-muted)"/>
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#f97316" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.2s"}" begin="1.1s" repeatCount="indefinite" path="${roundPath([pWeb, [-28, 154], pClient], 14)}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${dns.ent} ${web.ent}`,
          overSvg: `
            <g transform="translate(${(pClient[0] + pFirstHop[0]) / 2 - 15}, ${(pClient[1] + pFirstHop[1]) / 2 + 25})">
              ${renderPill(0, 0, "cached · 5 min", { tone: "paper" })}
            </g>
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "GET /products", { tone: "paper" })}
            </g>
            ${client.over} ${dns.over} ${web.over}
          `,
        };
      }
      if (stepNum === 4) {
        return {
          viewBox: "-380 -140 820 400",
          camCenterX: 30,
          camCenterY: 60,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.4s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
            <circle r="4.3" fill="#06b6d4" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.4s"}" repeatCount="indefinite" path="${linkWebDb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${dns.ent} ${web.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "GET /products", { tone: "paper" })}
            </g>
            <g transform="translate(242, -6)">
              ${renderPill(0, 0, "SELECT … FROM products", { tone: "paper" })}
            </g>
            ${client.over} ${dns.over} ${web.over} ${db.over}
          `,
        };
      }
      // Step 5: Trust Boundary Collapse / Internal Attacker
      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 60,
        camRadius: 480,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
          <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
          </circle>
        `,
        entsSvg: `${client.ent} ${attacker.ent} ${web.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Legitimate Client", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "⚠️ Perimeter Bypass: Unauthenticated Hop", { tone: "red" })}
          </g>
          ${client.over} ${attacker.over} ${web.over} ${db.over}
        `,
      };
    }


    // ── CHAPTER 1: LESSON 1-2 (Authentication, Tokens & Session Lifecycles) ─
    if (lessonId === "lesson-1-2" || lessonId.includes("token") || lessonId.includes("auth-lifecycle")) {
      const client = renderLaptop(0, -12, { label: "client", urlTag: "https://auth.saas.io", isNew: stepNum === 1 });
      const authServer = renderCube(0, 1, "Auth (IdP)", "RS256 / Ed25519", { color: "purple", glyph: "shield", tag: { text: "JWKS Endpoint", tone: "green" }, isNew: stepNum === 1 });
      const gateway = renderCube(10, -1, "API Gateway", "Token Verify", { color: "yellow", glyph: "balancer", cpu: 0.28, isNew: stepNum === 1 });
      const db = renderDatabase(10, 12, "App Database", stepNum === 1);
      const attacker = renderLaptop(-13, 5, {
        label: "attacker",
        urlTag: stepNum === 2 ? "tamper: role=admin" : "alg: none",
        isAttacker: true,
        isNew: stepNum === 2,
      });
      const shield = renderShieldWall(6, 4, "Pinned RS256 + JWKS", stepNum === 4);
      const redis = renderDatabase(10, 18, "Redis Revoke", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -150 720 380",
          camCenterX: -20,
          camCenterY: 30,
          camRadius: 380,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#8b5cf6" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.2s"}" begin="1s" repeatCount="indefinite" path="${linkFirstHopWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${authServer.ent} ${gateway.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(${(pClient[0] + pFirstHop[0]) / 2 + 35}, ${(pClient[1] + pFirstHop[1]) / 2 + 10})">
              ${renderPill(0, 0, "POST /oauth/token (credentials)", { tone: "paper" })}
            </g>
            <g transform="translate(180, 130)">
              ${renderPill(0, 0, "Bearer: RS256 Signed JWT", { tone: "green" })}
            </g>
            ${client.over} ${authServer.over} ${gateway.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 20,
          camCenterY: 60,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${gateway.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Valid Client JWT (role: user)", { tone: "green" })}
            </g>
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "⚠️ Signature Mismatch: 401 Unauthorized", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${gateway.over} ${db.over}
          `,
        };
      }

      if (stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 20,
          camCenterY: 60,
          camRadius: 460,
          linksSvg: `
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" begin="0.9s" repeatCount="indefinite" path="${linkWebDb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${gateway.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "⚠️ alg: none Accepted (Privilege Escalation)", { tone: "red" })}
            </g>
            <g transform="translate(242, -6)">
              ${renderPill(0, 0, "Admin Actions Executed", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${gateway.over} ${db.over}
          `,
        };
      }

      if (stepNum === 4) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 60,
          camRadius: 480,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
            <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
            <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${gateway.ent} ${shield.ent} ${db.ent} ${redis.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Verified RS256 Token", { tone: "green" })}
            </g>
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "401 Blocked: alg: none Not Whitelisted", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${gateway.over} ${shield.over} ${db.over} ${redis.over}
          `,
        };
      }

      // Step 5: Verification (Automated Regression Test Suite)
      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 60,
        camRadius: 480,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" begin="1.1s" repeatCount="indefinite" path="${linkShieldDb}"/>
          </circle>
        `,
        entsSvg: `${client.ent} ${gateway.ent} ${shield.ent} ${db.ent} ${redis.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Deterministic Invariant: Pinned RS256", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "8 / 8 Vectors Passing (alg: none, HMAC, expiry)", { tone: "green" })}
          </g>
          ${client.over} ${gateway.over} ${shield.over} ${db.over} ${redis.over}
        `,
      };
    }

    // ── CHAPTER 1: LESSON 1-3 (The Injection Boundary: Data vs Control Planes) ──
    if (lessonId === "lesson-1-3" || lessonId.includes("injection-boundary")) {
      const client = renderLaptop(0, -12, { label: "client", urlTag: "https://db.internal", isNew: stepNum === 1 });
      const lexer = renderCube(0, 1, "SQL Lexer", "AST Parser", { color: "yellow", glyph: "brain", isNew: stepNum === 1 });
      const engine = renderCube(10, -1, "Query Engine", "Interpreter", { color: "blue", glyph: "server", cpu: 0.35, isNew: stepNum === 1 });
      const db = renderDatabase(10, 12, "App Database", stepNum === 1);
      const attacker = renderLaptop(-13, 5, { label: "attacker", urlTag: "' OR 1=1 --", isAttacker: true, isNew: stepNum === 2 });
      const boundary = renderShieldWall(6, 4, "Lexical AST Boundary", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -150 720 380",
          camCenterX: -20,
          camCenterY: 30,
          camRadius: 380,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${lexer.ent} ${engine.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(${(pClient[0] + pFirstHop[0]) / 2 + 35}, ${(pClient[1] + pFirstHop[1]) / 2 + 10})">
              ${renderPill(0, 0, "Data Stream: literal 'alice'", { tone: "paper" })}
            </g>
            <g transform="translate(242, -6)">
              ${renderPill(0, 0, "SELECT WHERE user = 'alice'", { tone: "paper" })}
            </g>
            ${client.over} ${lexer.over} ${engine.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 20,
          camCenterY: 60,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${engine.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, '⚠️ String Concat: "..." + input', { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${engine.over} ${db.over}
          `,
        };
      }

      if (stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 20,
          camCenterY: 60,
          camRadius: 460,
          linksSvg: `
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" begin="0.9s" repeatCount="indefinite" path="${linkWebDb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${engine.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "⚠️ Syntax Takeover: Lexer Mutated AST", { tone: "red" })}
            </g>
            <g transform="translate(242, -6)">
              ${renderPill(0, 0, "OR '1'='1' (Grammar Overridden)", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${engine.over} ${db.over}
          `,
        };
      }

      if (stepNum === 4) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 60,
          camRadius: 480,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
            <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
            <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${engine.ent} ${boundary.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Literal Param Bound to AST Leaf", { tone: "green" })}
            </g>
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "Syntax Treated As Inert Data String", { tone: "paper" })}
            </g>
            ${client.over} ${attacker.over} ${engine.over} ${boundary.over} ${db.over}
          `,
        };
      }

      // Step 5: Verification
      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 60,
        camRadius: 480,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" begin="1.1s" repeatCount="indefinite" path="${linkShieldDb}"/>
          </circle>
        `,
        entsSvg: `${client.ent} ${engine.ent} ${boundary.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "AST Invariant: Control & Data Lexically Isolated", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "AST Boundary Verified: 0 Injections Possible", { tone: "green" })}
          </g>
          ${client.over} ${engine.over} ${boundary.over} ${db.over}
        `,
      };
    }

    // ── CHAPTER 2: APPLICATION SECURITY ──────────────────────────────────
    // ── LESSON 2-1: BOLA / IDOR ───────────────────────────────────────────
    if (lessonId === "lesson-2-1" || lessonId.includes("bola") || lessonId.includes("idor")) {
      const client = renderLaptop(0, -12, { label: "acme (you)", urlTag: "https://api.saas.io", isNew: stepNum === 1 });
      const attacker = renderLaptop(-13, 5, { label: "attacker", urlTag: "tamper 4822", isAttacker: true, isNew: stepNum === 2 });
      const web = renderCube(10, -1, "Invoice", "Service", { color: "blue", glyph: "server", cpu: stepNum >= 4 ? 0.22 : 0.65, isNew: stepNum === 1 });
      const db = renderDatabase(10, 12, "Invoices DB", stepNum === 1);
      const shield = renderShieldWall(6, 4, "Scoped Tenant RLS", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${web.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "GET /invoices/4821 (acme)", { tone: "green" })}
            </g>
            ${client.over} ${web.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${web.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "GET /invoices/4821 (acme)", { tone: "green" })}
            </g>
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "⚠️ GET /invoices/4822 (target)", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${web.over} ${db.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${client.ent} ${attacker.ent} ${web.ent} ${shield.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "GET /invoices/4821 (acme)", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "403 BLOCKED (tenant scope)", { tone: "red" })}
          </g>
          ${client.over} ${attacker.over} ${web.over} ${shield.over} ${db.over}
        `,
      };
    }

    // ── LESSON 2-2: DEEP SQL INJECTION & PARAMETERIZED DEFENSE ────────────
    if (lessonId === "lesson-2-2" || lessonId.includes("sqli")) {
      const client = renderLaptop(0, -12, { label: "user", urlTag: "https://shop.io/login", isNew: stepNum === 1 });
      const backend = renderCube(10, -1, "Auth Svc", "Query Handler", { color: "blue", glyph: "server", cpu: 0.45, isNew: stepNum === 1 });
      const db = renderDatabase(10, 12, "Postgres DB", stepNum === 1);
      const attacker = renderLaptop(-13, 5, { label: "attacker", urlTag: "' UNION SELECT...", isAttacker: true, isNew: stepNum === 2 });
      const stmtGate = renderShieldWall(6, 4, "Prepared Statement Gate", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${backend.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Login: user=alice", { tone: "green" })}
            </g>
            ${client.over} ${backend.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" begin="0.9s" repeatCount="indefinite" path="${linkWebDb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${backend.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, stepNum === 2 ? "⚠️ Tautology: ' OR '1'='1" : "⚠️ UNION SELECT password_hashes", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${backend.over} ${db.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${client.ent} ${attacker.ent} ${backend.ent} ${stmtGate.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Query Plan Compiled Once ($1, $2)", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Syntax Treated As Raw Literal Value", { tone: "paper" })}
          </g>
          ${client.over} ${attacker.over} ${backend.over} ${stmtGate.over} ${db.over}
        `,
      };
    }

    // ── LESSON 2-3: SSRF & CLOUD METADATA (IMDS) ──────────────────────────
    if (lessonId === "lesson-2-3" || lessonId.includes("ssrf")) {
      const client = renderLaptop(0, -12, { label: "user", urlTag: "https://app.io/webhook", isNew: stepNum === 1 });
      const webhook = renderCube(0, 1, "Webhook", "Worker", { color: "yellow", glyph: "balancer", isNew: stepNum === 1 });
      const fetcher = renderCube(10, -1, "Fetch Client", "HTTP Service", { color: "blue", glyph: "server", cpu: 0.5, isNew: stepNum === 1 });
      const imds = renderCube(10, 12, "AWS IMDS", "169.254.169.254", { color: "orange", glyph: "server", tag: { text: "IAM Role Tokens", tone: "amber" }, isNew: stepNum === 1 });
      const attacker = renderLaptop(-13, 5, { label: "attacker", urlTag: "http://169.254...", isAttacker: true, isNew: stepNum === 2 });
      const firewall = renderShieldWall(6, 4, "IMDSv2 + RFC 1918 Filter", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -150 720 380",
          camCenterX: -20,
          camCenterY: 30,
          camRadius: 380,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${webhook.ent} ${fetcher.ent} ${imds.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Public Webhook: 200 OK", { tone: "green" })}
            </g>
            ${client.over} ${webhook.over} ${fetcher.over} ${imds.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" begin="0.9s" repeatCount="indefinite" path="${linkWebDb}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${fetcher.ent} ${imds.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, stepNum === 2 ? "⚠️ Internal Probe: 169.254.169.254" : "⚠️ IAM Role Credentials Dumped", { tone: "red" })}
            </g>
            ${client.over} ${attacker.over} ${fetcher.over} ${imds.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${client.ent} ${attacker.ent} ${fetcher.ent} ${firewall.ent} ${imds.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "IMDSv2 Session Token Required", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Private IP Egress Blocked (RFC 1918)", { tone: "red" })}
          </g>
          ${client.over} ${attacker.over} ${fetcher.over} ${firewall.over} ${imds.over}
        `,
      };
    }

    // ── LESSON 2-4: XSS & STRICT CSP DEFENSE ──────────────────────────────
    if (lessonId === "lesson-2-4" || lessonId.includes("xss")) {
      const victim = renderLaptop(0, -12, { label: "victim", urlTag: "https://blog.io/post/42", isNew: stepNum === 1 });
      const web = renderCube(0, 1, "Web App", "Server", { color: "yellow", glyph: "server", isNew: stepNum === 1 });
      const db = renderDatabase(10, 12, "Comments DB", stepNum === 1);
      const attacker = renderLaptop(-13, 5, { label: "attacker", urlTag: "<script>fetch...", isAttacker: true, isNew: stepNum === 2 });
      const cspGate = renderShieldWall(6, 4, "Strict CSP Nonce Gate", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -150 720 380",
          camCenterX: -20,
          camCenterY: 30,
          camRadius: 380,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
          `,
          entsSvg: `${victim.ent} ${web.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Clean Stored Comment", { tone: "green" })}
            </g>
            ${victim.over} ${web.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkClientWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${victim.ent} ${attacker.ent} ${web.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, stepNum === 2 ? "⚠️ Stored Payload: <script>..." : "⚠️ DOM Injection: Session Cookie Stolen", { tone: "red" })}
            </g>
            ${victim.over} ${attacker.over} ${web.over} ${db.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${victim.ent} ${attacker.ent} ${web.ent} ${cspGate.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "script-src 'nonce-...'; HttpOnly", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Inline Script Refused (Missing Nonce)", { tone: "red" })}
          </g>
          ${victim.over} ${attacker.over} ${web.over} ${cspGate.over} ${db.over}
        `,
      };
    }

    // ── CHAPTER 3: AI & LLM AGENT SECURITY ────────────────────────────────
    // ── LESSON 3-1: DIRECT & INDIRECT PROMPT INJECTION ────────────────────
    if (lessonId === "lesson-3-1" || lessonId.includes("prompt-injection")) {
      const user = renderLaptop(0, -12, { label: "user", urlTag: "agent://summarize", isNew: stepNum === 1 });
      const untrustedSource = renderCube(-13, 5, "Untrusted", "Web Source", { color: "orange", glyph: "globe", isNew: stepNum === 2 });
      const agentCore = renderCube(10, -1, "LLM Agent", "Core", { color: "purple", glyph: "brain", cpu: stepNum >= 4 ? 0.32 : 0.78, isNew: stepNum === 1 });
      const vectorDb = renderDatabase(10, 12, "Knowledge DB", stepNum === 1);
      const guardrail = renderShieldWall(6, 4, "Dual-LLM Guardrail", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${agentCore.ent} ${vectorDb.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Prompt: Summarize Policy", { tone: "green" })}
            </g>
            ${user.over} ${agentCore.over} ${vectorDb.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${untrustedSource.ent} ${agentCore.ent} ${vectorDb.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "User Prompt", { tone: "green" })}
            </g>
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, stepNum === 2 ? "⚠️ Poisoned Context Injected" : "⚠️ Model Control Plane Hijacked", { tone: "red" })}
            </g>
            ${user.over} ${untrustedSource.over} ${agentCore.over} ${vectorDb.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${user.ent} ${untrustedSource.ent} ${agentCore.ent} ${guardrail.ent} ${vectorDb.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Sanitized Prompt Response", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Quarantined Injection: Data Blocked", { tone: "red" })}
          </g>
          ${user.over} ${untrustedSource.over} ${agentCore.over} ${guardrail.over} ${vectorDb.over}
        `,
      };
    }

    // ── LESSON 3-2: EXCESSIVE AGENCY & AUTONOMOUS TOOL HIJACKING ───────────
    if (lessonId === "lesson-3-2" || lessonId.includes("agency")) {
      const user = renderLaptop(0, -12, { label: "user", urlTag: "agent://inbox", isNew: stepNum === 1 });
      const emailPayload = renderCube(-13, 5, "Poisoned", "Email Hook", { color: "orange", glyph: "globe", isNew: stepNum === 2 });
      const agent = renderCube(0, 1, "Agent Core", "Autonomous", { color: "purple", glyph: "brain", cpu: 0.82, isNew: stepNum === 1 });
      const runner = renderCube(10, -1, "Tool Runner", "Exec Engine", { color: "blue", glyph: "server", isNew: stepNum === 1 });
      const db = renderDatabase(10, 12, "Accounts DB", stepNum === 1);
      const gate = renderShieldWall(6, 4, "Human-in-the-Loop Gate", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${agent.ent} ${runner.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Authorized Tool: read_inbox()", { tone: "green" })}
            </g>
            ${user.over} ${agent.over} ${runner.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${emailPayload.ent} ${agent.ent} ${runner.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, stepNum === 2 ? "⚠️ Injected Prompt: delete_account(102)" : "⚠️ Unbounded Destruction Executed", { tone: "red" })}
            </g>
            ${user.over} ${emailPayload.over} ${agent.over} ${runner.over} ${db.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
          </circle>
        `,
        entsSvg: `${user.ent} ${emailPayload.ent} ${agent.ent} ${runner.ent} ${gate.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Confirmation Required For Mutation", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Unauthorized Destructive Action Blocked", { tone: "red" })}
          </g>
          ${user.over} ${emailPayload.over} ${agent.over} ${runner.over} ${gate.over} ${db.over}
        `,
      };
    }

    // ── LESSON 3-3: CROSS-TENANT RAG RETRIEVAL LEAKS ──────────────────────
    if (lessonId === "lesson-3-3" || lessonId.includes("rag")) {
      const acme = renderLaptop(0, -12, { label: "acme (you)", urlTag: "rag://query", isNew: stepNum === 1 });
      const ingestion = renderCube(0, 1, "Embedding", "Pipeline", { color: "yellow", glyph: "brain", isNew: stepNum === 1 });
      const vectorDb = renderDatabase(10, -1, "Shared Vector DB", stepNum === 1);
      const llmSynth = renderCube(10, 12, "LLM Synthesis", "Engine", { color: "purple", glyph: "brain", cpu: 0.65, isNew: stepNum === 1 });
      const aclFilter = renderShieldWall(6, 4, "Pre-Filter Metadata ACL", stepNum === 4);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
          `,
          entsSvg: `${acme.ent} ${ingestion.ent} ${vectorDb.ent} ${llmSynth.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Ingestion: Multi-Tenant Vectors", { tone: "paper" })}
            </g>
            ${acme.over} ${ingestion.over} ${vectorDb.over} ${llmSynth.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkWebDb}"/>
            </circle>
          `,
          entsSvg: `${acme.ent} ${ingestion.ent} ${vectorDb.ent} ${llmSynth.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Query: Enterprise Pricing", { tone: "green" })}
            </g>
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, "⚠️ Leaked: Globex Competitor Pricing Vectors", { tone: "red" })}
            </g>
            ${acme.over} ${ingestion.over} ${vectorDb.over} ${llmSynth.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${acme.ent} ${ingestion.ent} ${vectorDb.ent} ${aclFilter.ent} ${llmSynth.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "filter: { tenant_id: 'acme' } Enforced", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Pre-Filtered Before Vector Similarity ANN", { tone: "green" })}
          </g>
          ${acme.over} ${ingestion.over} ${vectorDb.over} ${aclFilter.over} ${llmSynth.over}
        `,
      };
    }

    // ── LESSON 3-4: DETERMINISTIC GUARDRAILS & TAINT TRACKING ──────────────
    if (lessonId === "lesson-3-4" || lessonId.includes("guardrail") || lessonId.includes("taint")) {
      const user = renderLaptop(0, -12, { label: "user", urlTag: "agent://core", isNew: stepNum === 1 });
      const adversary = renderLaptop(-13, 5, { label: "adversary", urlTag: "base64 bypass", isAttacker: true, isNew: stepNum === 2 });
      const judge = renderCube(0, 1, "LLM Judge", "(Probabilistic)", { color: "yellow", glyph: "brain", isNew: stepNum === 1 });
      const execEngine = renderCube(10, -1, "Exec Engine", "Tool Pipeline", { color: "blue", glyph: "server", cpu: 0.6, isNew: stepNum === 1 });
      const astGate = renderShieldWall(6, 4, "Deterministic AST Gate", stepNum === 4);
      const db = renderDatabase(10, 12, "Production Sink", stepNum === 1);

      if (stepNum === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${linkClientFirstHop}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${linkFirstHopWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientFirstHop}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${judge.ent} ${execEngine.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "LLM Judge: 95% Accuracy", { tone: "paper" })}
            </g>
            ${user.over} ${judge.over} ${execEngine.over} ${db.over}
          `,
        };
      }

      if (stepNum === 2 || stepNum === 3) {
        return {
          viewBox: "-380 -250 840 500",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${linkWebDb}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${INK}" stroke-width="1.3">
              <animateMotion dur="${isPaused ? "0s" : "1.8s"}" repeatCount="indefinite" path="${linkAttackerWeb}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${adversary.ent} ${judge.ent} ${execEngine.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(30, -35)">
              ${renderPill(0, 0, stepNum === 2 ? "⚠️ Base64 + Persona Jailbreak" : "⚠️ Probabilistic Judge Fooled", { tone: "red" })}
            </g>
            ${user.over} ${adversary.over} ${judge.over} ${execEngine.over} ${db.over}
          `,
        };
      }

      return {
        viewBox: "-380 -250 840 500",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkWebShield}" fill="none" stroke="${INK}" stroke-width="2.2"/>
          <path d="${linkShieldDb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${linkAttackerWeb}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
            <animateMotion dur="${isPaused ? "0s" : "2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
          </circle>
        `,
        entsSvg: `${user.ent} ${adversary.ent} ${execEngine.ent} ${astGate.ent} ${db.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Taint Tracking: Invariant Enforced", { tone: "green" })}
          </g>
          <g transform="translate(30, -35)">
            ${renderPill(0, 0, "Deterministic AST Gate: 100% Block", { tone: "green" })}
          </g>
          ${user.over} ${adversary.over} ${execEngine.over} ${astGate.over} ${db.over}
        `,
      };
    }

    // Default Fallback
    const fallbackClient = renderLaptop(0, -12, { label: "client", urlTag: "https://auth.saas.io" });
    const fallbackServer = renderCube(10, -1, "Resource", "Service", { color: "blue", glyph: "server" });
    const fallbackDb = renderDatabase(10, 12, "App Database");
    return {
      viewBox: "-380 -140 820 400",
      camCenterX: 30,
      camCenterY: 60,
      camRadius: 460,
      linksSvg: `<path d="${linkClientWeb}" fill="none" stroke="${INK}" stroke-width="2.2" marker-end="url(#arrow)"/>`,
      packetsSvg: `
        <circle r="4.3" fill="#10b981" stroke="${INK}" stroke-width="1.3">
          <animateMotion dur="${isPaused ? "0s" : "2.2s"}" repeatCount="indefinite" path="${linkClientWeb}"/>
        </circle>
      `,
      entsSvg: `${fallbackClient.ent} ${fallbackServer.ent} ${fallbackDb.ent}`,
      overSvg: `${fallbackClient.over} ${fallbackServer.over} ${fallbackDb.over}`,
    };
  }, [lesson, step, isPaused]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-[#f5efe6] w-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none"
    >
      <svg
        key={`stage-${lesson?.id ?? "default"}-${replayCount}`}
        viewBox={scene.viewBox}
        className="h-full w-full object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs
          dangerouslySetInnerHTML={{
            __html: renderDefs(scene.camCenterX, scene.camCenterY, scene.camRadius),
          }}
        />
        {/* Layer 1: Floor Grid with Elliptical Vignette Mask */}
        <rect
          x="-5000"
          y="-5000"
          width="10000"
          height="10000"
          fill="url(#iso-grid)"
          mask="url(#grid-mask)"
        />
        {/* Layer 2: Network Connection Links */}
        <g
          className="layer-links"
          dangerouslySetInnerHTML={{ __html: scene.linksSvg }}
        />
        {/* Layer 3: Animated Packets */}
        <g
          className="layer-packets"
          dangerouslySetInnerHTML={{ __html: scene.packetsSvg }}
        />
        {/* Layer 4: 3D Hardware Entities */}
        <g
          className="layer-ents"
          dangerouslySetInnerHTML={{ __html: scene.entsSvg }}
        />
        {/* Layer 5: Floating Pills and Badges */}
        <g
          className="layer-over"
          dangerouslySetInnerHTML={{ __html: scene.overSvg }}
        />
      </svg>
    </div>
  );
}
