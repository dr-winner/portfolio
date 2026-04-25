import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          backgroundColor: "#05070d",
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(60,207,255,0.25), transparent 55%), radial-gradient(circle at 95% 100%, rgba(255,174,0,0.18), transparent 55%)",
          color: "#e6ecf7",
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
            dr_winner
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 34, color: "#a8b2c7" }}>{profile.name}</div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
              background: "linear-gradient(135deg, #7ee2ff 0%, #ffae00 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            SOC Analyst & AI Engineer
          </div>
          <div style={{ fontSize: 32, color: "#c4cde0", maxWidth: 900 }}>
            {profile.tagline}
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
          <div>AWS · Azure · GCP</div>
          <div>•</div>
          <div>MITRE ATT&CK</div>
          <div>•</div>
          <div>Agentic AI</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
