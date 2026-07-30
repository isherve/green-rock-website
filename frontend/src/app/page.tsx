import { HeroSection } from "@/components/home/HeroSection";
import { PropertyCategoriesSection } from "@/components/home/PropertyCategoriesSection";
import { PropertiesSection } from "@/components/home/PropertiesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { MaterialsSection } from "@/components/home/MaterialsSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PropertyCategoriesSection />
      <PropertiesSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <MaterialsSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <PartnersSection />
      <ContactCTA />
    </>
  );
}
