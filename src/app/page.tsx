import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { SignalStrip } from "@/sections/SignalStrip";
import { Capabilities } from "@/sections/Capabilities";
import { Stack } from "@/sections/Stack";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Certifications } from "@/sections/Certifications";
import { Testimonials } from "@/sections/Testimonials";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { GitHubActivity } from "@/sections/GitHubActivity";
import { Footer } from "@/sections/Footer";
import {
  getCertifications,
  getExperience,
  getProjects,
  getStackCategories,
  getTestimonials,
} from "@/lib/content";

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
      <Header />
      <main
        id="main"
        className="relative pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))] md:pb-32"
      >
        <Hero />
        <SignalStrip />
        <Capabilities />
        <Stack categories={stack} />
        <Projects items={projects} />
        <Experience items={experience} />
        <Certifications items={certs} />
        <Testimonials items={testimonials} />
        <About />
        <GitHubActivity />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
