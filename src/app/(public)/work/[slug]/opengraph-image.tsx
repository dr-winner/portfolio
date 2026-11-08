import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";
import { getWork } from "@/content/work";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export const alt = "Case study";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getWork(slug);
  const title = item?.title ?? "Work";
  const detail = item?.card ?? "Application security case study";
  return new ImageResponse(<OgCard eyebrow="drWinner" title={title} detail={detail} />, { ...size });
}
