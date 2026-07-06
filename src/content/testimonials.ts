export type Testimonial = {
  name: string;
  position: string;
  text: string;
  initials: string;
  accent?: "ocean" | "signal" | "ok";
};

export const testimonials: Testimonial[] = [
  {
    name: "Nicholas Kwasi",
    position: "CEO, Tanic Technologies",
    text: "Richard rebuilt our website from scratch. His attention to detail and understanding of our brand were exceptional. We're thrilled with what he delivered.",
    initials: "NK",
    accent: "ocean",
  },
  {
    name: "Alikamatu DevRel",
    position: "Software Engineer, PeerRamp",
    text: "Winner built our smart contracts with security in mind. Solid work across EVM chains. Easy to work with.",
    initials: "AD",
    accent: "signal",
  },
  {
    name: "Faith Tsewu",
    position: "Founder, SugarBite",
    text: "Winner built our restaurant web app. Clean UX, fast performance. Since launch, conversions are up significantly. Couldn't be happier.",
    initials: "FT",
    accent: "ok",
  },
  {
    name: "Suad Macaulay",
    position: "Front-End Developer, AIT",
    text: "Winner delivers quality work consistently. Good insights, strong work ethic. Easy recommendation.",
    initials: "SM",
    accent: "ocean",
  },
  {
    name: "Ewoenam Bridget",
    position: "Product Designer, AdanfoCash",
    text: "He turned our complex product into an intuitive interface. Solid UX. Founders loved it.",
    initials: "EB",
    accent: "signal",
  },
  {
    name: "Michael Brown",
    position: "HR Manager, ChainCheque",
    text: "Worked on our smart-contract security. Exceptional work. Great communicator. Highly recommended.",
    initials: "MB",
    accent: "ok",
  },
];
