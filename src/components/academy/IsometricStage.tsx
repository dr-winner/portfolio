"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { LessonStep } from "@/content/academy-lessons";

interface IsometricStageProps {
  step: LessonStep;
  isPaused: boolean;
  onTogglePause: () => void;
  onReplay: () => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

const k = "#211e1b";
const _r = "#1c1a17";

const vr: Record<string, { top: [string, string]; side: [string, string] }> = {
  orange: { top: ["#fee6cc", "#fcd4ad"], side: ["#f9c697", "#f3b47f"] },
  green: { top: ["#e2f2d7", "#d1e9c2"], side: ["#c3e1b2", "#b3d79f"] },
  blue: { top: ["#dfebf9", "#cde0f5"], side: ["#bcd3ef", "#a9c5e8"] },
  yellow: { top: ["#fff3d6", "#fee7b8"], side: ["#fcdb9c", "#f6cd82"] },
  purple: { top: ["#f2eaf9", "#e6dbf4"], side: ["#d9cbef", "#cbbae6"] },
  slab: { top: ["#f7f0e7", "#f0e7dc"], side: ["#ece2d5", "#e3d7c8"] },
  attacker: { top: ["#3a3330", "#2d2724"], side: ["#221e1c", "#181514"] },
};

const A = (e: number) => Math.round(e * 100) / 100;
const j = (x: number, y: number, z = 0): [number, number] => [
  A(14 * (x + y)),
  A(7 * (x - y) - z),
];

function Sr(e: [number, number][], t: number | number[]) {
  const n = e.length;
  const r = (idx: number) => (Array.isArray(t) ? t[idx] : t);
  const i = (p1: [number, number], p2: [number, number], rad: number): [number, number] => {
    const rx = p2[0] - p1[0],
      ry = p2[1] - p1[1],
      h = Math.hypot(rx, ry) || 1,
      factor = Math.min(rad, h / 2) / h;
    return [p1[0] + rx * factor, p1[1] + ry * factor];
  };
  let a = "";
  for (let idx = 0; idx < n; idx++) {
    const o = e[(idx - 1 + n) % n],
      s = e[idx],
      c = e[(idx + 1) % n],
      l = i(s, o, r(idx)),
      u = i(s, c, r(idx));
    a += `${idx === 0 ? "M" : "L"}${A(l[0])},${A(l[1])} Q${A(s[0])},${A(s[1])} ${A(u[0])},${A(u[1])} `;
  }
  return a + "Z";
}

function Cr(e: [number, number][], t = 10) {
  let n = `M${A(e[0][0])},${A(e[0][1])}`;
  for (let r = 1; r < e.length - 1; r++) {
    const [i, a] = e[r - 1],
      [o, s] = e[r],
      [c, l] = e[r + 1],
      u = Math.hypot(o - i, s - a),
      d = Math.hypot(c - o, l - s);
    if (u < 0.01 || d < 0.01) continue;
    const f = Math.min(t, u / 2, d / 2),
      p = o + ((i - o) / u) * f,
      m = s + ((a - s) / u) * f,
      h = o + ((c - o) / d) * f,
      g = s + ((l - s) / d) * f;
    n += ` L${A(p)},${A(m)} Q${A(o)},${A(s)} ${A(h)},${A(g)}`;
  }
  const r = e[e.length - 1];
  return n + ` L${A(r[0])},${A(r[1])}`;
}

function Gr({
  x0: e,
  x1: t,
  y0: n,
  y1: r,
  h: i,
  radius: a = 9,
}: {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  h: number;
  radius?: number;
}) {
  const o = j(e, r, i),
    s = j(t, r, i),
    c = j(t, n, i),
    l = j(e, n, i),
    u = j(t, r, 0),
    d = j(t, n, 0),
    f = j(e, n, 0),
    p = Math.max(1, Math.min(a, i / 2 - 0.5)),
    m = j((e + t) / 2, (n + r) / 2, i)[1],
    h: [number, number][] = [o, s, u, d, f, l];
  return {
    T: o,
    R: s,
    B: c,
    L: l,
    Rd: u,
    Bd: d,
    Ld: f,
    ty: m,
    outline: h,
    sil: Sr(h, [a + 1, p, p, a + 3, p, p]),
    top: Sr([o, s, c, l], [a + 1, p, 6, p]),
    sheen: Sr(
      [o, s, c, l].map(([vx, vy]) => [vx, vy - 3 + (vy - m) * -0.25]),
      [a + 1, p, 6, p]
    ),
    right: Sr([c, s, u, d], [6, p, p, a + 3]),
    bevel: Cr([l, c, s], 8),
  };
}

function Kr(
  e: ReturnType<typeof Gr>,
  t: string,
  { stroke: n = k, sw: r = 1.9 } = {}
) {
  return `
    <path d="${e.sil}" fill="url(#g-${t}-side)"/>
    <path d="${e.right}" fill="#3a2a14" opacity=".05"/>
    <path d="${e.top}" fill="url(#g-${t}-top)"/>
    <path d="${e.sheen}" fill="#fff" opacity=".22" filter="url(#blur-sm)"/>
    <path d="${e.bevel}" transform="translate(0 1.4)" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/>
    <path d="${e.bevel}" transform="translate(0 3.4)" fill="none" stroke="#5a4123" stroke-opacity=".07" stroke-width="2.4" stroke-linecap="round"/>
    <path d="${e.sil}" fill="none" stroke="${n}" stroke-width="${r}" stroke-linejoin="round"/>
  `;
}

function qr(e: ReturnType<typeof Gr>, t: number, n: number, r: number) {
  const i = Math.min(9, 3 + t * 0.15);
  return `<path d="${e.sil}" transform="translate(0 ${A(i + n)})" fill="#6b5236" opacity="${A(r)}" filter="url(#blur-sm)"/>`;
}

function si(
  {
    x0: e,
    x1: t,
    y0: n,
    y1: r,
    z0: i,
    z1: a,
  }: {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
    z0: number;
    z1: number;
  },
  {
    top: o,
    front: s,
    left: c,
    sw: l = 1.5,
    r: u = 2,
  }: {
    top: string;
    front: string;
    left: string;
    sw?: number;
    r?: number;
  }
) {
  const d: [number, number][] = [j(e, n, a), j(e, r, a), j(t, r, a), j(t, n, a)],
    f: [number, number][] = [j(t, n, a), j(t, r, a), j(t, r, i), j(t, n, i)],
    p: [number, number][] = [j(e, n, a), j(t, n, a), j(t, n, i), j(e, n, i)],
    m: [number, number][] = [j(e, n, a), j(e, r, a), j(t, r, a), j(t, r, i), j(t, n, i), j(e, n, i)];
  return `
    <path d="${Sr(p, u)}" fill="${c}"/>
    <path d="${Sr(f, u)}" fill="${s}"/>
    <path d="${Sr(d, u)}" fill="${o}"/>
    <path d="${Sr(m, u)}" fill="none" stroke="${k}" stroke-width="${l}" stroke-linejoin="round"/>
  `;
}

const yr = (e: number, t: number, n: number) => {
  const [r, i] = j(e, t, n);
  return `matrix(1 -0.5 0 1 ${r} ${i})`;
};
const xr = (e: number, t: number, n: number) => {
  const [r, i] = j(e, t, n);
  return `matrix(1 -0.5 1 0.5 ${r} ${i})`;
};

function renderDefs(cx: number, cy: number, radius: number) {
  let s = "";
  for (const [name, colors] of Object.entries(vr)) {
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
    <linearGradient id="cyl-sheen" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".3" stop-color="#fff" stop-opacity=".35"/>
      <stop offset=".55" stop-color="#fff" stop-opacity=".05"/>
      <stop offset="1" stop-color="#4b2f6b" stop-opacity=".08"/>
    </linearGradient>
    <filter id="blur-sm" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="blur-md" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9"/></filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse" markerUnits="strokeWidth">
      <path d="M1,1.2 L9,5 L1,8.8 Z" fill="${k}" stroke="${k}" stroke-width="1" stroke-linejoin="round"/>
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
    <radialGradient id="grid-fade" gradientUnits="userSpaceOnUse" cx="${A(cx)}" cy="${A(cy)}" r="${A(radius)}" gradientTransform="translate(${A(cx)} ${A(cy)}) scale(1 0.6) translate(${A(-cx)} ${A(-cy)})">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".42" stop-color="#fff" stop-opacity=".92"/>
      <stop offset=".78" stop-color="#fff" stop-opacity=".35"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="grid-mask" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
      <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#grid-fade)"/>
    </mask>
    <style>
      @keyframes dropIn {
        0% { transform: translateY(-30px); opacity: 0; }
        60% { transform: translateY(3px); opacity: 1; }
        100% { transform: translateY(0); opacity: 1; }
      }
      @keyframes popBubble {
        0% { transform: scale(0.85); }
        100% { transform: scale(1); }
      }
      .anim-drop { animation: dropIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .anim-pop { animation: popBubble 0.3s ease-out both; }
    </style>
  `;
}

function renderPill(
  cx: number,
  cy: number,
  text: string,
  {
    icon = null,
    tone = "paper",
  }: {
    icon?: "globe" | "user" | "skull" | "arrow" | null;
    tone?: "paper" | "amber" | "red" | "green";
  } = {}
) {
  const fg =
    tone === "amber"
      ? "#6d4a0c"
      : tone === "red"
        ? "#8f2a22"
        : tone === "green"
          ? "#24521c"
          : k;
  const bg =
    tone === "amber"
      ? "#fbe5bd"
      : tone === "red"
        ? "#f8d5cf"
        : tone === "green"
          ? "#dcefd2"
          : "#fbf6ef";
  const charWidth = 7.2;
  const iconPad = icon ? 16 : 0;
  const width = Math.max(50, text.length * charWidth + 24 + iconPad);
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
  }

  const textX = icon ? x + 24 + (width - 24) / 2 : cx;

  return `
    <g class="anim-pop">
      <rect x="${x}" y="${y + 2}" width="${width}" height="${height}" rx="11.5" fill="${_r}" />
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="11.5" fill="${bg}" stroke="${k}" stroke-width="1.4" />
      ${iconSvg}
      <text x="${textX}" y="${cy + 4}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-size="11" font-weight="700" fill="${fg}">${text}</text>
    </g>
  `;
}

function renderLaptop(
  x: number,
  y: number,
  label = "you",
  urlTag = "https://shop.example",
  isAttacker = false
) {
  const d = 6,
    w = 6;
  const t = x - d / 2,
    n = x + d / 2,
    r = y - w / 2,
    i = y + w / 2;
  const a = Gr({ x0: t, x1: n, y0: r, y1: i, h: 16, radius: 9 });
  const o = {
    x0: t + 0.7,
    x1: t + 1.05,
    y0: r + 0.9,
    y1: i - 0.9,
    z0: 19,
    z1: 66,
  };
  const s = { x0: o.x1, x1: o.x1 + 2.7, y0: o.y0, y1: o.y1, z0: 16, z1: 19 };
  const c = (o.y1 - o.y0) * 14,
    l = o.z1 - o.z0;
  let keys = "";
  const cols = Math.floor((c - 6) / 4.7);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < cols; col++) {
      keys += `<rect x="${A(3 + col * 4.7)}" y="${A(2.5 + row * 4.3)}" width="3.8" height="3.3" rx=".7"/>`;
    }
  }
  const f = c - 6.8,
    p = l - 8;
  const screenFace = isAttacker
    ? `
    <rect x="3.4" y="3.4" width="${A(f)}" height="${A(p)}" rx="1.5" fill="#2d1515"/>
    <rect x="3.4" y="3.4" width="${A(f)}" height="7" rx="1.5" fill="#451a1a"/>
    <circle cx="6.6" cy="6.9" r="1" fill="#ef4444"/><circle cx="9.6" cy="6.9" r="1" fill="#f59e0b"/><circle cx="12.6" cy="6.9" r="1" fill="#10b981"/>
    <rect x="7" y="14.5" width="${A(f - 7.2)}" height="12" rx="1.5" fill="url(#screen-red)"/>
    <rect x="7" y="29.5" width="${A((f - 7.2) * 0.7)}" height="2.6" rx="1.3" fill="#f87171"/>
    <rect x="7" y="34" width="${A((f - 7.2) * 0.5)}" height="2.6" rx="1.3" fill="#f87171"/>
    <rect x="3.4" y="3.4" width="${A(f)}" height="${A(p)}" rx="1.5" fill="url(#screen-glare)"/>
  `
    : `
    <rect x="3.4" y="3.4" width="${A(f)}" height="${A(p)}" rx="1.5" fill="#FBF8F4"/>
    <rect x="3.4" y="3.4" width="${A(f)}" height="7" rx="1.5" fill="#E4D9CB"/>
    <circle cx="6.6" cy="6.9" r="1" fill="#E5534B"/><circle cx="9.6" cy="6.9" r="1" fill="#EFB041"/><circle cx="12.6" cy="6.9" r="1" fill="#7FC278"/>
    <rect x="16" y="5" width="${A(f - 16)}" height="3.8" rx="1.9" fill="#FBF8F4"/>
    <rect x="7" y="14.5" width="${A(f - 7.2)}" height="12" rx="1.5" fill="url(#screen)"/>
    <rect x="7" y="29.5" width="${A((f - 7.2) * 0.62)}" height="2.6" rx="1.3" fill="#D6CCBF"/>
    <rect x="7" y="34" width="${A((f - 7.2) * 0.8)}" height="2.6" rx="1.3" fill="#D6CCBF"/>
    <rect x="3.4" y="3.4" width="${A(f)}" height="${A(p)}" rx="1.5" fill="url(#screen-glare)"/>
  `;

  const [labelX, labelY] = j(n, r, 0);
  const [tagX, tagY] = j(o.x0, (o.y0 + o.y1) / 2, o.z1);
  const slabColor = isAttacker ? "attacker" : "slab";

  return {
    ent: `
      <g class="anim-drop">
        ${qr(a, 16, 0, 0.2)}
        <g>
          ${Kr(a, slabColor, { stroke: "#3b3631", sw: 1.5 })}
          <path d="${Sr([j(o.x0 - 0.3, o.y0 - 0.3, 16), j(o.x0 - 0.3, o.y1 + 0.3, 16), j(s.x1 + 0.3, s.y1 + 0.3, 16), j(s.x1 + 0.3, s.y0 - 0.3, 16)], 6)}" fill="#6b5236" opacity=".14" filter="url(#blur-sm)"/>
          ${si(
            s,
            isAttacker
              ? { top: "#38322e", front: "#262220", left: "#2d2825", r: 2.5, sw: 1.4 }
              : { top: "#efeae4", front: "#cfc8c0", left: "#ddd6ce", r: 2.5, sw: 1.4 }
          )}
          <g transform="${xr(s.x0 + 0.15, s.y0, s.z1)}" fill="${isAttacker ? "#4a423d" : "#fbf8f4"}" stroke="${isAttacker ? "#221e1c" : "#b9b1a7"}" stroke-width=".55">
            ${keys}
            <rect x="${A(c / 2 - 10)}" y="21.5" width="20" height="9" rx="1.6"/>
          </g>
          ${si(
            o,
            isAttacker
              ? { top: "#2e2825", front: "#1a1715", left: "#221e1b", r: 3, sw: 1.5 }
              : { top: "#8B8580", front: "#3D3935", left: "#6E6862", r: 3, sw: 1.5 }
          )}
          <g transform="${yr(o.x1, o.y0, o.z1)}">${screenFace}</g>
        </g>
      </g>
    `,
    over: `
      ${
        urlTag
          ? `<g transform="translate(${tagX}, ${tagY - 24})">
              ${renderPill(0, 0, urlTag, { icon: isAttacker ? "skull" : "globe", tone: isAttacker ? "red" : "paper" })}
            </g>`
          : ""
      }
      <g transform="translate(${labelX}, ${labelY + 24})">
        ${renderPill(0, 0, label, { icon: isAttacker ? "skull" : "user", tone: isAttacker ? "red" : "paper" })}
      </g>
    `,
  };
}

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
  }: {
    color?: string;
    glyph?: "globe" | "server" | "balancer" | "brain" | "shield";
    tag?: { text: string; tone?: "paper" | "amber" | "red" | "green"; icon?: "globe" | "user" | "skull" | "arrow" } | null;
    cpu?: number | null;
  } = {}
) {
  const s = 4,
    h = 46;
  const t = s / 2;
  const n = Gr({ x0: x - t, x1: x + t, y0: y - t, y1: y + t, h, radius: 9 });
  const [topX] = n.T;
  const ty = n.ty;

  let glyphSvg = "";
  if (glyph === "globe") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${k}" stroke-width="1.9">
        <circle cx="0" cy="0" r="10"/>
        <path d="M-10 0h20 M0 -10a14 14 0 0 0 0 20 M0 -10a14 14 0 0 1 0 20"/>
      </g>
    `;
  } else if (glyph === "server") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${k}" stroke-width="1.9" stroke-linecap="round">
        <rect x="-11" y="-10" width="22" height="8.5" rx="2.2" fill="#fff" fill-opacity="0.2"/>
        <rect x="-11" y="1.5" width="22" height="8.5" rx="2.2" fill="#fff" fill-opacity="0.2"/>
        <circle cx="-6.5" cy="-5.75" r="1" fill="${k}"/>
        <circle cx="-6.5" cy="5.75" r="1" fill="${k}"/>
        <path d="M1 -5.75h5.5 M1 5.75h5.5"/>
      </g>
    `;
  } else if (glyph === "balancer") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${k}" stroke-width="1.9" stroke-linecap="round">
        <circle cx="0" cy="-6" r="3.5" fill="#fff" fill-opacity="0.2"/>
        <path d="M-8 6h16 M0 -2.5v8.5 M-8 6l-3 -3 M8 6l3 -3"/>
      </g>
    `;
  } else if (glyph === "brain") {
    glyphSvg = `
      <g transform="translate(${topX}, ${ty - 2}) scale(1)" fill="none" stroke="${k}" stroke-width="1.8" stroke-linecap="round">
        <circle cx="0" cy="0" r="9"/>
        <path d="M-5 -2h10 M-7 3h14 M0 -9v18"/>
      </g>
    `;
  }

  const l = ty + (s * 14 * 0.5 + h) * 0.4;
  const labels = `
    <text x="${topX}" y="${l + 2}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13.5" font-weight="800" fill="${k}">${labelTop}</text>
    <text x="${topX}" y="${l + 16}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600" fill="${k}">${labelBottom}</text>
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
          <rect x="-38" y="-9" width="76" height="21" rx="10.5" fill="${_r}" />
          <rect x="-38" y="-11" width="76" height="21" rx="10.5" fill="#fbf6ef" stroke="${k}" stroke-width="1.3" />
          <circle cx="-25" cy="-0.5" r="4" fill="none" stroke="${k}" stroke-width="1.4"/>
          <rect x="-16" y="-4" width="26" height="6.5" rx="3.2" fill="#ede5d8" />
          <rect x="-16" y="-4" width="${26 * cpu}" height="6.5" rx="3.2" fill="#10b981" />
          <text x="21" y="2.5" font-family="monospace" font-size="9.5" font-weight="700" fill="${k}">${Math.round(cpu * 100)}%</text>
        </g>
      </g>
    `;
  }

  return {
    ent: `
      <g class="anim-drop">
        ${qr(n, h, 0, 0.26)}
        <g>
          ${Kr(n, color)}
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

function renderDatabase(x: number, y: number, label = "database") {
  const [cx, cy] = j(x, y, 0);
  const r = 26,
    h = 38;
  return {
    ent: `
      <g class="anim-drop">
        <ellipse cx="${cx}" cy="${cy + 6}" rx="${r}" ry="${r * 0.5}" fill="#6b5236" opacity="0.22" filter="url(#blur-sm)"/>
        <path d="M ${cx - r} ${cy} v ${-h} a ${r} ${r * 0.5} 0 0 0 ${r * 2} 0 v ${h} a ${r} ${r * 0.5} 0 0 1 ${-r * 2} 0 Z" fill="url(#g-purple-side)" stroke="${k}" stroke-width="1.8" stroke-linejoin="round"/>
        <ellipse cx="${cx}" cy="${cy - h}" rx="${r}" ry="${r * 0.5}" fill="url(#g-purple-top)" stroke="${k}" stroke-width="1.8"/>
        <ellipse cx="${cx}" cy="${cy - h - 1.5}" rx="${r - 3}" ry="${(r - 3) * 0.48}" fill="#fff" opacity="0.25" filter="url(#blur-sm)"/>
        <path d="M ${cx - r} ${cy - h * 0.5} a ${r} ${r * 0.5} 0 0 0 ${r * 2} 0" fill="none" stroke="${k}" stroke-width="1.5" stroke-dasharray="3 3"/>
      </g>
    `,
    over: `
      <text x="${cx}" y="${cy + 22}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="11" font-weight="700" fill="${k}">${label}</text>
    `,
  };
}

function renderShieldWall(x: number, y: number, label = "Zero-Trust Gate") {
  const [cx, cy] = j(x, y, 10);
  return {
    ent: `
      <g class="anim-drop">
        <ellipse cx="${cx}" cy="${cy + 18}" rx="24" ry="12" fill="#10b981" opacity="0.28" filter="url(#blur-sm)"/>
        <path d="M ${cx - 18} ${cy - 22} L ${cx + 18} ${cy - 22} L ${cx + 18} ${cy + 8} C ${cx + 18} ${cy + 20} ${cx} ${cy + 28} ${cx} ${cy + 28} C ${cx} ${cy + 28} ${cx - 18} ${cy + 20} ${cx - 18} ${cy + 8} Z"
          fill="#e2f2d7" fill-opacity="0.9" stroke="#1b4332" stroke-width="2.2" stroke-linejoin="round"/>
        <circle cx="${cx}" cy="${cy - 2}" r="4" fill="none" stroke="#1b4332" stroke-width="1.8"/>
        <rect x="${cx - 5}" y="${cy - 2}" width="10" height="9" rx="1.8" fill="#1b4332"/>
      </g>
    `,
    over: `
      <g transform="translate(${cx}, ${cy - 34})">
        ${renderPill(0, 0, label, { tone: "green" })}
      </g>
    `,
  };
}

export function IsometricStage({
  step,
  isPaused: _isPaused,
  onToggleFullscreen: _onToggleFullscreen,
  isFullscreen: _isFullscreen,
}: IsometricStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [replayCount, setReplayCount] = useState(0);

  useEffect(() => {
    setReplayCount((c) => c + 1);
  }, [step.id]);

  useEffect(() => {
    function onCustomReplay() {
      setReplayCount((c) => c + 1);
    }
    window.addEventListener("scale-replay-step", onCustomReplay);
    return () => window.removeEventListener("scale-replay-step", onCustomReplay);
  }, []);

  const { viewBox, camCenterX, camCenterY, camRadius, linksSvg, packetsSvg, entsSvg, overSvg } =
    useMemo(() => {
      const isAiLesson =
        step.id.includes("prompt") ||
        step.id.includes("agent") ||
        step.id.includes("rag");
      const isAttackLesson =
        step.id.includes("idor") ||
        step.id.includes("sqli") ||
        step.id.includes("ssrf") ||
        step.id.includes("xss");
      const isFoundations = !isAiLesson && !isAttackLesson;

      const pDev: [number, number] = [-128, 64];
      const pDns: [number, number] = [-24, -7];
      const pWeb: [number, number] = [98, 64];
      const pDb: [number, number] = [280, -14];
      const pBendDevWeb: [number, number] = [-28, 154];
      const pShield: [number, number] = [190, 25];

      // Foundations Flow:
      if (isFoundations) {
        if (step.stepNumber === 1) {
          const laptop = renderLaptop(0, 0, "you", "https://shop.example");
          return {
            viewBox: "-260 -150 520 300",
            camCenterX: 0,
            camCenterY: 0,
            camRadius: 290,
            linksSvg: "",
            packetsSvg: "",
            entsSvg: laptop.ent,
            overSvg: laptop.over,
          };
        }
        if (step.stepNumber === 2) {
          const midDns: [number, number] = [
            (pDev[0] + pDns[0]) / 2,
            (pDev[1] + pDns[1]) / 2,
          ];
          const laptop = renderLaptop(0, -12, "you", "https://shop.example");
          const dns = renderCube(0, 1, "DNS", "resolver", {
            color: "yellow",
            glyph: "globe",
            tag: { text: "→ 203.0.113.7", tone: "amber" },
          });
          return {
            viewBox: "-380 -160 620 380",
            camCenterX: -70,
            camCenterY: 30,
            camRadius: 350,
            linksSvg: `
              <path d="M ${pDev[0]} ${pDev[1]} L ${pDns[0]} ${pDns[1]}" fill="none" stroke="${k}" stroke-width="2.2" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
            `,
            packetsSvg: `
              <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
                <animateMotion dur="2s" repeatCount="indefinite" path="M ${pDev[0]} ${pDev[1]} L ${pDns[0]} ${pDns[1]} L ${pDev[0]} ${pDev[1]}"/>
              </circle>
            `,
            entsSvg: `${laptop.ent} ${dns.ent}`,
            overSvg: `
              <g transform="translate(${midDns[0] + 55}, ${midDns[1] + 16})">
                ${renderPill(0, 0, "where is shop.example?", { tone: "paper" })}
              </g>
              ${laptop.over}
              ${dns.over}
            `,
          };
        }
        if (step.stepNumber === 3) {
          const bentPathD = Cr([pDev, pBendDevWeb, pWeb], 14);
          const laptop = renderLaptop(0, -12, "you", "https://shop.example");
          const dns = renderCube(0, 1, "DNS", "resolver", { color: "yellow", glyph: "globe" });
          const web = renderCube(10, -1, "Web", "Server", {
            color: "blue",
            glyph: "server",
            cpu: 0.3,
          });
          return {
            viewBox: "-360 -150 720 400",
            camCenterX: 0,
            camCenterY: 50,
            camRadius: 400,
            linksSvg: `
              <path d="M ${pDev[0]} ${pDev[1]} L ${pDns[0]} ${pDns[1]}" fill="none" stroke="#a59c90" stroke-width="1.8" stroke-dasharray="4 4" marker-end="url(#arrow-muted)"/>
              <path d="${bentPathD}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            `,
            packetsSvg: `
              <circle r="4.3" fill="#f97316" stroke="${k}" stroke-width="1.3">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="${bentPathD}"/>
              </circle>
              <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
                <animateMotion dur="2.2s" begin="1.1s" repeatCount="indefinite" path="${Cr([pWeb, pBendDevWeb, pDev], 14)}"/>
              </circle>
            `,
            entsSvg: `${laptop.ent} ${dns.ent} ${web.ent}`,
            overSvg: `
              <g transform="translate(${(pDev[0] + pDns[0]) / 2 - 15}, ${(pDev[1] + pDns[1]) / 2 + 25})">
                ${renderPill(0, 0, "cached · 5 min", { tone: "paper" })}
              </g>
              <g transform="translate(38, 142)">
                ${renderPill(0, 0, "GET /products", { tone: "paper" })}
              </g>
              ${laptop.over}
              ${dns.over}
              ${web.over}
            `,
          };
        }
        // Step 4 & 5
        const bentDevGateway = Cr([pDev, [-28, 64], [-24, -7]], 12);
        const gatewayToWeb = `M ${pDns[0]} ${pDns[1]} L ${pWeb[0]} ${pWeb[1]}`;
        const webToDb = `M ${pWeb[0]} ${pWeb[1]} L ${pDb[0]} ${pDb[1]}`;
        const laptop = renderLaptop(0, -12, "you", "https://shop.example");
        const gateway = renderCube(0, 1, "Edge WAF", "Gateway", { color: "orange", glyph: "balancer" });
        const web = renderCube(10, -1, "Web", "Server", { color: "blue", glyph: "server", cpu: 0.28 });
        const db = renderDatabase(10, 12, "Primary DB");

        return {
          viewBox: "-380 -140 820 400",
          camCenterX: 30,
          camCenterY: 60,
          camRadius: 460,
          linksSvg: `
            <path d="${bentDevGateway}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${gatewayToWeb}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${webToDb}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="${gatewayToWeb}"/>
            </circle>
            <circle r="4.3" fill="#06b6d4" stroke="${k}" stroke-width="1.3">
              <animateMotion dur="2.5s" repeatCount="indefinite" path="${webToDb}"/>
            </circle>
          `,
          entsSvg: `${laptop.ent} ${gateway.ent} ${web.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(35, 110)">
              ${renderPill(0, 0, "TLS 1.3 / session", { tone: "green" })}
            </g>
            <g transform="translate(190, 20)">
              ${renderPill(0, 0, "SELECT * FROM items", { tone: "paper" })}
            </g>
            ${laptop.over}
            ${gateway.over}
            ${web.over}
            ${db.over}
          `,
        };
      }

      // AppSec Flow (BOLA, SQLi, SSRF, XSS):
      if (isAttackLesson) {
        const pAttacker: [number, number] = [-168, -28];
        const bentAttackerPath = Cr([pAttacker, [-60, 25], pWeb], 12);
        const bentClientPath = Cr([pDev, pBendDevWeb, pWeb], 14);
        const client = renderLaptop(0, -12, "acme (you)", "https://api.saas.io");
        const attacker = renderLaptop(-8, -4, "attacker", "tamper 4822", true);
        const web = renderCube(10, -1, "Web", "Server", { color: "blue", glyph: "server", cpu: step.stepNumber >= 4 ? 0.22 : 0.65 });
        const db = renderDatabase(10, 12, "Invoices DB");
        const shield = renderShieldWall(10, 5, "Scoped RLS Gate");

        if (step.stepNumber === 1) {
          return {
            viewBox: "-360 -140 760 380",
            camCenterX: 20,
            camCenterY: 50,
            camRadius: 420,
            linksSvg: `
              <path d="${bentClientPath}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
              <path d="M ${pWeb[0]} ${pWeb[1]} L ${pDb[0]} ${pDb[1]}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            `,
            packetsSvg: `
              <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
                <animateMotion dur="2.2s" repeatCount="indefinite" path="${bentClientPath}"/>
              </circle>
            `,
            entsSvg: `${client.ent} ${web.ent} ${db.ent}`,
            overSvg: `
              <g transform="translate(38, 142)">
                ${renderPill(0, 0, "GET /invoices/4821 (acme)", { tone: "green" })}
              </g>
              ${client.over}
              ${web.over}
              ${db.over}
            `,
          };
        }

        if (step.stepNumber === 2 || step.stepNumber === 3) {
          return {
            viewBox: "-380 -140 820 420",
            camCenterX: 30,
            camCenterY: 70,
            camRadius: 460,
            linksSvg: `
              <path d="${bentClientPath}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
              <path d="${bentAttackerPath}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
              <path d="M ${pWeb[0]} ${pWeb[1]} L ${pDb[0]} ${pDb[1]}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            `,
            packetsSvg: `
              <circle r="4.3" fill="#dc2626" stroke="${k}" stroke-width="1.3">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="${bentAttackerPath}"/>
              </circle>
            `,
            entsSvg: `${client.ent} ${attacker.ent} ${web.ent} ${db.ent}`,
            overSvg: `
              <g transform="translate(38, 142)">
                ${renderPill(0, 0, "GET /invoices/4821 (acme)", { tone: "green" })}
              </g>
              <g transform="translate(-15, 20)">
                ${renderPill(0, 0, "⚠️ GET /invoices/4822 (target)", { tone: "red" })}
              </g>
              ${client.over}
              ${attacker.over}
              ${web.over}
              ${db.over}
            `,
          };
        }

        // Step 4 & 5: Remediation
        const webToShield = `M ${pWeb[0]} ${pWeb[1]} L ${pShield[0]} ${pShield[1]}`;
        const shieldToDb = `M ${pShield[0]} ${pShield[1]} L ${pDb[0]} ${pDb[1]}`;
        return {
          viewBox: "-380 -140 840 420",
          camCenterX: 40,
          camCenterY: 70,
          camRadius: 470,
          linksSvg: `
            <path d="${bentClientPath}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${webToShield}" fill="none" stroke="${k}" stroke-width="2.2"/>
            <path d="${shieldToDb}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${bentAttackerPath}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
              <animateMotion dur="2.2s" repeatCount="indefinite" path="${bentClientPath}"/>
            </circle>
          `,
          entsSvg: `${client.ent} ${attacker.ent} ${web.ent} ${shield.ent} ${db.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "GET /invoices/4821 (acme)", { tone: "green" })}
            </g>
            <g transform="translate(-15, 20)">
              ${renderPill(0, 0, "403 BLOCKED (tenant scope)", { tone: "red" })}
            </g>
            ${client.over}
            ${attacker.over}
            ${web.over}
            ${shield.over}
            ${db.over}
          `,
        };
      }

      // AI & LLM Flow:
      const pSource: [number, number] = [-168, -28];
      const sourceToAgent = Cr([pSource, [-60, 25], pWeb], 12);
      const clientToAgent = Cr([pDev, pBendDevWeb, pWeb], 14);
      const agentToSink = `M ${pWeb[0]} ${pWeb[1]} L ${pDb[0]} ${pDb[1]}`;
      const user = renderLaptop(0, -12, "user", "agent://core");
      const untrustedSource = renderCube(-8, -4, "Untrusted", "Web Source", { color: "orange", glyph: "globe" });
      const agentCore = renderCube(10, -1, "AI Agent", "Core", { color: "purple", glyph: "brain", cpu: step.stepNumber >= 4 ? 0.32 : 0.78 });
      const vectorDb = renderDatabase(10, 12, "Vector DB");
      const guardrail = renderShieldWall(10, 5, "Dual-LLM Guardrail");

      if (step.stepNumber === 1) {
        return {
          viewBox: "-360 -140 760 380",
          camCenterX: 20,
          camCenterY: 50,
          camRadius: 420,
          linksSvg: `
            <path d="${clientToAgent}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${agentToSink}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
              <animateMotion dur="2s" repeatCount="indefinite" path="${clientToAgent}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${agentCore.ent} ${vectorDb.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "Prompt: Summarize Policy", { tone: "green" })}
            </g>
            ${user.over}
            ${agentCore.over}
            ${vectorDb.over}
          `,
        };
      }

      if (step.stepNumber === 2 || step.stepNumber === 3) {
        return {
          viewBox: "-380 -140 820 420",
          camCenterX: 30,
          camCenterY: 70,
          camRadius: 460,
          linksSvg: `
            <path d="${clientToAgent}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
            <path d="${sourceToAgent}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
            <path d="${agentToSink}" fill="none" stroke="#dc2626" stroke-width="2.2" marker-end="url(#arrow-red)"/>
          `,
          packetsSvg: `
            <circle r="4.3" fill="#dc2626" stroke="${k}" stroke-width="1.3">
              <animateMotion dur="1.8s" repeatCount="indefinite" path="${sourceToAgent}"/>
            </circle>
          `,
          entsSvg: `${user.ent} ${untrustedSource.ent} ${agentCore.ent} ${vectorDb.ent}`,
          overSvg: `
            <g transform="translate(38, 142)">
              ${renderPill(0, 0, "User Prompt", { tone: "green" })}
            </g>
            <g transform="translate(-15, 20)">
              ${renderPill(0, 0, "⚠️ Poisoned Context Injected", { tone: "red" })}
            </g>
            ${user.over}
            ${untrustedSource.over}
            ${agentCore.over}
            ${vectorDb.over}
          `,
        };
      }

      // Step 4 & 5
      const agentToShield = `M ${pWeb[0]} ${pWeb[1]} L ${pShield[0]} ${pShield[1]}`;
      const shieldToSink = `M ${pShield[0]} ${pShield[1]} L ${pDb[0]} ${pDb[1]}`;
      return {
        viewBox: "-380 -140 840 420",
        camCenterX: 40,
        camCenterY: 70,
        camRadius: 470,
        linksSvg: `
          <path d="${clientToAgent}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${agentToShield}" fill="none" stroke="${k}" stroke-width="2.2"/>
          <path d="${shieldToSink}" fill="none" stroke="${k}" stroke-width="2.2" marker-end="url(#arrow)"/>
          <path d="${sourceToAgent}" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="4 4" marker-end="url(#arrow-red)"/>
        `,
        packetsSvg: `
          <circle r="4.3" fill="#10b981" stroke="${k}" stroke-width="1.3">
            <animateMotion dur="2s" repeatCount="indefinite" path="${clientToAgent}"/>
          </circle>
        `,
        entsSvg: `${user.ent} ${untrustedSource.ent} ${agentCore.ent} ${guardrail.ent} ${vectorDb.ent}`,
        overSvg: `
          <g transform="translate(38, 142)">
            ${renderPill(0, 0, "Sanitized Prompt Response", { tone: "green" })}
          </g>
          <g transform="translate(-15, 20)">
            ${renderPill(0, 0, "Quarantined Injection", { tone: "red" })}
          </g>
          ${user.over}
          ${untrustedSource.over}
          ${agentCore.over}
          ${guardrail.over}
          ${vectorDb.over}
        `,
      };
    }, [step]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-[#f5efe6] w-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none"
    >
      <svg
        key={`stage-${step.id}-${replayCount}`}
        viewBox={viewBox}
        className="h-full w-full object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs
          dangerouslySetInnerHTML={{
            __html: renderDefs(camCenterX, camCenterY, camRadius),
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
          dangerouslySetInnerHTML={{ __html: linksSvg }}
        />
        {/* Layer 3: Animated Packets */}
        <g
          className="layer-packets"
          dangerouslySetInnerHTML={{ __html: packetsSvg }}
        />
        {/* Layer 4: 3D Hardware Entities */}
        <g
          className="layer-ents"
          dangerouslySetInnerHTML={{ __html: entsSvg }}
        />
        {/* Layer 5: Floating Pills and Badges */}
        <g
          className="layer-over"
          dangerouslySetInnerHTML={{ __html: overSvg }}
        />
      </svg>
    </div>
  );
}
