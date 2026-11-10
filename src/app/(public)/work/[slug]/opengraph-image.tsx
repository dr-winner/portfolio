import { ImageResponse } from "next/og";
import { getWork } from "@/content/work";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Per-case social card (section 5.3): navy ground, the case title, a teal
   rule and the site mark. Same data as the page, no copy invented. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getWork(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#070a0f",
          color: "#e6edf5",
          padding: "72px",
          backgroundImage: "radial-gradient(90% 70% at 85% 0%, rgba(45,212,191,0.12), transparent 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", width: "44px", height: "44px", borderRadius: "10px", border: "1px solid rgba(148,163,184,0.25)", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>
            W
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#6b7787", letterSpacing: "0.12em" }}>WORK / {(slug ?? "").toUpperCase()}</div>
        </div>
        <div style={{ display: "flex", fontSize: 62, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.08, maxWidth: "940px" }}>
          {item?.title ?? "Application Security"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div style={{ display: "flex", width: "48px", height: "3px", backgroundColor: "#2dd4bf", borderRadius: "2px" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#a9b4c2" }}>drWinner · duvorrichardwinner.me</div>
        </div>
      </div>
    ),
    size,
  );
}
