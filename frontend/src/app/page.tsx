import { HeroSection } from "@/components/home/HeroSection";
import { PropertyCategoriesSection } from "@/components/home/PropertyCategoriesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PropertiesSection } from "@/components/home/PropertiesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { MaterialsSection } from "@/components/home/MaterialsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeFaqSection } from "@/components/home/HomeFaqSection";
import { ContactCTA } from "@/components/home/ContactCTA";
import { PortalsSection } from "@/components/home/PortalsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PropertyCategoriesSection />
      <WhyChooseUs />
      <ServicesSection />
      <PropertiesSection />
      <ProjectsSection />
      <MaterialsSection />
      <TestimonialsSection />
      <HomeFaqSection />
      <ContactCTA />
      <PortalsSection />
    </>
  );
}
