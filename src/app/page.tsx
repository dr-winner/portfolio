import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { SignalStrip } from "@/sections/SignalStrip";
import { Capabilities } from "@/sections/Capabilities";
import { Stack } from "@/sections/Stack";
import { TechMarquee } from "@/sections/TechMarquee";
import { HorizontalProjects } from "@/sections/HorizontalProjects";
import { Experience } from "@/sections/Experience";
import { Certifications } from "@/sections/Certifications";
import { Testimonials } from "@/sections/Testimonials";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Mentorship } from "@/sections/Mentorship";
import { GitHubActivity } from "@/sections/GitHubActivity";
import { Footer } from "@/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import {
  getCertifications,
  getExperience,
  getProjects,
  getStackCategories,
  getTestimonials,
} from "@/lib/content";
import { projectsListSchema } from "@/lib/structured-data";

export const revalidate = 60;

export default async function Home() {
  const [projects, stack, experience, certs, testimonials] = await Promise.all([
    getProjects(),
    getStackCategories(),
    getExperience(),
    getCertifications(),
    getTestimonials(),
  ]);

  return (
    <>
      {/* Structured data — projects list for search-engine rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projectsListSchema(
              projects.map((p) => ({
                title: p.title,
                slug: p.slug,
                summary: p.summary ?? "",
                link: p.link ?? null,
              })),
            ),
          ),
        }}
      />

      <Header />
      <main
        id="main"
        className="relative min-w-0 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))] md:pb-32"
      >
        <Hero />
        <SignalStrip />
        <Capabilities />
        <Stack categories={stack} />
        {/* TechMarquee replaces the previous Marquee component */}
        <TechMarquee />
        <HorizontalProjects items={projects} />
        <Experience items={experience} />
        <Certifications items={certs} />
        <Testimonials items={testimonials} />
        <About />
        <GitHubActivity />
        <Mentorship />
        <Contact />
        <ScrollToTop />
      </main>
      <Footer />
    </>
  );
}
