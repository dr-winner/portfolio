import { notFound } from "next/navigation";
import { hasPublishedWriteups } from "@/content/writeups";

export default function WriteupsPage() {
  if (!hasPublishedWriteups()) notFound();
  return null;
}
