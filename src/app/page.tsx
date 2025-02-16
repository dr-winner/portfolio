import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { ProjectsSection } from "@/sections/Projects";
import { Tape } from "@/sections/Tape";
import { Testimonials } from "@/sections/Testimonials";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <ProjectsSection />
      <Tape/>
      <Testimonials />
    </div>
  );
}
