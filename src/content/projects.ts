import type { StaticImageData } from "next/image";
import proof9LandingPage from "@/assets/images/proof9.png";
import AIXMarketAnalyzer from "@/assets/images/AIXMarketAnalyzer.png";
import motiFiAi from "@/assets/images/motiFiAi.png";
import { projectsData, type ProjectData, type ProjectTag } from "./projects.data";

export type { ProjectTag };

export type Project = Omit<ProjectData, "imageFile"> & {
  /** Build-time imported screenshot (used by seed data). */
  image?: StaticImageData;
  /** Runtime URL for screenshots uploaded via the admin backend. */
  imageUrl?: string;
};

const seedImages: Record<string, StaticImageData> = {
  "proof9.png": proof9LandingPage,
  "AIXMarketAnalyzer.png": AIXMarketAnalyzer,
  "motiFiAi.png": motiFiAi,
};

export const projects: Project[] = projectsData.map(({ imageFile, ...rest }) => ({
  ...rest,
  image: imageFile ? seedImages[imageFile] : undefined,
}));
