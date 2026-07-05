import LandingNavbar from "@/components/sections/landing-page/Navbar";
import HeroSection from "@/components/sections/landing-page/HeroSection";
import HowItWorks from "@/components/sections/landing-page/HowItWorks";
import TechnicianCTA from "@/components/sections/landing-page/TechnicianCTA";
import FeaturesSection from "@/components/sections/landing-page/FeaturesSection";
import FAQSection from "@/components/sections/client/home/FAQSection";
import Footer from "@/components/layout/Footer";
import AIDiagnosis from "@/components/sections/landing-page/AIdiagnosis";
import "@/styles/sectionsLayout.css";
import MainCategoriesSection from "@/components/sections/landing-page/MainCategoriesSection";

export default function LandingPage() {
  return (
    <main>
      <LandingNavbar />
      <HeroSection />
      <HowItWorks />
      <MainCategoriesSection />
      <AIDiagnosis />
      <FeaturesSection />
      <TechnicianCTA />
      <FAQSection />
      <Footer />
    </main>
  );
}