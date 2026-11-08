import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { profile } from "@/content/profile";

export const alt = `${profile.name} | ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <OgCard eyebrow="drWinner" title={profile.headline} detail={profile.headlineSub} />,
    { ...size },
  );
}
