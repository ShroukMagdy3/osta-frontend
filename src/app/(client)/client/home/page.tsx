import HeroSection from "@/components/sections/client/home/HeroSection";
import MainCategoriesSection from "@/components/sections/client/home/MainCategoriesSection";
import CommonServicesSection from "@/components/sections/client/home/CommonServicesSection";
import HowItWorksSection from "@/components/sections/client/home/HowItWorksSection";
import TestimonialsSection from "@/components/sections/client/home/TestimonialsSection";
import FAQSection from "@/components/sections/client/home/FAQSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MainCategoriesSection />
      <CommonServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}