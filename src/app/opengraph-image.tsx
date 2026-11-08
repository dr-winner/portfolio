import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} | ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const roleLines = [profile.headline, profile.headlineSub];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#07090C",
          color: "#E8EDF2",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#7ee2ff" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#3ccfff",
              boxShadow: "0 0 24px 4px rgba(60,207,255,0.7)",
            }}
          />
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>
            {profile.handle}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 34, color: "#a8b2c7" }}>{profile.name}</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
              whiteSpace: "pre-line",
              background: "linear-gradient(135deg, #7ee2ff 0%, #ffae00 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {roleLines.map((role) => (
              <div key={role}>{role}</div>
            ))}
          </div>
          <div style={{ fontSize: 28, color: "#c4cde0", maxWidth: 900 }}>
            {profile.location}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            color: "#8693ad",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div>duvorrichardwinner.me</div>
          <div>•</div>
          <div>{profile.location}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
