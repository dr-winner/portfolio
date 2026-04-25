"use client";

import { Card } from "@/components/Card";
import { GitHubLivePanel } from "@/components/GitHubLivePanel";
import { SectionHeader } from "@/components/SectionHeader";

export function GitHubActivity() {
  return (
    <section
      id="github-activity"
      className="relative py-20 md:py-28"
      aria-labelledby="github-activity-title"
    >
      <div className="container">
        <SectionHeader
          id="github-activity-title"
          align="center"
          eyebrow="Open source"
          title="GitHub"
        />

        <div className="mt-12 max-w-6xl space-y-8 lg:mt-16 lg:mx-auto">
          <Card className="p-5 sm:p-6 md:p-8 lg:px-10 lg:py-8" glow>
            <GitHubLivePanel />
          </Card>
        </div>
      </div>
    </section>
  );
}
