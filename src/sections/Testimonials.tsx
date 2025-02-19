import memojiAvatar1 from "@/assets/images/memoji-avatar-1.png";
import memojiAvatar2 from "@/assets/images/memoji-avatar-2.png";
import memojiAvatar3 from "@/assets/images/memoji-avatar-3.png";
import memojiAvatar4 from "@/assets/images/memoji-avatar-4.png";
import memojiAvatar5 from "@/assets/images/memoji-avatar-5.png";
import { SectionHeader } from "@/components/SectionHeader";
import Image from "next/image";
import { Card } from "@/components/Card";

const testimonials = [
  {
    name: "Nicholas Kwasi",
    position: "Chief Executive Officer @ Tanic Tchnologies",
    text: "Richard Winner was instrumental in transforming our website into a powerful digital experience. His attention to detail and ability to understand our brand is exceptional. We're thrilled with his good works!",
    avatar: memojiAvatar1,
  },
  {
    name: "Alikamatu DevRel",
    position: "Software Engineer @ Peer Ramp",
    text: "Working with Winner was a pleasure. His expertise in smart contracts development brought our project to life in a way we never imagined. He is pretty keen on security implemtation accross a number of chain, especially EVM compatible chains.",
    avatar: memojiAvatar3,
  },
  {
    name: "Faith Tsewu",
    position: "Founder @ SugarBite",
    text: "Eng. Winner's ability to create seamless user experiences is unmatched. Our website has seen a significant increase in conversions since we launch our new restaurant web applicaton. We couldn't be happier.",
    avatar: memojiAvatar2,
  },
  {
    name: "Ewoenam Bridget",
    position: "Product Manager @ AdanfoCash",
    text: "He is a true frontend wizard for real!. He developed our complex product and transformed it into an intuitive and engaging user interface and solid user experience. We're already seeing positive feedback from our founders, kudus!.",
    avatar: memojiAvatar4,
  },
  {
    name: "Michael Brown",
    position: "Human Resource Manager @ ChainCheck",
    text: "He is a solid engineer who worked on our smart contract security implementation and he has been nothing short of exceptional. He's a talented developer Africa could ever be blessed with and he is also a great communicator. We highly recommend him.",
    avatar: memojiAvatar5,
  },
];

export const Testimonials = () => {
  return (
    <div className="py-16 lg:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Happy Clients"
          title="Explore what my happy clients testify bout me"
          description="But, wait! Dont just take my words for it. This is just a few testimonies
        about me from all around the world"
        />
        <div className="mt-16 lg:mt-24 flex overflow-x-clip [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-8 flex-none">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="max-w-xs md:max-w-md p-6 md:p-8 "
              >
                <div className="flex gap-4 items-center">
                  <div className="size-14 bg-gray-700 items-center justify-center inloine-flex rounded-full flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="max-h-full"
                    />
                  </div>
                  <div className="">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-white/40">
                      {testimonial.position}
                    </div>
                  </div>
                </div>
                <p className="mt-4 md:mt-6 text-sm md:text-base">
                  {testimonial.text}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
