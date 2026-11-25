import { Banner } from "@/components/home/Banner";
import { Categories } from "@/components/home/Categories";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChoose } from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedServices />
      <Categories />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}