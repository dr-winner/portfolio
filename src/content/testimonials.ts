export type Testimonial = {
  name: string;
  position: string;
  text: string;
  initials: string;
  accent?: "cyber" | "signal" | "ok";
};

export const testimonials: Testimonial[] = [
  {
    name: "Nicholas Kwasi",
    position: "CEO, Tanic Technologies",
    text: "Richard was instrumental in transforming our website into a powerful digital experience. His attention to detail and his grasp of our brand were exceptional — we're thrilled with the work he delivered.",
    initials: "NK",
    accent: "cyber",
  },
  {
    name: "Alikamatu DevRel",
    position: "Software Engineer, PeerRamp",
    text: "Working with Winner was a pleasure. His expertise in smart-contract development brought our project to life, and he is genuinely focused on security implementation across EVM-compatible chains.",
    initials: "AD",
    accent: "signal",
  },
  {
    name: "Faith Tsewu",
    position: "Founder, SugarBite",
    text: "Winner's ability to craft seamless user experiences is unmatched. Since we launched our new restaurant web application we've seen a significant increase in conversions. We couldn't be happier.",
    initials: "FT",
    accent: "ok",
  },
  {
    name: "Suad Macaulay",
    position: "Front-End Developer, AIT",
    text: "Winner is an exceptionally dedicated engineer who consistently delivers high-quality work. His insights and work ethic make him an outstanding asset — I have no hesitation recommending him.",
    initials: "SM",
    accent: "cyber",
  },
  {
    name: "Ewoenam Bridget",
    position: "Product Designer, AdanfoCash",
    text: "A true frontend wizard. He translated our complex product into an intuitive, engaging interface with solid UX — and the feedback from founders has been overwhelmingly positive.",
    initials: "EB",
    accent: "signal",
  },
  {
    name: "Michael Brown",
    position: "HR Manager, ChainCheque",
    text: "He worked on our smart-contract security implementation and was nothing short of exceptional. A talented developer and a great communicator — highly recommended.",
    initials: "MB",
    accent: "ok",
  },
  {
    name: "Security Lead — to be added",
    position: "SOC / Security team",
    text: "Add a testimonial here from a security colleague — mentor, SOC lead, or IR partner. This placeholder is visible only to you.",
    initials: "SL",
    accent: "signal",
  },
];
